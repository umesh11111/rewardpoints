from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.testing.provision import register

from .database import Base,engine
from .routers import (
    auth_router,
    reward_router,
    hr_router,
    idu_router,
    dashboard_router, register_router, emp_router
)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Reward Points Portal")
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://overtimorous-osmious-arnetta.ngrok-free.dev",  # ← add this
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(reward_router.router)
app.include_router(hr_router.router)
app.include_router(idu_router.router)
app.include_router(dashboard_router.router)
app.include_router(register_router.router)
app.include_router(emp_router.router)