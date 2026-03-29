from fastapi import FastAPI, Query, HTTPException, Path
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
import os
import sys
from typing import List, Optional, Dict

# Add root to path for local imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))

import db
import schemas
from ml.forecaster import get_forecast
from ml.anomaly_detector import get_anomalies
import random
import time
import hashlib

app = FastAPI(
    title="CrowdIntel API",
    description="AI-Powered Campus Crowd Intelligence System",
    version="2.0.0"
)

# CORS Configuration
# In production, you should specify the Vercel app URL here
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "https://*.vercel.app", # Allow all vercel subdomains
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For simplicity in this demo, allow all. In production, use specific origins.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Database
db.init_db()

CAMPUS_LOCATIONS = {
    "main_campus": {
        "name": "Main Campus",
        "aps": [
            {"id": "AP-LIB-01", "zone": "Library Floor 1", "capacity": 150},
            {"id": "AP-LIB-02", "zone": "Library Floor 2", "capacity": 120},
            {"id": "AP-CAF-01", "zone": "Main Cafeteria", "capacity": 200},
            {"id": "AP-LEC-101", "zone": "Lecture Hall 101", "capacity": 300},
            {"id": "AP-LEC-102", "zone": "Lecture Hall 102", "capacity": 250},
            {"id": "AP-LAB-01", "zone": "Computer Lab A", "capacity": 60},
            {"id": "AP-GYM-01", "zone": "Sports Complex", "capacity": 100},
        ]
    },
    "engineering_block": {
        "name": "Engineering Block",
        "aps": [
            {"id": "AP-ENG-101", "zone": "CS Lab", "capacity": 80},
            {"id": "AP-ENG-102", "zone": "Workshop", "capacity": 50},
            {"id": "AP-ENG-LEC", "zone": "Engineering Hub", "capacity": 200},
        ]
    }
}

current_location = "main_campus"

def get_status(occupancy_pct: float) -> str:
    if occupancy_pct > 80: return "Critical"
    if occupancy_pct > 50: return "High"
    if occupancy_pct > 20: return "Moderate"
    return "Low"

@app.get("/", tags=["System"])
async def root():
    return {
        "app": "CrowdIntel",
        "status": "ready",
        "api_version": "2.0.0",
        "location": current_location
    }

@app.get("/locations", tags=["Configuration"])
async def get_locations():
    return {
        "current": current_location,
        "available": CAMPUS_LOCATIONS
    }

@app.post("/locations/{location_id}", tags=["Configuration"])
async def set_location(location_id: str = Path(..., description="ID of the campus location")):
    global current_location
    if location_id not in CAMPUS_LOCATIONS:
        raise HTTPException(status_code=404, detail="Location not found")
    
    current_location = location_id
    db.clear_data() # Reset session
    return {"status": "success", "location": location_id}

@app.get("/crowd", response_model=schemas.CrowdResponse, tags=["Analytics"])
async def get_crowd_data():
    aggs: List[Dict] = db.get_current_aggregates()
    loc_config: Dict = CAMPUS_LOCATIONS.get(current_location, {})
    aps_list: List[Dict] = loc_config.get("aps", [])
    ap_info: Dict[str, Dict] = {str(ap["id"]): ap for ap in aps_list}
    
    results: List[schemas.CrowdObservation] = []
    total_people: float = 0
    
    for a in aggs:
        ap_id = str(a['ap_id'])
        unique_devices = int(a['unique_devices'] or 0)
        mean_rssi = a.get('mean_rssi')
        
        # Simple estimation logic (devices / 1.2 person)
        est_people = round(float(unique_devices) / 1.2, 1)
        
        zone_info: Dict = ap_info.get(ap_id, {"zone": ap_id, "capacity": 100})
        capacity = int(zone_info.get("capacity", 100))
        occupancy_pct = round((est_people / float(capacity)) * 100, 1) if capacity > 0 else 0.0
        
        results.append(schemas.CrowdObservation(
            ap_id=ap_id,
            zone=str(zone_info.get("zone", ap_id)),
            unique_devices=unique_devices,
            mean_rssi=round(float(mean_rssi), 1) if mean_rssi is not None else None,
            est_people=est_people,
            capacity=capacity,
            occupancy_pct=min(float(occupancy_pct), 100.0),
            status=get_status(occupancy_pct)
        ))
        total_people += est_people
    
    return schemas.CrowdResponse(
        data=results,
        location=current_location,
        location_name=str(loc_config.get("name", "Unknown")),
        timestamp=datetime.now(timezone.utc),
        total_people=round(total_people, 1),
        zones_count=len(results)
    )

@app.get("/forecast", response_model=schemas.PredictionResponse, tags=["AI/ML"])
async def get_crowd_forecast():
    historical = db.get_historical_data(hours=12)
    if not historical:
        raise HTTPException(status_code=400, detail="Insufficient data for forecasting. Please run simulation first.")
    
    forecast_points = get_forecast(historical)
    
    return schemas.PredictionResponse(
        forecast=[schemas.ForecastPoint(timestamp=p["timestamp"], predicted_people=p["predicted_people"]) for p in forecast_points],
        metrics=schemas.PerformanceMetrics(mae=1.2, rmse=1.8), # Placeholder for real metrics
        model_type="Polynomial Regression (O3)"
    )

@app.get("/anomalies", response_model=schemas.AnomalyResponse, tags=["AI/ML"])
async def get_crowd_anomalies():
    historical = db.get_historical_data(hours=6)
    if not historical:
        raise HTTPException(status_code=400, detail="Insufficient data for anomaly detection.")
    
    anomalies = get_anomalies(historical)
    
    return schemas.AnomalyResponse(
        anomalies=[schemas.AnomalyPoint(**a) for a in anomalies],
        threshold=-0.15 # Isolation Forest threshold
    )

@app.post("/simulate", tags=["Data Production"])
async def simulate_data(hours: int = Query(default=6, ge=1, le=24)):
    db.clear_data()
    loc_config: Dict = CAMPUS_LOCATIONS[current_location]
    aps: List[Dict] = loc_config.get("aps", [])
    
    batch = []
    now = time.time()
    
    for h in range(hours):
        for m in range(0, 60, 5): # Every 5 minutes
            minute_ts = now - (h * 3600) - (m * 60)
            dt_obj = datetime.fromtimestamp(minute_ts, tz=timezone.utc)
            minute_str = dt_obj.strftime("%Y-%m-%dT%H:%M")
            
            # Simple daily cycle simulation
            hour_of_day = dt_obj.hour
            cycle_factor = 0.1 + 0.9 * (1 - abs(hour_of_day - 14) / 10) # Peak at 2 PM
            cycle_factor = max(0.1, float(cycle_factor))
            
            for ap in aps:
                # Add some randomness and anomalies
                capacity = int(ap.get("capacity", 100))
                base_crowd = int(float(capacity) * random.uniform(0.1, 0.4) * cycle_factor)
                
                if random.random() < 0.05: # 5% chance of anomaly
                    base_crowd = int(base_crowd * 2.5)
                
                crowd = max(1, base_crowd + random.randint(-2, 5))
                
                for _ in range(crowd):
                    mac = hashlib.sha256(str(random.random()).encode()).hexdigest()[:12]
                    rssi = random.randint(-80, -40)
                    batch.append((minute_str, str(ap.get("id")), mac, rssi))
                    
    db.insert_probes_batch(batch)
    db.compute_aggregates()
    
    return {"status": "success", "generated_probes": len(batch), "hours": hours}

@app.post("/ingest", tags=["Data Production"])
async def ingest_batch(probes: List[schemas.ProbeData]):
    batch = []
    for p in probes:
        batch.append((
            datetime.fromtimestamp(p.ts, tz=timezone.utc).strftime("%Y-%m-%dT%H:%M"),
            p.ap_iface,
            p.device,
            p.rssi
        ))
    db.insert_probes_batch(batch)
    db.compute_aggregates()
    return {"status": "success", "accepted": len(probes)}

@app.delete("/reset", tags=["System"])
async def reset_system():
    db.clear_data()
    return {"status": "reset_complete"}
