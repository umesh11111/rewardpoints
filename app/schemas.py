from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, constr


class LoginRequest(BaseModel):
    email: Optional[EmailStr] = None
    password: str

class RewardCreate(BaseModel):
    employee_name: str
    employee_id: str
    reward_type: str
    reward_points: int
    description: str

class EmployeeResponse(BaseModel):
    employee_name: str
    employee_id: str
    email: str
    role: str
    country: str
    state: str
    status: str
    created_at: datetime

    class Config:
        orm_mode = True

class RegisterRequest(BaseModel):
    employee_name: str
    employee_id: str
    email: str
    password: str
    role: str
    country: str
    state:str
class ResetPasswordRequest(BaseModel):
    employee_id: str
    new_password: constr(min_length=12)
    confirm_password: constr(min_length=12)