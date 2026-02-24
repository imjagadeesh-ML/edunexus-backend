from typing import Dict, Any, List

def predict_placement_probability(
    skill_readiness_score: float,
    project_count: int,
    internship_status: bool,
    communication_rating: float, # 0 to 10
    core_subject_marks: float # 0 to 100
) -> Dict[str, Any]:
    """
    Placement Probability Engine (MVP Statistical Model)
    
    Weights for Probability:
    - Skill Readiness: 35%
    - Projects: 20% (Max 5 projects)
    - Internships: 15% (Binary)
    - Communication: 10%
    - Core Subjects: 20%
    """
    
    skill_score = (max(0, min(100, skill_readiness_score)) / 100) * 35
    proj_score = (min(5, project_count) / 5) * 20
    intern_score = 15 if internship_status else 0
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
    if communication_rating < 7:
        suggestions.append("Participate in mock interviews and group discussions to improve communication skills.")
    if core_subject_marks < 65:
        suggestions.append("Revise core CS subjects (OS, DBMS, CN, DSA) for technical rounds.")
    
    if len(suggestions) == 0:
        suggestions.append("Profile looks great! Focus on advanced competitive programming or system design.")
        
    confidence_score = 85.5 # Static MVP baseline based on sample data variance

    return {
        "placement_probability": round(probability, 2),
        "confidence_score": confidence_score,
        "suggested_improvements": suggestions
    }
