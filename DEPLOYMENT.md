# EduNexus AI - Backend Deployment Guide

This guide covers deploying the FastAPI backend for EduNexus AI onto **Render** using a **Supabase PostgreSQL** database.

## 1. Supabase PostgreSQL Setup
1. Log in to [Supabase](https://supabase.com/).
2. Create a new Organization and Project (e.g., `EduNexus AI`).
3. Save your Database Password securely.
4. Go to **Project Settings -> Database**.
5. Find your **Connection String (URI)**. 
   - Ensure the connection pooler is active (Port `6543`, usually starts with `postgresql://postgres.[project_ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`).
6. Go to the **SQL Editor** in Supabase.
7. Paste the contents of `schema.sql` (found in the root of this project) and click **Run** to create all tables.

## 2. GitHub Setup
1. Create a clear `.gitignore` file (e.g. ignoring `__pycache__`, `venv`, `.env`).
2. Push your EduNexus AI backend code to a GitHub repository.

## 3. Render Deployment
1. Log in to [Render](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub account and select your backend repository.
4. Configure the Web Service:
   - **Name:** `edunexus-backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

## 4. Environment Variables on Render
Scroll down to the **Environment Variables** section on Render and add the following:

- `ENVIRONMENT` = `production`
- `SECRET_KEY` = *(Generate a secure key using `openssl rand -hex 32` locally and paste it here)*
- `DATABASE_URL` = *(Your Supabase connection string securely replacing `[YOUR-PASSWORD]`)*
- `BACKEND_CORS_ORIGINS` = `["https://your-frontend-domain.vercel.app", "http://localhost:3000"]`

## 5. Deployment and Verification
1. Click **Create Web Service**.
2. Wait for Render to build and deploy. You can monitor the progress in the logs.
3. Once deployed, open the Render URL appended with `/docs` (e.g., `https://edunexus-backend.onrender.com/docs`).
4. You should see the Swagger UI. Try sending a request to the default root `/` or any `/api/v1/predictions` endpoints to test the connection.

## Troubleshooting Tips
- **Timeout Errors / Connection Refused:** Ensure your `DATABASE_URL` is using port `6543` (Supabase connection pooler) instead of `5432`. Render's ephemeral IP ranges require connection poolers for stable DB access to Supabase.
- **ModuleNotFoundError:** Verify all dependencies are listed strictly in `requirements.txt`.
- **CORS Errors on Frontend:** Ensure `BACKEND_CORS_ORIGINS` has exactly the allowed list format (a valid JSON list of strings, e.g., `["*"]` for temp debugging) matching your frontend's deployment URL.
