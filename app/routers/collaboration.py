from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import shutil
from datetime import datetime

from app import models, schemas
from app.database import get_db
from app.routers.auth import get_current_user

router = APIRouter()

UPLOAD_DIR = "uploads/materials"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/materials", response_model=schemas.SharedMaterialOut)
async def upload_material(
    title: str = Form(...),
    category: str = Form(...),
    subject_id: int = Form(...),
    description: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.Student = Depends(get_current_user)
):
    # Save file to local storage
    file_path = os.path.join(UPLOAD_DIR, f"{datetime.utcnow().timestamp()}_{file.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    db_material = models.SharedMaterial(
        title=title,
        description=description,
        category=category,
        file_path=file_path,
        subject_id=subject_id,
        uploader_id=current_user.id
    )
    db.add(db_material)
    db.commit()
    db.refresh(db_material)
    return db_material

@router.get("/materials", response_model=List[schemas.SharedMaterialOut])
def get_materials(
    category: Optional[str] = None,
    subject_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.SharedMaterial)
    if category:
        query = query.filter(models.SharedMaterial.category == category)
    if subject_id:
        query = query.filter(models.SharedMaterial.subject_id == subject_id)
    return query.order_by(models.SharedMaterial.created_at.desc()).all()

@router.get("/materials/{material_id}/download")
def download_material(material_id: int, db: Session = Depends(get_db)):
    material = db.query(models.SharedMaterial).filter(models.SharedMaterial.id == material_id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    
    if not os.path.exists(material.file_path):
        raise HTTPException(status_code=404, detail="File not found on server")
        
    return FileResponse(
        path=material.file_path,
        filename=os.path.basename(material.file_path).split('_', 1)[-1],
        media_type='application/octet-stream'
    )

@router.get("/notifications", response_model=List[schemas.CampusNotificationOut])
def get_notifications(db: Session = Depends(get_db)):
    return db.query(models.CampusNotification).order_by(models.CampusNotification.created_at.desc()).all()

@router.post("/notifications", response_model=schemas.CampusNotificationOut)
def create_notification(
    notification: schemas.CampusNotificationBase,
    db: Session = Depends(get_db)
):
    db_notification = models.CampusNotification(**notification.model_dump())
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification
