from typing import Dict, Any, List

def predict_placement_probability(
    skill_readiness_score: float,
    project_count: int,
    internship_status: bool,
    internship_type: str = "None",
    internship_duration: int = 0,
    communication_rating: float = 0, # 0 to 10
    core_subject_marks: float = 0 # 0 to 100
) -> Dict[str, Any]:
    """
    Enhanced Placement Probability Engine
    Weights:
    - Skill Readiness: 30%
    - Projects: 15%
    - Internships: 25% (Factoring Type & Duration)
    - Communication: 10%
    - Core Subjects: 20%
    """
    
    skill_score = (max(0, min(100, skill_readiness_score)) / 100) * 30
    proj_score = (min(5, project_count) / 5) * 15
    
    # Internship Scoring (Max 25%)
    intern_score = 0
    if internship_status:
        # Base status
        intern_score += 10 
        # Type bonus
        type_bonus = {"Technical": 10, "Industrial": 8, "Research": 7, "Corporate": 5}.get(internship_type, 0)
        intern_score += type_bonus
        # Duration bonus (Max 5%)
        duration_bonus = min(5, internship_duration)
        intern_score += duration_bonus

    comm_score = (max(0, min(10, communication_rating)) / 10) * 10
    core_score = (max(0, min(100, core_subject_marks)) / 100) * 20
    
    probability = skill_score + proj_score + intern_score + comm_score + core_score
    
    suggestions: List[str] = []
    if skill_readiness_score < 70:
        suggestions.append("Focus on upskilling core competencies required by industry roles.")
    if project_count < 3:
        suggestions.append("Build more full-stack or domain-specific projects to showcase practical skills.")
    if not internship_status:
        suggestions.append("Apply for summer internships or open-source programs to gain industry experience.")
    elif internship_duration < 3:
        suggestions.append("Aim for longer internships (3+ months) to gain deeper professional exposure.")
    
    if communication_rating < 7:
        suggestions.append("Participate in mock interviews and group discussions to improve communication skills.")
    if core_subject_marks < 65:
        suggestions.append("Revise core subjects for technical rounds.")
    
    if len(suggestions) == 0:
        suggestions.append("Profile looks great! Focus on specialized certifications or system design.")
        
    confidence_score = 88.0 

    return {
        "placement_probability": round(probability, 2),
        "confidence_score": confidence_score,
        "suggested_improvements": suggestions
    }
