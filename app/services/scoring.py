from typing import List, Dict, Any

def calculate_readiness_score(
    avg_marks: float,
    attendance_pct: float,
    lab_score: float,
    skill_coverage_pct: float,
    project_count: int,
    missing_skills: List[str] = None
) -> Dict[str, Any]:
    """
    Skill Readiness Scoring Algorithm for EduNexus AI
    
    Weights:
    - Average Marks: 30%
    - Attendance: 20%
    - Lab Performance: 20%
    - Skill Coverage: 20%
    - Project Count: 10% (Each project adds 20% to this category, max 5 projects = 100%)
    """
    # Normalize inputs
    avg_marks = max(0, min(100, avg_marks))
    attendance_pct = max(0, min(100, attendance_pct))
    lab_score = max(0, min(100, lab_score))
    skill_coverage_pct = max(0, min(100, skill_coverage_pct))
    
    project_score = min(100, project_count * 20.0)

    # Calculate weighted score
    readiness_score = (
        (avg_marks * 0.30) +
        (attendance_pct * 0.20) +
        (lab_score * 0.20) +
        (skill_coverage_pct * 0.20) +
        (project_score * 0.10)
    )

    # Determine Risk Classification
    if readiness_score >= 75:
        risk_classification = "Low"
    elif 50 <= readiness_score < 75:
        risk_classification = "Medium"
    else:
        risk_classification = "High"

    return {
        "readiness_score": round(readiness_score, 2),
        "risk_classification": risk_classification,
        "missing_skills": missing_skills or []
    }
