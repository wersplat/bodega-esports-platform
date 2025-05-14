from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

# Router imports
from app.api.v2 import (
    matches,
    standings,
    events,
    leagues,
    seasons,
    notifications,
    payments,
    contracts,
    discord,
    divisions,
    exports,
    leaderboard,
    match_submissions,
    meta,
    players,
    player_stats,
    profiles,
    stats,
    stats_charts,
    teams,
    forms,
)
from app.utils.auth import router as auth_router

app_instance = FastAPI()

# --- Analytics DB Table Creation ---
from app.database import analytics_engine
from app.analytics_models.base import AnalyticsBase
import app.analytics_models.analytics_log  # Ensure models are imported for metadata
from sqlalchemy.ext.asyncio import AsyncEngine

async def create_analytics_tables():
    if analytics_engine is None:
        return
    try:
        async with analytics_engine.begin() as conn:
            await conn.run_sync(AnalyticsBase.metadata.create_all)
    except Exception as e:
        print(f"Error creating analytics tables: {e}")

@app_instance.on_event("startup")
async def on_startup():
    try:
        await create_analytics_tables()
    except Exception as e:
        print(f"Error during startup: {e}")

app_instance.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://dashboard.bodegacatsgc.gg",
        "https://api.bodegacatsgc.gg",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Include all routers ===
app_instance.include_router(auth_router)
app_instance.include_router(seasons.router, prefix="/api/seasons", tags=["seasons"])
app_instance.include_router(teams.router, prefix="/api/teams", tags=["teams"])
app_instance.include_router(rosters.router, prefix="/api/rosters", tags=["rosters"])
app_instance.include_router(players.router, prefix="/api/players", tags=["players"])
app_instance.include_router(matches.router, prefix="/api/matches", tags=["matches"])
app_instance.include_router(standings.router, prefix="/api/standings", tags=["standings"])
app_instance.include_router(events.router, prefix="/api/events", tags=["events"])
app_instance.include_router(leagues.router, prefix="/api/leagues", tags=["leagues"])
app_instance.include_router(notifications.router, prefix="/api/notifications", tags=["notifications"])
app_instance.include_router(payments.router, prefix="/api/payments", tags=["payments"])
app_instance.include_router(contracts.router, prefix="/api/contracts", tags=["contracts"])
app_instance.include_router(discord.router, prefix="/api/discord", tags=["discord"])
app_instance.include_router(divisions.router, prefix="/api/divisions", tags=["divisions"])
app_instance.include_router(exports.router, prefix="/api/exports", tags=["exports"])
app_instance.include_router(leaderboard.router, prefix="/api/leaderboard", tags=["leaderboard"])
app_instance.include_router(match_submissions.router, prefix="/api/match_submissions", tags=["match_submissions"])
app_instance.include_router(meta.router, prefix="/api/meta", tags=["meta"])
app_instance.include_router(player_stats.router, prefix="/api/player_stats", tags=["player_stats"])
app_instance.include_router(profiles.router, prefix="/api/users", tags=["users"])
app_instance.include_router(stats.router, prefix="/api/stats", tags=["stats"])
app_instance.include_router(stats_charts.router, prefix="/api/stats_charts", tags=["stats_charts"])
app_instance.include_router(forms.router, prefix="/api/forms", tags=["forms"])

# === Scheduler ===
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

def some_task():
    logger.info("Scheduled task is running...")

def start_scheduler():
    try:
        sched = BackgroundScheduler()
        sched.add_job(func=some_task, trigger=CronTrigger(hour=0))
        sched.start()
        logger.info("Scheduler started successfully")
    except Exception as e:
        logger.error(f"Failed to start scheduler: {e}")

start_scheduler()

@app_instance.get("/")
def root():
    return {"message": "Welcome to the Bodega Esports Platform API!"}

@app_instance.get("/ping")
def ping():
    return {"message": "pong"}
