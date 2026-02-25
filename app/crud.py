from sqlalchemy.orm import Session
from app import models, schemas
from app.core.security import get_password_hash

def get_student(db: Session, student_id: int):
    return db.query(models.Student).filter(models.Student.id == student_id).first()

def get_student_by_email(db: Session, email: str):
    return db.query(models.Student).filter(models.Student.email == email).first()

def create_student(db: Session, student: schemas.StudentCreate):
    hashed_password = get_password_hash(student.password)
    db_student = models.Student(
        name=student.name, 
        roll_number=student.roll_number,
        email=student.email, 
        hashed_password=hashed_password
    )
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

def get_subjects(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Subject).offset(skip).limit(limit).all()

def create_subject(db: Session, subject: schemas.SubjectCreate):
    db_subject = models.Subject(**subject.model_dump())
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

def create_attendance(db: Session, attendance: schemas.AttendanceCreate):
    db_attendance = models.AttendanceRecord(**attendance.model_dump())
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance

def create_mark(db: Session, mark: schemas.MarkCreate):
    db_mark = models.Mark(**mark.model_dump())
    db.add(db_mark)
    db.commit()
    db.refresh(db_mark)
    return db_mark

def get_readiness_score(db: Session, student_id: int):
    return db.query(models.ReadinessScore).filter(models.ReadinessScore.student_id == student_id).first()

def get_placement_prediction(db: Session, student_id: int):
    return db.query(models.PlacementPrediction).filter(models.PlacementPrediction.student_id == student_id).first()
