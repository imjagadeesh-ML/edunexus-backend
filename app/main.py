from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import auth, students, predictions
from app.database import engine
from app import models

# Avoid creating tables here automatically if making schema files to run via Supabase SQL Editor manually, 
# but models.Base.metadata.create_all(bind=engine) can be used for local SQLite. 
# Step 2 instructions mention we will paste SQL inside Supabase SQL editor.
# models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(students.router, prefix="/api/v1/students", tags=["students"])
app.include_router(predictions.router, prefix="/api/v1/predictions", tags=["predictions"])

@app.get("/")
def root():
    return {"message": "Welcome to EduNexus AI API"}
