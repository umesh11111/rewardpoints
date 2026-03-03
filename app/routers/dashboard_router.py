# from fastapi import APIRouter, Depends
# from ..storage import read_json, REWARDS_FILE
# from ..dependencies import get_current_user
# from fastapi.responses import FileResponse
# import pandas as pd
# from datetime import datetime
#
# router = APIRouter(prefix="/dashboard", tags=["Dashboard"])
#
# def get_recent_activity(rewards, limit=5):
#     # Sort rewards by created_at descending
#     recent = sorted(
#         rewards,
#         key=lambda r: r.get("created_at", ""),
#         reverse=True
#     )[:limit]
#
#     formatted_activity = []
#     for r in recent:
#         raw_date = r.get("submission_date") or r.get("created_at") or ""
#         try:
#             # Assuming the date in rewards is ISO format: "YYYY-MM-DD" or "YYYY-MM-DDTHH:MM:SS"
#             dt = datetime.fromisoformat(raw_date)
#             business_date = dt.strftime("%d %b %Y")  # e.g., 25 Feb 2026
#         except Exception:
#             business_date = raw_date  # fallback to raw string if parsing fails
#
#         formatted_activity.append({
#             "employee": r.get("employee_name", "Unknown"),
#             "points": r.get("reward_points", 0),
#             "status": r.get("status"),
#             "date": business_date
#         })
#
#     return formatted_activity
#
# @router.get("/")
# def dashboard(user=Depends(get_current_user)):
#     rewards = read_json(REWARDS_FILE)
#     role = user["role"]
#
#     # Filter rewards based on role
#     if role == "LM":
#         # LM sees only their submitted rewards
#         role_rewards = [r for r in rewards if r.get("created_by") == "LM"]
#
#         total = len(role_rewards)
#         approved = sum(r["status"] == "APPROVED" for r in role_rewards)
#         rejected = sum(r["status"] == "REJECTED" for r in role_rewards)
#         pending = sum(r["status"] == "PENDING" for r in role_rewards)
#
#         return {
#             "totalRewards": total,
#             "approvedAwards": approved,
#             "totalRejected": rejected,
#             "pendingApprovals": pending
#         }
#
#     elif role == "HR":
#         # HR sees all submissions
#         role_rewards = rewards
#
#         total = len(role_rewards)
#         approved = sum(r["status"] == "HR_APPROVED" for r in role_rewards)
#         pending = sum(r["status"] == "PENDING" for r in role_rewards)
#
#         return {
#             "totalSubmissions": total,
#             "totalApproved": approved,
#             "totalPending": pending,
#             "recentActivity": get_recent_activity(role_rewards)
#         }
#
#     elif role == "IDU":
#         # IDU sees all rewards approved by HR
#         role_rewards = rewards
#
#         approved = sum(r["status"] == "APPROVED" for r in role_rewards)
#         rejected = sum(r["status"] == "REJECTED" for r in role_rewards)
#         pending = sum(r["status"] == "HR_APPROVED" for r in role_rewards)
#
#         return {
#             "totalApproved": approved,
#             "totalRejected": rejected,
#             "totalPending": pending,
#             "recentActivity": get_recent_activity(role_rewards)
#         }
#
#     else:
#         # Default: return all data for unknown roles
#         total = len(rewards)
#         approved = sum(r["status"] == "APPROVED" for r in rewards)
#         rejected = sum(r["status"] == "REJECTED" for r in rewards)
#         pending = sum(r["status"] in ["PENDING", "HR_APPROVED"] for r in rewards)
#         approval_rate = round((approved / total) * 100, 2) if total else 0
#
#         return {
#             "totalRewards": total,
#             "approvedAwards": approved,
#             "pendingApprovals": pending,
#             "totalRejected": rejected,
#             "totalEmployees": len({r.get("employee_name") for r in rewards}),
#             "approvalRate": approval_rate,
#             "recentActivity": get_recent_activity(rewards)
#         }
# @router.get("/trend/monthly")
# def monthly_trend(user=Depends(get_current_user)):
#     rewards = read_json(REWARDS_FILE)
#
#     trend = {}
#     for r in rewards:
#         month = r.get("created_at", "")[:7]  # YYYY-MM
#         trend[month] = trend.get(month, 0) + r.get("points", 0)
#
#     return [{"month": k, "points": v} for k, v in sorted(trend.items())]
#
#
# @router.get("/report/export")
# def export_rewards(user=Depends(get_current_user)):
#     rewards = read_json(REWARDS_FILE)
#
#     df = pd.DataFrame(rewards)
#     path = "rewards_report.xlsx"
#     df.to_excel(path, index=False)
#
#     return FileResponse(path, filename="rewards_report.xlsx")
#
# @router.get("/report")
# def filtered_report(status: str | None = None):
#     rewards = read_json(REWARDS_FILE)
#
#     if status:
#         rewards = [r for r in rewards if r["status"] == status]
#
#     return rewards
# @router.get("/analytics/status")
# def status_distribution(user=Depends(get_current_user)):
#     rewards = read_json(REWARDS_FILE)
#
#     status_counts = {}
#     for r in rewards:
#         status = r.get("status", "UNKNOWN")
#         status_counts[status] = status_counts.get(status, 0) + 1
#
#     return status_counts

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi.responses import FileResponse
from datetime import datetime
import pandas as pd

from ..database import get_db
from ..dependencies import get_current_user
from ..models import Reward

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


# =========================
# Helper: Recent Activity
# =========================

def get_recent_activity_db(db: Session, limit=5):
    rewards = (
        db.query(Reward)
        .order_by(Reward.submission_date.desc())
        .limit(limit)
        .all()
    )

    formatted = []
    for r in rewards:
        business_date = r.submission_date.strftime("%d %b %Y %I:%M:%S %p") if r.submission_date else ""

        formatted.append({
            "employee": r.employee_name,
            "points": r.reward_points,
            "status": r.status,
            "date": business_date
        })

    return formatted


# =========================
# DASHBOARD STATS
# =========================

@router.get("/")
def dashboard(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    role = user["role"]

    if role == "LM":
        # query = db.query(Reward).filter(Reward.created_by == "LM")

        # total = query.count()
        total = db.query(Reward).count()
        approved = db.query(Reward).filter(Reward.status == "APPROVED").count()
        rejected = db.query(Reward).filter(Reward.status == "REJECTED").count()
        pending = db.query(Reward).filter(Reward.status == "PENDING").count()

        return {
            "totalRewards": total,
            "approvedAwards": approved,
            "totalRejected": rejected,
            "pendingApprovals": pending
        }
    elif role == "TM":
        query = db.query(Reward).filter(Reward.employee_id == user['employee_id'])
        total = query.filter(Reward.status=="APPROVED").count()

        return {
            "totalRewards": total

        }

    elif role == "HR":
        total = db.query(Reward).count()
        approved = db.query(Reward).filter(Reward.status == "HR_APPROVED").count()
        pending = db.query(Reward).filter(Reward.status == "PENDING").count()

        return {
            "totalSubmissions": total,
            "totalApproved": approved,
            "totalPending": pending,
            "recentActivity": get_recent_activity_db(db)
        }

    elif role == "IDU":
        approved = db.query(Reward).filter(Reward.status == "APPROVED").count()
        rejected = db.query(Reward).filter(Reward.status == "REJECTED").count()
        pending = db.query(Reward).filter(Reward.status == "PENDING").count()

        return {
            "totalApproved": approved,
            "totalRejected": rejected,
            "totalPending": pending,
            "recentActivity": get_recent_activity_db(db)
        }

    else:
        total = db.query(Reward).count()
        approved = db.query(Reward).filter(Reward.status == "APPROVED").count()
        rejected = db.query(Reward).filter(Reward.status == "REJECTED").count()
        pending = db.query(Reward).filter(
            Reward.status.in_(["PENDING", "HR_APPROVED"])
        ).count()

        total_employees = db.query(
            func.count(func.distinct(Reward.employee_name))
        ).scalar()

        approval_rate = round((approved / total) * 100, 2) if total else 0

        return {
            "totalRewards": total,
            "approvedAwards": approved,
            "pendingApprovals": pending,
            "totalRejected": rejected,
            "totalEmployees": total_employees,
            "approvalRate": approval_rate,
            "recentActivity": get_recent_activity_db(db)
        }


# =========================
# MONTHLY TREND
# =========================

@router.get("/trend/monthly")
def monthly_trend(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    results = (
        db.query(
            func.date_trunc("month", Reward.submission_date).label("month"),
            func.sum(Reward.reward_points)
        )
        .group_by("month")
        .order_by("month")
        .all()
    )

    return [
        {"month": r.month.strftime("%Y-%m"), "points": r[1] or 0}
        for r in results
    ]


# =========================
# EXPORT EXCEL REPORT
# =========================

@router.get("/report/export")
def export_rewards(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    rewards = db.query(Reward).all()

    data = [
        {
            "Employee": r.employee_name,
            "Points": r.reward_points,
            "Status": r.status,
            "Date": r.created_at
        }
        for r in rewards
    ]

    df = pd.DataFrame(data)
    path = "rewards_report.xlsx"
    df.to_excel(path, index=False)

    return FileResponse(path, filename="rewards_report.xlsx")


# =========================
# FILTERED REPORT
# =========================

@router.get("/report")
def filtered_report(
    status: str | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(Reward)

    if status:
        query = query.filter(Reward.status == status)

    rewards = query.all()

    return [
        {
            "employee": r.employee_name,
            "points": r.reward_points,
            "status": r.status,
            "date": r.created_at
        }
        for r in rewards
    ]


# =========================
# STATUS ANALYTICS
# =========================

@router.get("/analytics/status")
def status_distribution(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    results = (
        db.query(Reward.status, func.count(Reward.id))
        .group_by(Reward.status)
        .all()
    )

    return {status: count for status, count in results}