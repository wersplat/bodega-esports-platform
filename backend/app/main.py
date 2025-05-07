import sys
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from app.routers.seasons     import router as seasons_router
from app.routers.teams       import router as teams_router
from app.routers.rosters     import router as rosters_router
# Add backend directory to path (only if strictly needed)
backend_path = Path(__file__).resolve().parents[1]
sys.path.append(str(backend_path))

# === Router imports (pick one: app.api.*) ===
# from app.api.users import router as users_router
# from app.api.seasons import router as seasons_router
# from app.api.teams import router as teams_router
# from app.api.divisions import router as divisions_router
# from app.api.leaderboard import router as leaderboard_router
# from app.api.webhooks import router as webhooks_router

# (and any others you've built in app.api: players, matches, etc.)
# from app.api.players import router as players_router
# from app.api.matches import router as matches_router
# … etc. …

# === Utils / Auth routers ===
from app.utils.auth import router as auth_router
from app.routers import profiles
from app.routers import (
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
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://dashboard.bodegacatsgc.gg",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Include all routers ===
app.include_router(auth_router)

# app.include_router(profiles.router, prefix="/api/users", tags=["users"])
app.include_router(seasons.router)
# app.include_router(teams_router,      prefix="/api/teams",      tags=["teams"])
# app.include_router(divisions_router,  prefix="/api/divisions",  tags=["divisions"])
app.include_router(leaderboard.router)
# app.include_router(webhooks_router,   prefix="/api/webhooks",   tags=["webhooks"])
app.include_router(seasons_router, prefix="/api/seasons", tags=["seasons"])
app.include_router(teams_router,   prefix="/api/teams",   tags=["teams"])
app.include_router(rosters_router, prefix="/api/rosters", tags=["rosters"])
# app.include_router(players_router,    prefix="/api/players",    tags=["players"])
# app.include_router(matches_router,    prefix="/api/matches",    tags=["matches"])
app.include_router(matches.router)
app.include_router(standings.router)
app.include_router(events.router)
app.include_router(leagues.router)
app.include_router(seasons.router)
app.include_router(notifications.router)
app.include_router(payments.router)
app.include_router(contracts.router)
app.include_router(discord.router)
app.include_router(divisions.router)
app.include_router(exports.router)
app.include_router(leaderboard.router)
app.include_router(match_submissions.router)
app.include_router(meta.router)
app.include_router(players.router)
app.include_router(player_stats.router)
app.include_router(profiles.router, prefix="/api/users", tags=["users"])
app.include_router(stats.router)
app.include_router(stats_charts.router)
app.include_router(teams.router)
# … include the rest of your routers exactly once each …

# === Scheduler ===
def some_task():
    print("Scheduled task is running...")

def start_scheduler():
    sched = BackgroundScheduler()
    sched.add_job(func=some_task, trigger=CronTrigger(hour=0))
    sched.start()

start_scheduler()

@app.get("/")
def root():
    return {"message": "Welcome to the Bodega Esports Platform API!"}

@app.get("/ping")
def ping():
    return {"message": "pong"}
