# Standard library imports
import sys
from pathlib import Path

# Third-party imports
from fastapi import FastAPI
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

# Local application imports
from app.routers import (
    players,
    matches,
    player_stats,
    match_submissions,
    standings,
    stats,
    stats_charts,
    exports,
    meta,
    discord,
)
from app.api import leaderboard, seasons, teams, divisions, webhooks
from app.utils import auth

# Add the backend directory to the Python path
backend_path = Path(__file__).resolve().parents[1]
sys.path.append(str(backend_path))

app = FastAPI()

# Include routers
app.include_router(seasons.router)
app.include_router(teams.router)
app.include_router(divisions.router)
app.include_router(players.router)
app.include_router(matches.router)
app.include_router(player_stats.router)
app.include_router(match_submissions.router)
app.include_router(auth.router)
app.include_router(standings.router)
app.include_router(leaderboard.router)
app.include_router(stats.router)
app.include_router(stats_charts.router)
app.include_router(webhooks.router)
app.include_router(exports.router)
app.include_router(meta.router)
app.include_router(discord.router)


# Scheduler setup

def some_task():
    print("Scheduled task is running...")


def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(func=some_task, trigger=CronTrigger(hour=0))
    scheduler.start()


# Call the scheduler when the app starts
start_scheduler()


@app.get("/")
def root():
    return {"message": "Welcome to the Bodega Esports Platform API!"}


@app.get("/ping")
def ping():
    return {"message": "pong"}
