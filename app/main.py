from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.core.config import settings
from app.routers import auth, students, predictions, collaboration
from app.database import engine, get_db
from app import models

# Avoid creating tables here automatically if making schema files to run via Supabase SQL Editor manually, 
# but models.Base.metadata.create_all(bind=engine) can be used for local SQLite. 
# Step 2 instructions mention we will paste SQL inside Supabase SQL editor.
# models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
)

# Simplified, ultra-permissive CORS for debugging
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(students.router, prefix="/api/v1/students", tags=["students"])
app.include_router(predictions.router, prefix="/api/v1/predictions", tags=["predictions"])
app.include_router(collaboration.router, prefix="/api/v1/collaboration", tags=["collaboration"])

@app.get("/")
def root():
    return {
        "message": "Welcome to StratAcade API",
        "version": "1.0.3",
        "deploy_time": "2026-02-26T00:50:00Z"
    }

@app.get("/api/v1/test-cors")
def test_cors():
    return {"message": "CORS is working!", "time": "2026-02-26T00:50:00Z"}

@app.get("/api/v1/test-db-raw")
def test_db_raw(db: Session = Depends(get_db)):
    from sqlalchemy import text
    try:
        result = db.execute(text("SELECT email FROM students LIMIT 1")).fetchone()
        return {"status": "success", "first_email": result[0] if result else "None"}
    except Exception as e:
        return {"status": "error", "error": str(e), "type": str(type(e))}

@app.get("/api/v1/debug-students")
def debug_students(db: Session = Depends(get_db)):
    from urllib.parse import urlparse
    try:
        # Mask password for safety
        parsed = urlparse(settings.DATABASE_URL)
        masked_url = f"{parsed.scheme}://{parsed.username}:****@{parsed.hostname}:{parsed.port}{parsed.path}"
        
        students = db.query(models.Student).all()
        return {
            "status": "success",
            "masked_url": masked_url,
            "students": [{"id": s.id, "email": s.email, "has_hash": bool(s.hashed_password)} for s in students]
        }
    except Exception as e:
        parsed = urlparse(settings.DATABASE_URL)
        masked_url = f"{parsed.scheme}://{parsed.username}:****@{parsed.hostname}:{parsed.port}{parsed.path}"
        return {
            "status": "error",
            "masked_url": masked_url,
            "error": str(e),
            "type": str(type(e))
        }
