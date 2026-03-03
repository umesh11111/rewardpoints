from urllib.parse import quote

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import os
import mimetypes
from fastapi.responses import FileResponse

from ..database import get_db
from ..dependencies import require_role, get_current_user
from ..models import Reward

router = APIRouter(prefix="/rewards", tags=["LM"])
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/submit")
def submit_reward(
    employee_name: str = Form(...),
    employee_id: str = Form(...),
    reward_type: str = Form(...),
    reward_points: int = Form(...),
    description: str = Form(...),
    file: UploadFile = File(None),
    user=Depends(require_role("LM")),
    db: Session = Depends(get_db)
):
    file_path = None

    if file:
        file_path = f"{UPLOAD_DIR}/{file.filename}"
        with open(file_path, "wb") as buffer:
            buffer.write(file.file.read())
    reward = Reward(
        employee_name=employee_name,
        employee_id=employee_id,
        reward_type=reward_type,
        reward_points=reward_points,
        description=description,
        attachment=file_path,
        status="PENDING",
        created_by=user["employee_id"],  # ← important fix
        submission_date=datetime.now()
    )

    db.add(reward)
    db.commit()
    db.refresh(reward)

    return {"message": "Reward submitted"}

@router.get("/my")
def get_my_rewards(
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user["role"] == "LM":
        return db.query(Reward).filter(
            Reward.created_by == user["employee_id"]
        ).all()

    return db.query(Reward).all()


# @router.get("/download/{reward_id}")
# def download_attachment(
#     reward_id: int,
#     db: Session = Depends(get_db)
# ):
#     reward = db.query(Reward).filter(Reward.id == reward_id).first()
#     # file_path = reward.attachment_path
#
#     if not reward or not reward.attachment:
#         raise HTTPException(status_code=404, detail="File not found")
#     return FileResponse(
#         reward.attachment,
#         media_type="application/octet-stream",
#         filename=os.path.basename(reward.attachment)
#     )


# @router.post("/upload/{reward_id}")
# async def upload_attachment(
#     reward_id: int,
#     file: UploadFile = File(...),
#     db: Session = Depends(get_db)
# ):
#     reward = db.query(Reward).filter(Reward.id == reward_id).first()
#
#     if not reward:
#         raise HTTPException(status_code=404, detail="Reward not found")
#
#     # preserve extension
#     ext = os.path.splitext(file.filename)[1]
#     stored_name = f"{uuid4()}{ext}"
#     file_path = os.path.join(UPLOAD_DIR, stored_name)
#
#     with open(file_path, "wb") as f:
#         f.write(await file.read())
#
#     reward.attachment = file_path
#     reward.original_filename = file.filename
#
#     db.commit()
#
#     return {"message": "File uploaded successfully"}
#
#
# # =========================
# # DOWNLOAD ATTACHMENT
# # =========================
#
# @router.get("/download/{reward_id}")
# def download_attachment(
#     reward_id: int,
#     db: Session = Depends(get_db)
# ):
#     reward = db.query(Reward).filter(Reward.id == reward_id).first()
#
#     if not reward or not reward.attachment:
#         raise HTTPException(status_code=404, detail="File not found")
#
#     file_path = reward.attachment
#
#     if not os.path.exists(file_path):
#         raise HTTPException(status_code=404, detail="Attachment missing")
#
#     # use original uploaded filename
#     download_name = reward.attachment or os.path.basename(file_path)
#
#     media_type, _ = mimetypes.guess_type(download_name)
#     if not media_type:
#         media_type = "application/octet-stream"
#
#     # ⭐ send both filename and filename* for browser compatibility
#     headers = {
#         "Content-Disposition":
#         f"attachment; filename=\"{download_name}\"; filename*=utf-8''{quote(download_name)}"
#     }
#
#     return FileResponse(
#         path=file_path,
#         media_type=media_type,
#         headers=headers
#     )