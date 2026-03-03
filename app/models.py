from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime
from .database import Base


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    employee_name = Column(String, nullable=False)
    employee_id = Column(String, unique=True, index=True)
    email = Column(String, unique=True)
    password = Column(String)
    role = Column(String)
    country = Column(String)
    state = Column(String)
    status = Column(String)
    created_at = Column(String)
    lm_name = Column(String, nullable=True)
    hr_action_at = Column(DateTime, nullable=True)


class Reward(Base):
    __tablename__ = "rewards"

    id = Column(Integer, primary_key=True, index=True)
    employee_name = Column(String)
    employee_id = Column(String)
    reward_type = Column(String)
    reward_points = Column(Integer)
    description = Column(String)
    attachment = Column(String, nullable=True)
    attachment_path = Column(String, nullable=True)
    status = Column(String, default="PENDING")
    created_by = Column(String)   # LM id
    submission_date = Column(DateTime, default=datetime.now())
    approved_by = Column(String, nullable=True)
    approved_date = Column(DateTime, nullable=True)
    rejected_by = Column(String, nullable=True)
    rejected_date = Column(DateTime, nullable=True)