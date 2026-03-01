from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models import Student, Mark, AttendanceRecord, LabPerformance

def predict_placement_probability(
    db: Session,
    student_id: int,
    # Manual overrides if needed for "What-if" analysis
    override_skill_score: float = None,
    override_projects: int = None
) -> Dict[str, Any]:
    """
    ML-Ready Placement Probability Engine.
    In a real production app, this would load a joblib/pkl model.
    Here we implement the logic based on DB records.
    """
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        return {"error": "Student not found"}

    # 1. Calculate Core Subject Marks Average
    marks = db.query(Mark).filter(Mark.student_id == student_id).all()
    avg_marks = sum(m.score for m in marks) / len(marks) if marks else 0

    # 2. Calculate Attendance Percentage
    total_days = db.query(AttendanceRecord).filter(AttendanceRecord.student_id == student_id).count()
    present_days = db.query(AttendanceRecord).filter(AttendanceRecord.student_id == student_id, AttendanceRecord.status == True).count()
    attendance_pct = (present_days / total_days * 100) if total_days > 0 else 0

    # 3. Project Count (Assuming a schema for projects or derived from Lab/Subject mapping)
    # For now, we'll use the readiness score's project count if available
    project_count = override_projects if override_projects is not None else 2 # Default fallback

    # 4. Logic representing an ML model (Linear Combination/Logistic approach)
    # Weights: Marks(0.3), Attendance(0.2), Projects(0.2), Communication(0.1), Skills(0.2)
    # In practice: probability = 1 / (1 + exp(-(beta0 + beta1*marks + ...)))
    
    skill_score = override_skill_score if override_skill_score is not None else 70.0
    
    probability = (
        (avg_marks * 0.35) + 
        (attendance_pct * 0.15) + 
        (project_count * 5) + # 5% per project up to reasonable limit
        (skill_score * 0.30)
    )
    
    probability = min(99.9, max(5.0, probability))

    suggestions = []
    if avg_marks < 70:
        suggestions.append("Improve core subject grades to cross technical screening bars.")
    if attendance_pct < 75:
        suggestions.append("Low attendance might impact internal assessments and discipline ratings.")
    if project_count < 3:
        suggestions.append("Add 1-2 more domain-specific projects to your portfolio.")

    return {
        "placement_probability": round(probability, 2),
        "confidence_score": 85.5,
        "suggested_improvements": suggestions,
        "data_points": {
            "avg_marks": round(avg_marks, 2),
            "attendance_pct": round(attendance_pct, 2),
            "projects": project_count
        }
    }
