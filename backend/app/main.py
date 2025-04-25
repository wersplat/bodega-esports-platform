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
    webhooks,  # Import the new webhooks API
)
from app.routers import stats  # Importing stats router
from app.routers import stats_charts  # Importing stats_charts router
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from app.routers.exports import export_all_to_sheets

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
app.include_router(webhooks.router)  # Include the webhooks router
# Include the exports router for Discord announcements
app.include_router(
    exports.router
)

# Include the meta router for additional endpoints
app.include_router(
    meta.router
)


def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(
        func=lambda: export_all_to_sheets(
            season_id=1, min_games=5, db=None
        ),
        trigger=CronTrigger(day_of_week="sun", hour=0, minute=0),
        id="weekly_export",
        replace_existing=True
    )
    scheduler.start()


# Call the scheduler when the app starts
start_scheduler()


@app.get("/")
def root():
    return {"message": "Backend is live"}


@app.get("/ping")
def ping():
    return {"message": "pong"}
