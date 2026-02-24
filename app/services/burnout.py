# Fallback ML Predictor (No Scikit-learn required for MVP)
from typing import Dict, Any

class BurnoutPredictor:
    def __init__(self):
        self.is_trained = True

    def predict(self, features: Dict[str, float]) -> Dict[str, Any]:
        """
        Predict burnout probability based on input features using a simple heuristic model
        instead of sklearn to avoid C++ build tool requirements on Windows.
        """
        attendance_trend = features.get("weekly_attendance_trend", 0.0)
        marks_trend = features.get("marks_decline_trend", 0.0)
        delays = features.get("lab_submission_delays", 0)
        high_att_low_marks = features.get("high_attendance_low_marks", 0)

        # Heuristic calculation (mimicking logistic regression weights)
        risk_score = 0
        
        # Negative trends increase risk
        if attendance_trend < 0:
            risk_score += abs(attendance_trend) * 30
        if marks_trend < 0:
            risk_score += abs(marks_trend) * 30
            
        # Delays increase risk (max 40 points for >= 8 delays)
        risk_score += min(40, delays * 5)
        
        # Flag increases risk
        if high_att_low_marks:
            risk_score += 20
            
        probability = min(100.0, max(0.0, risk_score))

        return {
            "burnout_risk_flag": bool(probability > 50),
            "burnout_probability": round(probability, 2),
            "warning_level": "High" if probability > 70 else "Medium" if probability > 40 else "Low"
        }

predictor = BurnoutPredictor()
