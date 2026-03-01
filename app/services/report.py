from datetime import datetime
from typing import Dict, Any

def generate_accreditation_report(
    department_name: str,
    total_students: int,
    avg_attendance: float,
    avg_skill_readiness: float,
    placement_probability_avg: float,
    faculty_heatmap_summary: Dict[str, Any],
    top_industry_roles: list[str]
) -> Dict[str, Any]:
    """
    Generates a structured NAAC/NBA-ready academic performance report template.
    Returns JSON structure that can be converted to PDF on frontend.
    """
    
    report_date = datetime.utcnow().strftime("%Y-%m-%d")
    
    report = {
        "metadata": {
            "title": "Academic Intelligence & Performance Report",
            "department": department_name,
            "date": report_date,
            "generated_by": "StratAcade Engine",
            "framework_compliance": ["NAAC", "NBA"]
        },
        "executive_summary": {
            "total_students_analyzed": total_students,
            "department_attendance_avg": f"{round(avg_attendance, 2)}%",
            "cohort_skill_readiness": f"{round(avg_skill_readiness, 2)}/100"
        },
        "placement_insights": {
            "average_placement_probability": f"{round(placement_probability_avg, 2)}%",
            "top_industry_roles_mapped": top_industry_roles,
            "readiness_status": "Excellent" if avg_skill_readiness > 80 else "Satisfactory" if avg_skill_readiness > 60 else "Requires Intervention"
        },
        "faculty_heatmap": faculty_heatmap_summary,
        "recommendations": [
            "Integrate more hands-on lab sessions to improve real-world application." if avg_skill_readiness < 70 else "Maintain current lab curriculum standards.",
            "Conduct specialized workshops for missing industry tools." if placement_probability_avg < 60 else "Focus on advanced system design seminars."
        ]
    }
    
    return report
