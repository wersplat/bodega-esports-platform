import logging
from datetime import datetime, timedelta
from typing import List, Optional, TypedDict, Dict, Any

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, validator
from sqlalchemy import Column, DateTime, Integer, String, Table, select
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.base import Base
from app.utils.wp_auth import verify_wp_user
from app.models.models import Team
# Initialize logger
logger = logging.getLogger(__name__)

# ─── type definitions ───────────────────────────────────────────────────────────
class MatchResponse(BaseModel):
    status: str
    match_id: str

class TeamResponse(BaseModel):
    status: str
    team_id: str

# ─── router setup ─────────────────────────────────────────────────────────────
router = APIRouter(
    prefix="/api/v2/wp-sync",
    tags=["WordPress Sync"],
    responses={
        401: {"description": "Unauthorized"},
        400: {"description": "Bad Request"},
        500: {"description": "Internal Server Error"},
    },
)

# ─── sync requests table ──────────────────────────────────────────────────────
sync_requests = Table(
    "sync_requests",
    Base.metadata,
    Column("id", String, primary_key=True),
    Column("wp_id", String, nullable=False),
    Column("type", String, nullable=False),  # 'match' or 'team'
    Column("status", String, nullable=False),
    Column("payload", JSONB, nullable=False),
    Column("created_at", DateTime, nullable=False),
    Column("updated_at", DateTime, nullable=False),
    Column("attempts", Integer, nullable=False, default=0),
    Column("last_error", String),
)

# ─── auth setup ───────────────────────────────────────────────────────────────

# ─── request schemas ───────────────────────────────────────────────────────────
class WPSyncMatch(BaseModel):
    wp_id: str
    title: str
    date: str  # ISO8601
    teams: Optional[List[str]] = None
    status: Optional[str] = "scheduled"

    @validator("wp_id")
    def validate_wp_id(cls, v):
        if not v:
            raise ValueError("wp_id cannot be empty")
        if not v.isdigit():
            raise ValueError("wp_id must be a numeric string")
        return v

    @validator("date")
    def must_be_iso8601(cls, v):
        try:
            datetime.fromisoformat(v)
            return v
        except ValueError:
            raise ValueError("Date must be ISO8601 (YYYY-MM-DDTHH:MM:SS)")

    @validator("status")
    def validate_status(cls, v):
        valid_statuses = {"scheduled", "completed", "cancelled"}
        if v and v.lower() not in valid_statuses:
            raise ValueError(f"Invalid status. Must be one of: {', '.join(valid_statuses)}")
        return v.lower() if v else "scheduled"

class WPSyncTeam(BaseModel):
    wp_id: str
    name: str

    @validator("wp_id")
    def validate_wp_id(cls, v):
        if not v:
            raise ValueError("wp_id cannot be empty")
        if not v.isdigit():
            raise ValueError("wp_id must be a numeric string")
        return v

    @validator("name")
    def validate_name(cls, v):
        if not v:
            raise ValueError("name cannot be empty")
        if len(v) > 100:
            raise ValueError("name must be less than 100 characters")
        return v

# ─── health check ───────────────────────────────────────────────────────────────
@router.get("/health")
async def health_check():
    logging.info("Health check requested")
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "wp-sync"
    }

# ─── cleanup endpoints ──────────────────────────────────────────────────────────
@router.delete("/cleanup")
async def cleanup_old_syncs(
    db: AsyncSession = Depends(get_db),
    days_to_keep: int = Query(30, ge=1, le=90, description="Number of days to keep data")
):
    logging.info(f"Cleaning up old sync attempts older than {days_to_keep} days")
    try:
        async with db.begin():
            await db.execute(
                "DELETE FROM matches WHERE created_at < NOW() - INTERVAL :days",
                {"days": f"{days_to_keep} days"}
            )
            await db.execute(
                "DELETE FROM teams WHERE created_at < NOW() - INTERVAL :days",
                {"days": f"{days_to_keep} days"}
            )
            await db.execute(
                "DELETE FROM sync_requests WHERE created_at < NOW() - INTERVAL :days",
                {"days": f"{days_to_keep} days"}
            )
        logging.info("Cleanup completed successfully")
        return {"status": "success", "message": f"Cleaned up data older than {days_to_keep} days"}
    except Exception as e:
        logging.error(f"Error cleaning up old syncs: {str(e)}")
        raise HTTPException(500, "Internal server error")

# ─── status endpoint ────────────────────────────────────────────────────────────
@router.get("/status/{wp_id}")
async def get_sync_status(
    wp_id: str,
    db: AsyncSession = Depends(get_db)
):
    logging.info(f"Checking sync status for wp_id={wp_id}")
    try:
        result = await db.execute(
            select(sync_requests)
            .where(sync_requests.c.wp_id == wp_id)
            .order_by(sync_requests.c.updated_at.desc())
            .limit(1)
        )
        request = result.fetchone()
        if not request:
            raise HTTPException(404, "No sync history found")
            
        return {
            "wp_id": request.wp_id,
            "type": request.type,
            "status": request.status,
            "last_attempt": request.updated_at.isoformat(),
            "attempts": request.attempts,
            "last_error": request.last_error
        }
    except Exception as e:
        logging.error(f"Error fetching sync status for wp_id={wp_id}: {str(e)}")
        raise HTTPException(500, "Internal server error")

# ─── team sync endpoint ────────────────────────────────────────────────────────────
@router.post(
    "/teams",
    response_model=TeamResponse,
    responses={
        200: {"description": "created or updated"},
        400: {"description": "bad request"},
        401: {"description": "unauthorized"},
        500: {"description": "internal server error"},
    },
)
async def sync_team(
    team_data: WPSyncTeam,
    db: AsyncSession = Depends(get_db),
    wp_user: dict = Depends(verify_wp_user),
):
    logging.info(f"WP-Sync /teams called for wp_id={team_data.wp_id}")
    
    try:
        async with db.begin():
            result = await db.execute(
                select(Team).where(Team.wp_id == team_data.wp_id)
            )
            existing = result.scalar_one_or_none()

            if existing:
                existing.name = team_data.name
                await db.flush()
                logging.info(f"Updated team wp_id={team_data.wp_id} with name={team_data.name}")
                payload = {"status": "updated", "team_id": str(existing.id)}
            else:
                new = Team(
                    wp_id=team_data.wp_id,
                    name=team_data.name,
                )
                db.add(new)
                await db.flush()
                logging.info(f"Created team wp_id={team_data.wp_id} with name={team_data.name}")
                payload = {"status": "created", "team_id": str(new.id)}

        return JSONResponse(
            payload,
            headers={
                "Cache-Control": "no-store",
                "Pragma": "no-cache",
                "X-Request-ID": os.urandom(16).hex()[:8]
            }
        )

    except Exception as e:
        logging.exception(f"Error syncing team wp_id={team_data.wp_id}: {str(e)}")
        raise HTTPException(500, "Internal server error")

# ─── retry endpoint ────────────────────────────────────────────────────────────
@router.post("/retry/{wp_id}")
async def retry_sync(
    wp_id: str,
    db: AsyncSession = Depends(get_db)
):
    logging.info(f"Attempting to retry sync for wp_id={wp_id}")
    try:
        result = await db.execute(
            select(sync_requests).where(sync_requests.c.wp_id == wp_id)
        )
        request = result.fetchone()
        if not request:
            raise HTTPException(404, "No failed sync request found")
            
        if request.status == "success":
            raise HTTPException(400, "No need to retry successful sync")
            
        # Re-process the sync
        payload = request.payload
        if request.type == "match":
            match_data = WPSyncMatch(**payload)
            return await sync_match(match_data, db, request.authorization)
        elif request.type == "team":
            team_data = WPSyncTeam(**payload)
            return await sync_team(team_data, db, request.authorization)
        else:
            raise HTTPException(400, f"Unknown sync type: {request.type}")
            
    except Exception as e:
        logging.error(f"Error retrying sync for wp_id={wp_id}: {str(e)}")
        raise HTTPException(500, "Internal server error")

# ─── batch processing endpoint ──────────────────────────────────────────────────────
@router.post(
    "/matches/batch",
    response_model=List[MatchResponse],
    responses={
        200: {"description": "batch processed"},
        400: {"description": "bad request"},
        401: {"description": "unauthorized"},
        500: {"description": "internal server error"},
    },
)
async def sync_matches_batch(
    matches_data: List[WPSyncMatch],
    db: AsyncSession = Depends(get_db),
    wp_user: dict = Depends(verify_wp_user),
    batch_size: int = Query(50, ge=1, le=100, description="Number of items per batch")
):
    logging.info(f"Batch sync requested for {len(matches_data)} matches with batch size {batch_size}")
    
    # Token verification is handled by verify_wp_admin dependency
    logging.info(f"Authenticated as WordPress user: {wp_user['wp_username']} (ID: {wp_user['wp_user_id']})")

    results = []
    async with db.begin():
        # Process in batches
        for i in range(0, len(matches_data), batch_size):
            batch = matches_data[i:i + batch_size]
            for match_data in batch:
                try:
                    result = await sync_match(match_data, db, authorization)
                    results.append(result)
                except HTTPException as e:
                    results.append({
                        "status": "error",
                        "wp_id": match_data.wp_id,
                        "error": e.detail
                    })
    
    return {"results": results}