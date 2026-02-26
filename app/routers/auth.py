from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from datetime import timedelta

from app import schemas, crud, models
from app.database import get_db
from app.core.security import verify_password, create_access_token
from app.core.config import settings

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

@router.get("/me", response_model=schemas.StudentOut)
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Return the profile of the currently logged-in student from their JWT."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    student = crud.get_student_by_email(db, email=email)
    if student is None:
        raise credentials_exception
    return student

@router.post("/register", response_model=schemas.StudentOut, status_code=status.HTTP_201_CREATED)
def register_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    """Register a new student account."""
    # Check if email already exists
    if crud.get_student_by_email(db, email=student.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )
    # Check if roll number already exists
    existing_roll = db.query(models.Student).filter(models.Student.roll_number == student.roll_number).first()
    if existing_roll:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this roll number already exists.",
        )
    return crud.create_student(db=db, student=student)

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
