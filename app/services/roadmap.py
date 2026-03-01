from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models import Skill, Student

def get_career_roadmap(db: Session, student_id: int) -> Dict[str, Any]:
    """
    Generate a 4-year career roadmap based on skill progression.
    """
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        return {"error": "Student not found"}

    all_skills = db.query(Skill).order_by(Skill.academic_year).all()
    
    roadmap = {
        "1": [], # 1st Year
        "2": [], # 2nd Year
        "3": [], # 3rd Year
        "4": []  # Final Year
    }
    
    for skill in all_skills:
        year_str = str(skill.academic_year)
        if year_str in roadmap:
            roadmap[year_str].append({
                "id": skill.id,
                "name": skill.name,
                "description": skill.description,
                "status": "Target" if skill.academic_year > student.current_year else "In Progress" if skill.academic_year == student.current_year else "Completed"
            })
            
    return {
        "current_year": student.current_year,
        "roadmap": roadmap,
        "status_summary": {
            "completed": sum(1 for y in roadmap for s in roadmap[y] if s["status"] == "Completed"),
            "target": sum(1 for y in roadmap for s in roadmap[y] if s["status"] == "Target"),
            "active": sum(1 for y in roadmap for s in roadmap[y] if s["status"] == "In Progress")
        }
    }
