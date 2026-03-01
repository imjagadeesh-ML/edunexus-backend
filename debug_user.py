import sys
import os
sys.path.append(os.getcwd())

from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Student
from app.core.security import verify_password, pwd_context

def check_user(email: str):
    db = SessionLocal()
    try:
        user = db.query(Student).filter(Student.email == email).first()
        if not user:
            print(f"User {email} NOT FOUND in database.")
            return

        print(f"User found: {user.email}")
        print(f"Hashed password in DB: {user.hashed_password}")
        
        # Identify the scheme
        try:
            scheme = pwd_context.identify(user.hashed_password)
            print(f"Identified scheme: {scheme}")
        except Exception as e:
            print(f"Could not identify scheme: {e}")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_user("jagadeeshvalmiki51@gmail.com")
