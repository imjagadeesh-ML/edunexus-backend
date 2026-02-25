from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app import schemas, crud, models
from app.database import get_db
from app.core.security import verify_password, create_access_token
from app.core.config import settings

router = APIRouter()

@router.post("/login", response_model=schemas.Token)
def login_for_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    print(f"DEBUG: Login attempt for email: '{form_data.username}'")
    user = crud.get_student_by_email(db, email=form_data.username)
    if not user:
        print(f"DEBUG: User not found in database: '{form_data.username}'")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    match = verify_password(form_data.password, user.hashed_password)
    print(f"DEBUG: Password match for {user.email}: {match}")
    
    if not match:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.email, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/debug-students")
def debug_students(db: Session = Depends(get_db)):
    students = db.query(models.Student).all()
    return [{"id": s.id, "email": s.email, "has_hash": bool(s.hashed_password)} for s in students]
