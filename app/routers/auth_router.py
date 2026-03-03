# # from fastapi import APIRouter, HTTPException, Depends
# # from sqlalchemy.orm import Session
# #
# # from .register_router import verify_password
# # from ..database import get_db
# # from ..models import Employee
# # from ..schemas import LoginRequest
# #
# # router = APIRouter(prefix="/auth", tags=["Auth"])
# #
# # @router.post("/login")
# # def login_user(data: LoginRequest, db: Session = Depends(get_db)):
# #
# #     user = db.query(Employee).filter(
# #         Employee.email == data.email
# #     ).first()
# #
# #     if not user:
# #         raise HTTPException(status_code=404, detail="User not found")
# #
# #     if user.status != "APPROVED":
# #         raise HTTPException(status_code=403, detail="Awaiting HR approval")
# #
# #     if not verify_password(data.password, user.password):
# #         raise HTTPException(status_code=401, detail="Invalid password")
# #
# #     return {
# #         "message": "Login successful",
# #         "employee_name": user.employee_name,
# #         "role": user.role
# #     }
#
# # app/routers/auth.py
#
# # from fastapi import APIRouter, HTTPException
# # from..security import create_access_token
# #
# # router = APIRouter(prefix="/auth", tags=["Auth"])
# #
# #
# # @router.post("/login")
# # def login(employee_id: str, role: str):
# #     token = create_access_token({
# #         "employee_id": employee_id,
# #         "role": role
# #     })
# #
# #     return {
# #         "access_token": token,
# #         "token_type": "bearer"
# #     }
#
# # app/routers/auth.py
#
# from fastapi import APIRouter, HTTPException, Depends
# from sqlalchemy.orm import Session
# from ..database import get_db
# from ..models import Employee
# from ..security import create_access_token
#
# router = APIRouter(prefix="/auth", tags=["Auth"])
#
#
# @router.post("/login")
# def login(employee_id: str, role: str, db: Session = Depends(get_db)):
#     # 🔍 check employee exists
#     user = db.query(Employee).filter(
#         Employee.employee_id == employee_id
#     ).first()
#
#     if not user:
#         raise HTTPException(status_code=404, detail="Employee not found")
#
#     # 🔍 check role matches
#     if user.role != role:
#         raise HTTPException(status_code=403, detail="Invalid role")
#
#     # 🔍 check HR approved
#     if user.status != "APPROVED":
#         raise HTTPException(
#             status_code=403,
#             detail="Waiting for HR approval"
#         )
#
#     # ✅ create token
#     token = create_access_token({
#         "employee_id": user.employee_id,
#         "role": user.role
#     })
#
#     return {
#         "access_token": token,
#         "token_type": "bearer",
#         "employee_name": user.employee_name,
#         "role": user.role
#     }

# app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import constr
from sqlalchemy.orm import Session

from .register_router import verify_password, hash_password
from ..database import get_db
from ..models import Employee
from ..schemas import ResetPasswordRequest
from ..security import create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(),
          db: Session = Depends(get_db)):

    identifier = form_data.username.strip()  # email OR employee_id
    password = form_data.password

    user = db.query(Employee).filter(
        (Employee.email == identifier) |
        (Employee.employee_id == identifier)
    ).first()

    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if user.status != "APPROVED":
        raise HTTPException(status_code=403, detail="Your account is pending for HR approval")

    token_data = {
        "sub": user.email,
        "role": user.role,
        "status": user.status,
        "employee_id": user.employee_id
    }

    token = create_access_token(token_data)
    return {"access_token": token, "token_type": "bearer"}

# -------------------- RESET PASSWORD -------------------- #


@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    # Fetch user by employee_id
    user = db.query(Employee).filter(Employee.employee_id == request.employee_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Employee not found")

    if request.new_password != request.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    # Hash the new password
    hashed_password = hash_password(request.new_password)
    user.password = hashed_password
    db.commit()

    return {"message": "Password reset successfully"}