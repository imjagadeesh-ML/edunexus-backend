-- Migration to add columns for 4-Year B.Tech Journey
-- Run these in the Supabase SQL Editor

-- 1. Add current_year to students
ALTER TABLE students ADD COLUMN IF NOT EXISTS current_year INTEGER DEFAULT 1;

-- 2. Add academic_year to skills
ALTER TABLE skills ADD COLUMN IF NOT EXISTS academic_year INTEGER DEFAULT 1;

-- 3. Verify
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'students' AND column_name = 'current_year';

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'skills' AND column_name = 'academic_year';

-- 4. Create Shared Materials Table
CREATE TABLE IF NOT EXISTS shared_materials (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    file_path TEXT NOT NULL,
    subject_id INTEGER REFERENCES subjects(id),
    uploader_id INTEGER REFERENCES students(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Campus Notifications Table
CREATE TABLE IF NOT EXISTS campus_notifications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'Normal',
    category VARCHAR(50),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
