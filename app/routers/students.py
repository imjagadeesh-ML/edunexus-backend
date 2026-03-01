from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app import schemas, crud
from app.database import get_db

router = APIRouter()

@router.get("/subjects", response_model=List[schemas.SubjectOut])
def read_subjects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    subjects = crud.get_subjects(db, skip=skip, limit=limit)
    return subjects

@router.get("/{student_id}", response_model=schemas.StudentOut)
def read_student(student_id: int, db: Session = Depends(get_db)):
    db_student = crud.get_student(db, student_id=student_id)
    if db_student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return db_student

@router.get("/{student_id}/readiness")
def get_student_readiness(student_id: int, db: Session = Depends(get_db)):
    db_readiness = crud.get_readiness_score(db, student_id=student_id)
    if db_readiness is None:
        raise HTTPException(status_code=404, detail="Readiness score not found")
    return db_readiness

@router.get("/{student_id}/placement")
def get_student_placement(student_id: int, db: Session = Depends(get_db)):
    db_placement = crud.get_placement_prediction(db, student_id=student_id)
    if db_placement is None:
        raise HTTPException(status_code=404, detail="Placement prediction not found")
    return db_placement

@router.get("/{student_id}/dashboard-summary")
def get_dashboard_summary(student_id: int, db: Session = Depends(get_db)):
    student = crud.get_student(db, student_id=student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    readiness = crud.get_readiness_score(db, student_id=student_id)
    placement = crud.get_placement_prediction(db, student_id=student_id)
    
    return {
        "student": {
            "id": student.id,
            "name": student.name,
            "roll_number": student.roll_number,
            "email": student.email
        },
        "readiness": readiness,
        "placement": placement
    }
