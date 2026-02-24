from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# --- Student Schemas ---
class StudentBase(BaseModel):
    name: str
    roll_number: str
    email: EmailStr

class StudentCreate(StudentBase):
    password: str

class StudentOut(StudentBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# --- Subject Schemas ---
class SubjectBase(BaseModel):
    name: str
    code: str
    credits: int

class SubjectCreate(SubjectBase):
    pass

class SubjectOut(SubjectBase):
    id: int
    class Config:
        from_attributes = True

# --- Attendance Schemas ---
class AttendanceBase(BaseModel):
    subject_id: int
    status: bool

class AttendanceCreate(AttendanceBase):
    student_id: int

class AttendanceOut(AttendanceBase):
    id: int
    student_id: int
    date: datetime
    class Config:
        from_attributes = True

# --- Marks Schemas ---
class MarkBase(BaseModel):
    subject_id: int
    exam_type: str
    score: float
    max_score: float

class MarkCreate(MarkBase):
    student_id: int

class MarkOut(MarkBase):
    id: int
    student_id: int
    class Config:
        from_attributes = True

# --- Generic Token ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
