from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from ..database import get_db
from ..models import Reward
from ..dependencies import require_role

router = APIRouter(prefix="/idu", tags=["IDU"])


# 🔹 IDU sees rewards already processed by HR
@router.get("/approved-by-hr")
def approved_by_hr(
    user=Depends(require_role("IDU")),
    db: Session = Depends(get_db)
):
    return db.query(Reward).filter(
        Reward.status.in_(["HR_APPROVED", "REJECTED"])
    ).all()


# 🔹 IDU final approval
@router.post("/approve/{reward_id}")
def idu_approve(
    reward_id: int,
    user=Depends(require_role("IDU")),
    db: Session = Depends(get_db)
):
    reward = db.query(Reward).filter(
        Reward.id == reward_id
    ).first()

    if not reward:
        raise HTTPException(status_code=404, detail="Reward not found")

    if reward.status != "HR_APPROVED":
        raise HTTPException(
            status_code=400,
            detail="Only HR approved rewards can be finalized"
        )

    reward.status = "APPROVED"
    reward.idu_action_by = user["employee_id"]
    reward.idu_action_date = datetime.utcnow()

    db.commit()
    db.refresh(reward)

    return {"message": "Approved by IDU manager"}


# 🔹 IDU reject after HR approval
@router.post("/reject/{reward_id}")
def idu_reject(
    reward_id: int,
    user=Depends(require_role("IDU")),
    db: Session = Depends(get_db)
):
    reward = db.query(Reward).filter(
        Reward.id == reward_id
    ).first()

    if not reward:
        raise HTTPException(status_code=404, detail="Reward not found")

    reward.status = "REJECTED"
    reward.idu_action_by = user["employee_id"]
    reward.idu_action_date = datetime.utcnow()

    db.commit()
    db.refresh(reward)

    return {"message": "Rejected by IDU manager"}

@router.get("/summary")
def idu_summary(
    user=Depends(require_role("IDU")),
    db: Session = Depends(get_db)
):
    total = db.query(Reward).count()
    approved = db.query(Reward).filter(Reward.status == "APPROVED").count()
    rejected = db.query(Reward).filter(Reward.status == "REJECTED").count()
    hr_pending = db.query(Reward).filter(Reward.status == "HR_APPROVED").count()

    return {
        "total_submitted": total,
        "final_approved": approved,
        "rejected": rejected,
        "waiting_for_idu": hr_pending
    }