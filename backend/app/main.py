print("STARTING MAIN.PY")
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk import capture_exception
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger  # REMOVE if not used below
from contextlib import asynccontextmanager

# Router imports
from app.api.v2.matches import router as matches_router
from app.api.v2.standings import router as standings_router
from app.api.v2.events import router as events_router
from app.api.v2.leagues import router as leagues_router
from app.api.v2.seasons import router as seasons_router
from app.api.v2.notifications import router as notifications_router
from app.api.v2.payments import router as payments_router
from app.api.v2.contracts import router as contracts_router
from app.api.v2.discord import router as discord_router
from app.api.v2.divisions import router as divisions_router
from app.api.v2.exports import router as exports_router
from app.api.leaderboard import router as leaderboard_router
from app.api.v2.match_submissions import router as match_submissions_router
from app.api.v2.meta import router as meta_router
from app.api.v2.players import router as players_router
from app.routers.player_stats import router as player_stats_router # type: ignore
from app.api.v2.profiles import router as profiles_router
from app.api.v2.teams import router as teams_router
from app.api.v2.webhooks import router as webhooks_router
from app.api.v2.stats_charts import router as stats_charts_router
from app.api.v2.forms import router as forms_router
from app.api.v2.wp_sync import router as wp_sync_router
from app.utils.auth import auth_router
# Remove: from app.api.v2.rosters import router as rosters_router
# Remove: from app.api.v2.stats import router as stats_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await create_analytics_tables()
    except Exception as e:
        print(f"Error during startup: {e}")
    yield

app_instance = FastAPI(lifespan=lifespan)

# --- Sentry Setup ---
sentry_sdk.init(
     dsn="https://667d0a143ec1895e4c1279da4585325a@o4509330775277568.ingest.us.sentry.io/4509330779078656",
    # Add data like request headers and IP for users,
    # see https://docs.sentry.io/platforms/python/data-management/data-collected/ for more info
    send_default_pii=True,
    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for tracing.
    traces_sample_rate=1.0,
    # Set profile_session_sample_rate to 1.0 to profile 100%
    # of profile sessions.
    profile_session_sample_rate=1.0,
    # Set profile_lifecycle to "trace" to automatically
    # run the profiler on when there is an active transaction
    profile_lifecycle="trace",
    integrations=[FastApiIntegration()],
)

# --- Analytics DB Table Creation ---
from app.database import analytics_engine
from app.analytics_models.base import AnalyticsBase
import app.analytics_models.analytics_log  # Ensure models are imported for metadata

async def create_analytics_tables():
    if analytics_engine is None:
        return
    try:
        async with analytics_engine.begin() as conn:
            await conn.run_sync(AnalyticsBase.metadata.create_all)
    except Exception as e:
        print(f"Error creating analytics tables: {e}")

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
app_instance.include_router(seasons_router, prefix="/api/seasons", tags=["seasons"])
app_instance.include_router(teams_router, prefix="/api/teams", tags=["teams"])
# app_instance.include_router(rosters_router, prefix="/api/rosters", tags=["rosters"])  # REMOVE: rosters_router does not exist
app_instance.include_router(players_router, prefix="/api/players", tags=["players"])
app_instance.include_router(matches_router, prefix="/api/matches", tags=["matches"])
app_instance.include_router(standings_router, prefix="/api/standings", tags=["standings"])
app_instance.include_router(events_router, prefix="/api/events", tags=["events"])
app_instance.include_router(leagues_router, prefix="/api/leagues", tags=["leagues"])
app_instance.include_router(notifications_router, prefix="/api/notifications", tags=["notifications"])
app_instance.include_router(payments_router, prefix="/api/payments", tags=["payments"])
app_instance.include_router(contracts_router, prefix="/api/contracts", tags=["contracts"])
app_instance.include_router(discord_router, prefix="/api/discord", tags=["discord"])
app_instance.include_router(divisions_router, prefix="/api/divisions", tags=["divisions"])
app_instance.include_router(exports_router, prefix="/api/exports", tags=["exports"])
app_instance.include_router(leaderboard_router, prefix="/api/leaderboard", tags=["leaderboard"])
app_instance.include_router(match_submissions_router, prefix="/api/match_submissions", tags=["match_submissions"])
app_instance.include_router(meta_router, prefix="/api/meta", tags=["meta"])
app_instance.include_router(player_stats_router, prefix="/api/player_stats", tags=["player_stats"])
# Profiles router is now mounted at /api/v2/profiles in the router itself
app_instance.include_router(profiles_router)
from app.api.v2.media import router as media_router
app_instance.include_router(media_router, prefix="/api/v2", tags=["Media"])
# app_instance.include_router(stats_router, prefix="/api/stats", tags=["stats"])  # REMOVE: stats_router does not exist
app_instance.include_router(stats_charts_router, prefix="/api/stats_charts", tags=["stats_charts"])
app_instance.include_router(forms_router, prefix="/api/forms", tags=["forms"])
app_instance.include_router(webhooks_router, prefix="/api/webhooks", tags=["webhooks"])
app_instance.include_router(wp_sync_router, prefix="/api/v2/wp-sync", tags=["WordPress Sync"])

# === Error Handling ===
@app_instance.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers=getattr(exc, "headers", None)
    )

@app_instance.exception_handler(Exception)
async def generic_exception_handler(request, exc):
    capture_exception(exc)  # ← this is the missing piece
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
        headers={"X-Error": "Internal server error"}
    )

# === Scheduler ===
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

@app_instance.get("/sentry-debug")
async def trigger_error():
    division_by_zero = 1 / 0

@app_instance.get("/")
def root():
    return {"message": "Welcome to the Bodega Esports Platform API!"}

@app_instance.get("/ping")
def ping():
    return {"message": "pong"}

@app_instance.get("/health")
def health():
    return {"status": "ok"}

@app_instance.get("/health/live")
def live():
    return {"status": "ok"}

@app_instance.get("/health/ready")
def ready():
    return {"status": "ok"}

app = app_instance