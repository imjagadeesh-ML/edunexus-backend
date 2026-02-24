-- schema.sql
-- Paste this into the Supabase SQL Editor

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    roll_number VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    credits INTEGER NOT NULL
);

-- Create attendance_records table
CREATE TABLE IF NOT EXISTS attendance_records (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status BOOLEAN NOT NULL -- true for present, false for absent
);
CREATE INDEX idx_attendance_student ON attendance_records(student_id);

-- Create marks table
CREATE TABLE IF NOT EXISTS marks (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    exam_type VARCHAR(50) NOT NULL,
    score DECIMAL(5, 2) NOT NULL,
    max_score DECIMAL(5, 2) NOT NULL
);
CREATE INDEX idx_marks_student ON marks(student_id);

-- Create lab_performance table
CREATE TABLE IF NOT EXISTS lab_performance (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    score DECIMAL(5, 2) NOT NULL,
    max_score DECIMAL(5, 2) NOT NULL
);
CREATE INDEX idx_lab_student ON lab_performance(student_id);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

-- Create industry_roles table
CREATE TABLE IF NOT EXISTS industry_roles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL,
    average_salary VARCHAR(255)
);

-- Create role_skill_mapping table
CREATE TABLE IF NOT EXISTS role_skill_mapping (
    role_id INTEGER REFERENCES industry_roles(id) ON DELETE CASCADE,
    skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, skill_id)
);

-- Create subject_industry_mapping table
CREATE TABLE IF NOT EXISTS subject_industry_mapping (
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES industry_roles(id) ON DELETE CASCADE,
    projects JSONB,
    tools JSONB,
    PRIMARY KEY (subject_id, role_id)
);

-- Create readiness_scores table
CREATE TABLE IF NOT EXISTS readiness_scores (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE UNIQUE,
    score DECIMAL(5, 2) NOT NULL,
    risk_level VARCHAR(50) NOT NULL,
    missing_skills JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create placement_predictions table
CREATE TABLE IF NOT EXISTS placement_predictions (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE UNIQUE,
    probability DECIMAL(5, 2) NOT NULL,
    confidence_score DECIMAL(5, 2) NOT NULL,
    suggestions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
