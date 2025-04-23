from fastapi import FastAPI
from app.routers import teams, players, matches  # ✅ must match filenames
from app.routers import player_stats

# Add the workspace root to the Python path
import sys
from pathlib import Path
workspace_root = Path(__file__).resolve().parents[2]
sys.path.append(str(workspace_root))

# Add the backend directory to the Python path
backend_path = workspace_root / 'backend'
sys.path.append(str(backend_path))

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
