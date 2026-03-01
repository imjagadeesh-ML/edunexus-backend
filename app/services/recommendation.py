from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models import Resource

def get_recommendations_for_skills(db: Session, missing_skills: List[str]) -> List[Dict[str, Any]]:
    """
    Fetch recommended resources from the database for a list of missing skills.
    """
    if not missing_skills:
        return []
    
    recommendations = []
    for skill in missing_skills:
        resources = db.query(Resource).filter(Resource.skill_name.ilike(f"%{skill}%")).limit(2).all()
        for res in resources:
            recommendations.append({
                "skill": skill,
                "title": res.title,
                "url": res.url,
                "type": res.type
            })
            
    return recommendations
