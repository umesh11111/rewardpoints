from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime

from ..database import get_db
from ..models import Employee
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from passlib.context import CryptContext

from ..schemas import RegisterRequest

pwd_context = CryptContext(
    schemes=["bcrypt_sha256"],
    deprecated="auto"
)
router = APIRouter(prefix="/register", tags=["Register"])


def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    if hashed.startswith("$2"):   # bcrypt hashes start like this
        raise HTTPException(
            status_code=500,
            detail="Legacy bcrypt hash detected. Delete employee.json and re-register users."
        )
    return pwd_context.verify(password, hashed)

@router.post("/")
def register_user(data: RegisterRequest, db: Session = Depends(get_db)):

    existing = db.query(Employee).filter(
        Employee.employee_id == data.employee_id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Employee already exists")

    # ⭐ auto-approve HR users
    status_value = "APPROVED" if data.role.upper() == "HR" else "PENDING_HR_APPROVAL"

    user = Employee(
        employee_name=data.employee_name,
        employee_id=data.employee_id,
        email=data.email,
        password=hash_password(data.password),
        role=data.role.upper(),
        country=data.country,
        state =data.state,
        status=status_value,
        created_at=datetime.now()
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": (
            "HR registered successfully"
            if status_value == "APPROVED"
            else "Registration submitted for HR approval"
        ),
        "status": status_value
    }
@router.get("/lm-list")
def get_lm_list(db: Session = Depends(get_db)):
    lms = db.query(Employee).filter(
        Employee.role.in_(["LM", "HR"])  # adjust if needed
    ).all()

    return [
        {
            "employee_id": emp.employee_id,
            "employee_name": emp.employee_name
        }
        for emp in lms
    ]