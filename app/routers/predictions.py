from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from app.services.scoring import calculate_readiness_score
from app.services.burnout import predictor
from app.services.placement import predict_placement_probability
from app.services.report import generate_accreditation_report

router = APIRouter()

class ReadinessInput(BaseModel):
    avg_marks: float
    attendance_pct: float
    lab_score: float
    skill_coverage_pct: float
    project_count: int
    missing_skills: Optional[List[str]] = []

class BurnoutInput(BaseModel):
    weekly_attendance_trend: float
    marks_decline_trend: float
    lab_submission_delays: int
    high_attendance_low_marks: int

class PlacementInput(BaseModel):
    skill_readiness_score: float
    project_count: int
    internship_status: bool
    internship_type: Optional[str] = "None"
    internship_duration: Optional[int] = 0
    communication_rating: float
    core_subject_marks: float

class ReportInput(BaseModel):
    department_name: str
    total_students: int
    avg_attendance: float
    avg_skill_readiness: float
    placement_probability_avg: float
    faculty_heatmap_summary: Dict[str, Any]
    top_industry_roles: List[str]

@router.post("/readiness-score")
def get_readiness_score(data: ReadinessInput):
    return calculate_readiness_score(
        avg_marks=data.avg_marks,
        attendance_pct=data.attendance_pct,
        lab_score=data.lab_score,
        skill_coverage_pct=data.skill_coverage_pct,
        project_count=data.project_count,
        missing_skills=data.missing_skills
    )

@router.post("/predict-burnout")
def predict_burnout(data: BurnoutInput):
    # Pass as dictionary to the predictor
    return predictor.predict(data.dict())

@router.post("/predict-placement")
def predict_placement(data: PlacementInput):
    return predict_placement_probability(
        skill_readiness_score=data.skill_readiness_score,
        project_count=data.project_count,
        internship_status=data.internship_status,
        internship_type=data.internship_type,
        internship_duration=data.internship_duration,
        communication_rating=data.communication_rating,
        core_subject_marks=data.core_subject_marks
    )

@router.post("/generate-report")
def generate_report(data: ReportInput):
    return generate_accreditation_report(
        department_name=data.department_name,
        total_students=data.total_students,
        avg_attendance=data.avg_attendance,
        avg_skill_readiness=data.avg_skill_readiness,
        placement_probability_avg=data.placement_probability_avg,
        faculty_heatmap_summary=data.faculty_heatmap_summary,
        top_industry_roles=data.top_industry_roles
    )
