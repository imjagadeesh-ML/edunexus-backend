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
    current_year: int
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

# --- Skill Schemas ---
class SkillBase(BaseModel):
    name: str
    academic_year: int
    description: Optional[str] = None

class SkillOut(SkillBase):
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

# --- Collaboration Schemas ---
class SharedMaterialBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: str
    subject_id: int

class SharedMaterialCreate(SharedMaterialBase):
    file_path: str
    uploader_id: int

class SharedMaterialOut(SharedMaterialBase):
    id: int
    file_path: str
    uploader_id: int
    created_at: datetime
    class Config:
        from_attributes = True

class CampusNotificationBase(BaseModel):
    title: str
    content: str
    priority: str = "Normal"
    category: str

class CampusNotificationOut(CampusNotificationBase):
    id: int
    expires_at: Optional[datetime] = None
    created_at: datetime
    class Config:
        from_attributes = True

# --- AI Schemas ---
class AIRequest(BaseModel):
    material_id: int
    question: str

class AIResponse(BaseModel):
    answer: str
    material_title: str
