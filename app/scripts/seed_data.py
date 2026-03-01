import sys
import os
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from app.database import SessionLocal, engine, Base
from app import models, crud
from app.core.security import get_password_hash

def seed_db():
    db = SessionLocal()
    try:
        # 1. Clear existing data (optional, but good for a fresh start)
        # Note: In production you'd be careful here.
        # Base.metadata.drop_all(bind=engine)
        # Base.metadata.create_all(bind=engine)

        print("Seeding subjects...")
        subjects_data = [
            {"name": "Data Structures", "code": "CS101", "credits": 4},
            {"name": "Python Programming", "code": "CS102", "credits": 3},
            {"name": "Machine Learning", "code": "CS301", "credits": 4},
            {"name": "Cloud Computing", "code": "CS401", "credits": 3},
            {"name": "Database Systems", "code": "CS201", "credits": 4}
        ]
        
        db_subjects = []
        for s in subjects_data:
            existing = db.query(models.Subject).filter(models.Subject.code == s["code"]).first()
            if not existing:
                new_s = models.Subject(**s)
                db.add(new_s)
                db_subjects.append(new_s)
            else:
                db_subjects.append(existing)
        db.commit()

        print("Seeding industry roles...")
        roles_data = [
            {"title": "Full Stack Engineer", "average_salary": "12-25 LPA"},
            {"title": "Data Scientist", "average_salary": "15-30 LPA"},
            {"title": "DevOps Engineer", "average_salary": "10-20 LPA"},
            {"title": "AI Researcher", "average_salary": "20-40 LPA"}
        ]
        
        db_roles = []
        for r in roles_data:
            existing = db.query(models.IndustryRole).filter(models.IndustryRole.title == r["title"]).first()
            if not existing:
                new_r = models.IndustryRole(**r)
                db.add(new_r)
                db_roles.append(new_r)
            else:
                db_roles.append(existing)
        db.commit()

        print("Creating Demo Student...")
        demo_email = "student@edunexus.ai"
        existing_student = db.query(models.Student).filter(models.Student.email == demo_email).first()
        
        if not existing_student:
            hashed_pw = get_password_hash("demo123")
            student = models.Student(
                name="Demo Student",
                roll_number="ENX2026-001",
                email=demo_email,
                hashed_password=hashed_pw
            )
            db.add(student)
            db.commit()
            db.refresh(student)
        else:
            student = existing_student

        print(f"Generating performance data for {student.name}...")
        # Add random attendance
        for subj in db_subjects:
            # Last 30 days
            for i in range(30):
                date = datetime.utcnow() - timedelta(days=i)
                status = random.random() > 0.15 # 85% attendance
                record = models.AttendanceRecord(
                    student_id=student.id,
                    subject_id=subj.id,
                    date=date,
                    status=status
                )
                db.add(record)
        
        # Add random marks
        for subj in db_subjects:
            db.add(models.Mark(
                student_id=student.id,
                subject_id=subj.id,
                exam_type="Midterm",
                score=random.uniform(70, 95),
                max_score=100
            ))
            db.add(models.Mark(
                student_id=student.id,
                subject_id=subj.id,
                exam_type="Assignment",
                score=random.uniform(80, 100),
                max_score=100
            ))

        db.commit()
        print("Successfully seeded database via Supabase!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
