-- EduNexus AI: COMPLETE RECOVERY SCRIPT
-- This script ensures the Demo Student exists and has the correct password.
-- Run this in the Supabase SQL Editor.

-- 1. Ensure the student exists with the correct password
INSERT INTO students (name, roll_number, email, hashed_password)
VALUES (
    'John Doe', 
    'ENX2026-001', 
    'student@edunexus.ai', 
    '$pbkdf2-sha256$29000$L6X0npPyPse4V6q1tvbeew$/xVsuYyM/yB2MWhaFLmWF1sMpbmwuILADffGYi5ajSg'
)
ON CONFLICT (email) 
DO UPDATE SET hashed_password = EXCLUDED.hashed_password;

-- 2. Verify everything (This part won't hurt)
SELECT id, name, email FROM students WHERE email = 'student@edunexus.ai';
