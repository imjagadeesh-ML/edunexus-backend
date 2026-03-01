from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models
from datetime import datetime, timedelta

def seed_notifications():
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(models.CampusNotification).first():
            print("Notifications already seeded.")
            return

        notices = [
            models.CampusNotification(
                title="End Semester Lab Exams Schedule",
                content="The final lab examinations for the current semester will commence from May 15th. Detailed schedule by branch is posted on the notice board.",
                priority="High",
                category="Academic",
                expires_at=datetime.utcnow() + timedelta(days=30)
            ),
            models.CampusNotification(
                title="Placement Drive: Google & Microsoft",
                content="Upcoming on-campus placement drives for Final Year students. Please ensure your portfolios are updated in EduNexus.",
                priority="Urgent",
                category="Placement",
                expires_at=datetime.utcnow() + timedelta(days=15)
            ),
            models.CampusNotification(
                title="Annual Cultural Fest - EUPHORIA 2026",
                content="Registration for the annual cultural fest is now open. Coordinate with your department heads for participation.",
                priority="Normal",
                category="Event",
                expires_at=datetime.utcnow() + timedelta(days=45)
            )
        ]
        db.add_all(notices)
        db.commit()
        print("Successfully seeded campus notifications!")
    except Exception as e:
        print(f"Error seeding: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_notifications()
