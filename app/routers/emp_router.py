from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from ..database import get_db
from ..models import Reward
from ..dependencies import require_role

router = APIRouter(prefix="/emp", tags=["EMP"])


@router.get("/summary")
def emp_summary(
    user=Depends(require_role("TM")),
    db: Session = Depends(get_db)
):
    rewards = db.query(Reward).filter(Reward.employee_id == user['employee_id']).all()

    # convert to list of dicts
    result = [
        {
            "id": r.id,
            "reward_type": r.reward_type,
            "reward_points": r.reward_points,
            "status": r.status,
            "submission_date": r.submission_date.strftime("%d %b %Y %I:%M:%S %p")
        } for r in rewards
    ]

    return result