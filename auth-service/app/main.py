from fastapi import FastAPI
from app.routes import auth, health

app = FastAPI()

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(health.router, prefix="", tags=["health"])