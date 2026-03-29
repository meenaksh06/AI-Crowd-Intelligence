import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from typing import List, Dict

class CrowdForecaster:
    def __init__(self, degree: int = 3):
        self.poly = PolynomialFeatures(degree=degree)
        self.model = LinearRegression()
        self.is_trained = False

    def train(self, historical_data: List[Dict]):
        if len(historical_data) < 10:
            return False
        
        df = pd.DataFrame(historical_data)
        df['ts'] = pd.to_datetime(df['minute']).astype(np.int64) // 10**9
        
        # Normalize time to start from 0 for numerical stability
        self.start_ts = df['ts'].min()
        X = (df['ts'] - self.start_ts).values.reshape(-1, 1)
        y = df['unique_devices'].values
        
        X_poly = self.poly.fit_transform(X)
        self.model.fit(X_poly, y)
        self.is_trained = True
        return True

    def predict_next_hours(self, hours: int = 6, interval_minutes: int = 30) -> List[Dict]:
        if not self.is_trained:
            return []
        
        now = datetime.utcnow()
        predictions = []
        
        for i in range(1, (hours * 60 // interval_minutes) + 1):
            future_time = now + timedelta(minutes=i * interval_minutes)
            future_ts = int(future_time.timestamp()) - self.start_ts
            
            X_future = np.array([[future_ts]])
            X_poly = self.poly.transform(X_future)
            
            pred = self.model.predict(X_poly)[0]
            # Ensure no negative predictions and add some damping for realism
            pred = max(0, float(pred))
            
            predictions.append({
                "timestamp": future_time,
                "predicted_people": round(pred / 1.2, 1) # Using same factor as backend
            })
            
        return predictions

def get_forecast(historical_data: List[Dict]) -> List[Dict]:
    forecaster = CrowdForecaster()
    if forecaster.train(historical_data):
        return forecaster.predict_next_hours()
    return []
