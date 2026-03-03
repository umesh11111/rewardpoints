from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = "secret"
ALGORITHM = "HS256"

def create_token(user):
    payload = {
        "user_id": user["id"],
        "role": user["role"],
        "exp": datetime.utcnow() + timedelta(hours=10)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)