from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse
import os,shutil
from ..database import get_db
from ..models import Employee, Reward
from ..dependencies import require_role, get_current_user
from ..schemas import EmployeeResponse

router = APIRouter(prefix="/hr", tags=["HR"])
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
# 🔹 Pending rewards
@router.post("/rewards/upload/{reward_id}")
def upload_attachment(
    reward_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    reward = db.query(Reward).filter(Reward.id == reward_id).first()

    if not reward:
        raise HTTPException(status_code=404, detail="Reward not found")

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    reward.attachment_path = file_path
    reward.attachment= file.filename
    db.commit()

    return {"message": "File uploaded successfully"}
@router.get("/pending")
def pending_rewards(
    user=Depends(require_role("HR")),
    db: Session = Depends(get_db)
):
    return db.query(Reward).filter(
        Reward.status == "PENDING"
    ).all()


# 🔹 Approve reward
@router.post("/approve/{reward_id}")
def approve_reward(
    reward_id: int,
    user=Depends(require_role("HR")),
    db: Session = Depends(get_db)
):
    reward = db.query(Reward).filter(
        Reward.id == reward_id
    ).first()

    if not reward:
        raise HTTPException(status_code=404, detail="Reward not found")

    reward.status = "HR_APPROVED"
    reward.approved_by = user["employee_id"]
    reward.approved_date = datetime.utcnow()

    db.commit()
    db.refresh(reward)

    return {"message": "Approved by HR"}


# 🔹 Reject reward
@router.post("/reject/{reward_id}")
def reject_reward(
    reward_id: int,
    user=Depends(require_role("HR")),
    db: Session = Depends(get_db)
):
    reward = db.query(Reward).filter(
        Reward.id == reward_id
    ).first()

    if not reward:
        raise HTTPException(status_code=404, detail="Reward not found")

    reward.status = "REJECTED"
    reward.rejected_by = user["employee_id"]
    reward.rejected_date = datetime.utcnow()

    db.commit()
    db.refresh(reward)

    return {"message": "Rejected by HR"}

@router.get("/pending-users", response_model=list[EmployeeResponse])
def pending_users(
    user=Depends(require_role("HR")),
    db: Session = Depends(get_db)
):
    return db.query(Employee).filter(
        Employee.status == "PENDING_HR_APPROVAL"
    ).all()
@router.post("/approve-user/{employee_id}")
def approve_user(employee_id: str, db: Session = Depends(get_db)):
    user = db.query(Employee).filter(Employee.employee_id == employee_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.status = "APPROVED"
    user.hr_action_at = datetime.now()  # ✅ date saved
    db.commit()
    db.refresh(user)

    return {"message": "User approved"}


@router.post("/reject-user/{employee_id}")
def reject_user(employee_id: str, db: Session = Depends(get_db)):
    user = db.query(Employee).filter(Employee.employee_id == employee_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.status = "REJECTED"
    user.hr_action_at = datetime.now()  # ✅ date saved
    db.commit()
    db.refresh(user)

    return {"message": "User rejected"}

@router.get("/download/{reward_id}")
def download_attachment(
    reward_id: int,
    db: Session = Depends(get_db),  current_user = Depends(get_current_user)
):
    # ✅ Allow only HR (and optionally LM)
    if current_user['role']!= "HR":
        raise HTTPException(status_code=403, detail="You are not authorized to download this file")

    reward = db.query(Reward).filter(Reward.id == reward_id).first()

    if not reward or not reward.attachment:
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(
        reward.attachment,
        media_type="application/octet-stream",
        filename=os.path.basename(reward.attachment)
    )


# @router.get("/download/{reward_id}")
# def download_attachment(
#     reward_id: int,
#     db: Session = Depends(get_db)
# ):
#     reward = db.query(Reward).filter(Reward.id == reward_id).first()
#
#     if not reward:
#         raise HTTPException(status_code=404, detail="Reward not found")
#
#     # if not reward.attachment_path:
#     #     raise HTTPException(status_code=404, detail="Attachment missing")
#
#     # if not os.path.exists(reward.attachment_path):
#     #     raise HTTPException(status_code=404, detail="File not found on server")
#
#     return FileResponse(
#         path=reward.attachment_path,
#         filename=reward.attachment,
#         media_type="application/octet-stream"
#     )