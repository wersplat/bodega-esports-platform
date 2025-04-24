from fastapi import FastAPI
from app.routers import players, matches  #  must match filenames
from app.routers import player_stats
from app.routers import match_submissions
from app.utils import auth  # Updated to match the correct location of auth.py
from app.routers import standings
from app.api import (
    leaderboard,
    seasons,
    teams,
    divisions,  # Updated to use the new API structure
)
from app.routers import stats  # Importing stats router
from app.routers import stats_charts  # Importing stats_charts router

# Add the workspace root to the Python path
import sys
from pathlib import Path
workspace_root = Path(__file__).resolve().parents[2]
sys.path.append(str(workspace_root))

# Add the backend directory to the Python path
backend_path = workspace_root / 'backend'
sys.path.append(str(backend_path))

app = FastAPI()

app.include_router(seasons.router)  # Include seasons router
app.include_router(teams.router)  # Include teams router
app.include_router(divisions.router)  # Include divisions router
app.include_router(players.router)
app.include_router(matches.router)
app.include_router(player_stats.router)
app.include_router(match_submissions.router)
app.include_router(auth.router)
app.include_router(standings.router)
app.include_router(leaderboard.router)  # Updated to use the new API router
app.include_router(stats.router)
app.include_router(stats_charts.router)

@app.get("/")
def root():
    return {"message": "Backend is live"}


@app.get("/ping")
def ping():
    return {"message": "pong"}
