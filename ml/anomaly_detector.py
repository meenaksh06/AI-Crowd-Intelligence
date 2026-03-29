import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from typing import List, Dict

class AnomalyDetector:
    def __init__(self, contamination: float = 0.05):
        self.model = IsolationForest(contamination=contamination, random_state=42)
        self.is_trained = False

    def detect(self, historical_data: List[Dict]) -> List[Dict]:
        if len(historical_data) < 10:
            return []
        
        df = pd.DataFrame(historical_data)
        X = df[['unique_devices']].values
        
        # Fit and predict
        self.model.fit(X)
        preds = self.model.predict(X) # 1 for normal, -1 for anomaly
        scores = self.model.decision_function(X)
        
        results = []
        for i, row in df.iterrows():
            results.append({
                "timestamp": row['minute'],
                "ap_id": row['ap_id'],
                "people_count": round(row['unique_devices'] / 1.2, 1),
                "is_anomaly": bool(preds[i] == -1),
                "score": float(scores[i])
            })
            
        return results

def get_anomalies(historical_data: List[Dict]) -> List[Dict]:
    detector = AnomalyDetector()
    return detector.detect(historical_data)
