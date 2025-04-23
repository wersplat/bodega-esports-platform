from fastapi import FastAPI
from routers import teams, players

app = FastAPI()

app.include_router(teams.router)
app.include_router(players.router)

@app.get("/ping")
def ping():
    return {"message": "pong"}
