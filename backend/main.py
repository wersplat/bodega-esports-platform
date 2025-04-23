# backend/main.py

from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Backend is live"}

@app.get("/ping")
def ping():
    return {"message": "pong"}
