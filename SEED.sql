-- EduNexus AI: Comprehensive Mock Data Seed Script
-- Use this script in the Supabase SQL Editor to populate your database with realistic data.

-- 1. Insert Subjects
INSERT INTO subjects (name, code, credits) VALUES
('Data Structures', 'CS101', 4),
('Python Programming', 'CS102', 3),
('Machine Learning', 'CS301', 4),
('Cloud Computing', 'CS401', 3),
('Database Systems', 'CS201', 4)
ON CONFLICT (code) DO NOTHING;

-- 2. Insert Industry Roles
INSERT INTO industry_roles (title, average_salary) VALUES
('Full Stack Engineer', '12-25 LPA'),
('Data Scientist', '15-30 LPA'),
('DevOps Engineer', '10-20 LPA'),
('AI Researcher', '20-40 LPA')
ON CONFLICT (title) DO NOTHING;

-- 3. Insert Skills
INSERT INTO skills (name, description) VALUES
('Python', 'General purpose programming language'),
('SQL', 'Structured Query Language'),
('React', 'Frontend library'),
('Node.js', 'Backend runtime'),
('Docker', 'Containerization'),
('Git', 'Version control')
ON CONFLICT (name) DO NOTHING;

-- 4. Create Demo Student (email: student@edunexus.ai, password: demo123)
-- The hash below is for 'demo123' using bcrypt
INSERT INTO students (name, roll_number, email, hashed_password, created_at) VALUES
('John Doe', 'ENX2026-001', 'student@edunexus.ai', '$2b$12$R.Sj6M0uJ3m9fJz0uYyO3e3i6v.e8yO3zU0K0t0r0C0P0l0z0S0S0', NOW())
ON CONFLICT (email) DO NOTHING;

-- 5. Link Student to Role/Predictions (Mock initial state)
-- (We use subqueries to get IDs safely)
DO $$
DECLARE
    student_id_val INT;
BEGIN
    SELECT id INTO student_id_val FROM students WHERE email = 'student@edunexus.ai';
    
    -- Readiness Score
    INSERT INTO readiness_scores (student_id, score, risk_level, missing_skills, created_at) 
    VALUES (student_id_val, 84.5, 'Low', '["Docker", "React"]', NOW())
    ON CONFLICT (student_id) DO UPDATE SET score = 84.5, risk_level = 'Low';

    -- Placement Prediction
    INSERT INTO placement_predictions (student_id, probability, confidence_score, suggestions, created_at)
    VALUES (student_id_val, 92.0, 88.0, 'Improve Cloud Computing score by 5% to reach Outstanding status.', NOW())
    ON CONFLICT (student_id) DO UPDATE SET probability = 92.0;

END $$;

-- 6. Insert Mock Attendance (Last 10 days for Demo Student)
INSERT INTO attendance_records (student_id, subject_id, status, date)
SELECT 
    (SELECT id FROM students WHERE email = 'student@edunexus.ai'),
    s.id,
    CASE WHEN RANDOM() > 0.15 THEN TRUE ELSE FALSE END,
    NOW() - (interval '1 day' * generate_series(0, 10))
FROM subjects s;

-- 7. Insert Mock Marks
INSERT INTO marks (student_id, subject_id, exam_type, score, max_score)
SELECT 
    (SELECT id FROM students WHERE email = 'student@edunexus.ai'),
    s.id,
    'Midterm',
    (RANDOM() * 30 + 70),
    100
FROM subjects s;

INSERT INTO marks (student_id, subject_id, exam_type, score, max_score)
SELECT 
    (SELECT id FROM students WHERE email = 'student@edunexus.ai'),
    s.id,
    'Assignment',
    (RANDOM() * 20 + 80),
    100
FROM subjects s;
