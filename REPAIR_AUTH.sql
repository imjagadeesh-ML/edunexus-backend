-- StratAcade: Password Repair Script
-- Use this to fix the "Invalid Credentials" error for the demo account.

UPDATE students 
SET hashed_password = '$pbkdf2-sha256$29000$L6X0npPyPse4V6q1tvbeew$/xVsuYyM/yB2MWhaFLmWF1sMpbmwuILADffGYi5ajSg' 
WHERE email = 'student@edunexus.ai';
