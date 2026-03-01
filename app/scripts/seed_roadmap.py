import sys
import os
sys.path.append(os.getcwd())

from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Skill, Student

def seed_roadmap_data():
    db = SessionLocal()
    try:
        # Seed Skills with academic years
        skills_data = [
            ("C Programming", 1, "Fundamentals of procedural programming."),
            ("Digital Logic", 1, "Core hardware concepts."),
            ("Python", 2, "High-level scripting and automation."),
            ("DS & Algorithms", 2, "Essential data structures."),
            ("Machine Learning", 3, "Advanced predictive modeling."),
            ("DBMS", 3, "Database management systems."),
            ("Cloud Computing", 4, "Scalable infrastructure."),
            ("Ethics in AI", 4, "Responsible AI practices.")
        ]
        
        for name, year, desc in skills_data:
            existing = db.query(Skill).filter(Skill.name == name).first()
            if not existing:
                db.add(Skill(name=name, academic_year=year, description=desc))
            else:
                existing.academic_year = year
        
        # Update first student to 3rd year for demo
        first_student = db.query(Student).first()
        if first_student:
            first_student.current_year = 3
            print(f"Updated {first_student.name} to Year 3 for roadmap demo.")
        
        db.commit()
        print("Roadmap seeding complete!")
    except Exception as e:
        print(f"Error seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_roadmap_data()
