from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    roll_number = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    attendance = relationship("AttendanceRecord", back_populates="student")
    marks = relationship("Mark", back_populates="student")
    lab_performance = relationship("LabPerformance", back_populates="student")
    readiness_score = relationship("ReadinessScore", back_populates="student", uselist=False)
    placement_prediction = relationship("PlacementPrediction", back_populates="student", uselist=False)

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    code = Column(String, unique=True, index=True)
    credits = Column(Integer)

class AttendanceRecord(Base):
    __tablename__ = "attendance_records"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    date = Column(DateTime, default=datetime.utcnow)
    status = Column(Boolean) # True for present, False for absent

    student = relationship("Student", back_populates="attendance")

class Mark(Base):
    __tablename__ = "marks"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    exam_type = Column(String) # Midterm, Final, Assignment
    score = Column(Float)
    max_score = Column(Float)

    student = relationship("Student", back_populates="marks")

class LabPerformance(Base):
    __tablename__ = "lab_performance"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    score = Column(Float)
    max_score = Column(Float)

    student = relationship("Student", back_populates="lab_performance")

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text, nullable=True)

class IndustryRole(Base):
    __tablename__ = "industry_roles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, index=True)
    average_salary = Column(String, nullable=True)

class RoleSkillMapping(Base):
    __tablename__ = "role_skill_mapping"

    role_id = Column(Integer, ForeignKey("industry_roles.id"), primary_key=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), primary_key=True)

class SubjectIndustryMapping(Base):
    __tablename__ = "subject_industry_mapping"

    subject_id = Column(Integer, ForeignKey("subjects.id"), primary_key=True)
    role_id = Column(Integer, ForeignKey("industry_roles.id"), primary_key=True)
    projects = Column(Text, nullable=True) # JSON stored as string or actual JSON column
    tools = Column(Text, nullable=True)

class ReadinessScore(Base):
    __tablename__ = "readiness_scores"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), unique=True)
    score = Column(Float)
    risk_level = Column(String) # Low, Medium, High
    missing_skills = Column(Text) # Comma separated or JSON
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="readiness_score")

class PlacementPrediction(Base):
    __tablename__ = "placement_predictions"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), unique=True)
    probability = Column(Float)
    confidence_score = Column(Float)
    suggestions = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="placement_prediction")

class ReadinessHistory(Base):
    __tablename__ = "readiness_history"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    score = Column(Float)
    recorded_at = Column(DateTime, default=datetime.utcnow)

class Badge(Base):
    __tablename__ = "badges"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text)
    icon_url = Column(String) # For frontend display

class StudentBadge(Base):
    __tablename__ = "student_badges"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    badge_id = Column(Integer, ForeignKey("badges.id"))
    awarded_at = Column(DateTime, default=datetime.utcnow)

class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    skill_name = Column(String, index=True)
    title = Column(String)
    url = Column(String)
    type = Column(String) # Video, Article, Course
