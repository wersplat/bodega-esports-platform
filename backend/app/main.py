from fastapi import FastAPI
from app.routers import teams, players, matches  # ✅ must match filenames
from app.routers import player_stats

app = FastAPI()

app.include_router(teams.router)
app.include_router(players.router)
app.include_router(matches.router)
app.include_router(player_stats.router)

@app.get("/")
def root():
    return {"message": "Backend is live"}

@app.get("/ping")
def ping():
    return {"message": "pong"}
