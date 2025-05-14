from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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
import importlib
import app.analytics_models.analytics_log  # Ensure models are imported for metadata
from sqlalchemy.ext.asyncio import AsyncEngine

async def create_analytics_tables():
    if analytics_engine is not None:
        async with analytics_engine.begin() as conn:
            await conn.run_sync(AnalyticsBase.metadata.create_all)

@app_instance.on_event("startup")
async def on_startup():
    await create_analytics_tables()

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
def some_task():
    print("Scheduled task is running...")

def start_scheduler():
    sched = BackgroundScheduler()
    sched.add_job(func=some_task, trigger=CronTrigger(hour=0))
    sched.start()

start_scheduler()

@app_instance.get("/")
def root():
    return {"message": "Welcome to the Bodega Esports Platform API!"}

@app_instance.get("/ping")
def ping():
    return {"message": "pong"}
