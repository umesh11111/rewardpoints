from rewardpoints.app.database import SessionLocal
from rewardpoints.app.models import Employee

db = SessionLocal()

users = db.query(Employee).all()

for u in users:
    print(u.employee_id, u.employee_name, u.status)

db.close()