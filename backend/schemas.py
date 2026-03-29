from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict
from datetime import datetime

class BaseSchema(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

class ProbeData(BaseSchema):
    ts: float
    ap_iface: str
    device: str
    rssi: int

class CrowdObservation(BaseSchema):
    ap_id: str
    zone: str
    unique_devices: int
    mean_rssi: Optional[float] = None
    est_people: float
    capacity: int
    occupancy_pct: float
    status: str

class CrowdResponse(BaseSchema):
    data: List[CrowdObservation]
    location: str
    location_name: str
    timestamp: datetime
    total_people: float
    zones_count: int

class ForecastPoint(BaseSchema):
    timestamp: datetime
    predicted_people: float

class PerformanceMetrics(BaseSchema):
    mae: float
    rmse: float

class PredictionResponse(BaseSchema):
    forecast: List[ForecastPoint]
    metrics: PerformanceMetrics
    model_type: str

class AnomalyPoint(BaseSchema):
    timestamp: datetime
    ap_id: str
    zone: str
    people_count: float
    is_anomaly: bool
    score: float

class AnomalyResponse(BaseSchema):
    anomalies: List[AnomalyPoint]
    threshold: float
