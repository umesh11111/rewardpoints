# from fastapi import Depends, HTTPException
# from jose import jwt
# from fastapi.security import OAuth2PasswordBearer
#
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
#
# SECRET_KEY = "secret"
# ALGORITHM = "HS256"
#
# def get_current_user(token: str = Depends(oauth2_scheme)):
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         return payload
#     except:
#         raise HTTPException(401, "Invalid token")
#
# # def require_role(role: str):
# #     def checker(user=Depends(get_current_user)):
# #         if user["role"] != role:
# #             raise HTTPException(403, "Not authorized")
# #         return user
# #     return checker
#
# def require_role(required_role: str):
#     def role_checker(user=Depends(get_current_user)):
#         if not user:
#             raise HTTPException(status_code=401, detail="Not authenticated")
#
#         if user["role"] != required_role:
#             raise HTTPException(status_code=403, detail="Access denied")
#
#         return user
#     return role_checker

# app/dependencies.py

# from fastapi import Depends, HTTPException, status
# from fastapi.security import OAuth2PasswordBearer
# from .security import decode_token
#
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
#
#
# def get_current_user(token: str = Depends(oauth2_scheme)):
#     payload = decode_token(token)
#
#     if payload is None:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Not authenticated"
#         )
#
#     return payload
#
#
# def require_role(required_role: str):
#     def checker(user=Depends(get_current_user)):
#         if user.get("role") != required_role:
#             raise HTTPException(status_code=403, detail="Access denied")
#         return user
#     return checker

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .security import decode_token

# This reads: Authorization: Bearer <token>
security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    payload = decode_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    return payload


def require_role(required_role: str):
    def role_checker(user=Depends(get_current_user)):
        if user.get("role") != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        return user
    return role_checker