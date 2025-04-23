from fastapi import FastAPI
from routers import teams

app = FastAPI()

app.include_router(teams.router)

@app.get("/ping")
def ping():
    return {"message": "pong"}
