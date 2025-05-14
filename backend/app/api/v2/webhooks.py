from datetime import datetime, timedelta, UTC
from enum import Enum
from typing import Any, ClassVar, Dict, List, Optional

from fastapi import APIRouter, Body, Depends, Query, Path
from pydantic import BaseModel, Field, HttpUrl
from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v2.base import not_found_error, raise_error
from app.api.v2.responses import ListResponse, SingleResponse
from app.database import get_db
from app.models import Player, PlayerStat, Team, Webhook
from app.api.v2.players import PlayerStats

router = APIRouter(
    prefix="/api/v2",
    tags=["Webhooks"],
    responses={
        404: {"description": "Webhook not found"},
        400: {"description": "Invalid webhook configuration"},
        409: {"description": "Webhook conflict"}
    }
)

class WebhookType(str, Enum):
    TEAM_UPDATE = "team_update"
    TEAM_MEMBER_UPDATE = "team_member_update"
    ROSTER_UPDATE = "roster_update"
    TEAM_RANKING = "team_ranking"
    PLAYER_UPDATE = "player_update"
    PLAYER_STATS = "player_stats"
    PLAYER_RANKING = "player_ranking"
    GAME_SCHEDULE = "game_schedule"
    GAME_RESULT = "game_result"
    GAME_STATS = "game_stats"
    LEAGUE_UPDATE = "league_update"
    SEASON_UPDATE = "season_update"
    ADMIN_NOTIFICATION = "admin_notification"
    SYSTEM_ALERT = "system_alert"

class WebhookConfig(BaseModel):
    url: HttpUrl               = Field(description="Webhook URL")
    secret: str                = Field(description="Webhook secret")
    events: List[WebhookType]  = Field(description="List of events to subscribe to")
    team_id: Optional[int]     = Field(default=None, description="Team ID to filter events")
    player_id: Optional[str]   = Field(default=None, description="Player ID to filter events")
    active: bool               = Field(default=True, description="Webhook active status")
    retry_count: int           = Field(default=3, description="Number of retry attempts")
    retry_delay: int           = Field(default=60, description="Delay between retries in seconds")
    rate_limit: int            = Field(default=100, description="Maximum requests per minute")
    last_retry: Optional[datetime] = Field(default=None, description="Timestamp of last retry")
    last_error: Optional[str]  = Field(default=None, description="Last error message")
    created_at: datetime       = Field(default_factory=datetime.utcnow, description="Creation timestamp")
    updated_at: datetime       = Field(default_factory=datetime.utcnow, description="Last update timestamp")

    class Config:
        from_attributes = True

class WebhookEventOut(BaseModel):
    event_type: WebhookType    = Field(description="Type of event")
    timestamp: datetime        = Field(description="Event timestamp")
    data: Dict[str, Any]       = Field(description="Event data")
    webhook_id: str            = Field(description="Webhook ID")
    attempt: int               = Field(default=1, description="Delivery attempt number")
    max_attempts: int          = Field(default=3, description="Maximum delivery attempts")

    STATS_UPDATE: ClassVar[str]              = "stats_update"
    ACHIEVEMENT_UPDATE: ClassVar[str]        = "achievement_update"
    GAME_UPDATE: ClassVar[str]               = "game_update"
    GAME_STATS_SUBMITTED: ClassVar[str]      = "game_stats_submitted"
    GAME_MVP_AWARDED: ClassVar[str]          = "game_mvp_awarded"
    SEASON_UPDATE: ClassVar[str]             = "season_update"
    SEASON_SUMMARY: ClassVar[str]            = "season_summary"
    SCHEDULE_UPDATE: ClassVar[str]           = "schedule_update"
    MATCH_SCHEDULED: ClassVar[str]           = "match_scheduled"
    MATCH_RESCHEDULED: ClassVar[str]         = "match_rescheduled"
    LEADERBOARD_UPDATE: ClassVar[str]        = "leaderboard_update"
    WEEKLY_TOP5: ClassVar[str]               = "weekly_top5"
    DAILY_MVP: ClassVar[str]                 = "daily_mvp"
    SYSTEM_ALERT: ClassVar[str]              = "system_alert"
    ANNOUNCEMENT: ClassVar[str]              = "announcement"
    STATS_SUBMISSION_FLAGGED: ClassVar[str]  = "stats_submission_flagged"
    STATS_SUBMISSION_APPROVED: ClassVar[str] = "stats_submission_approved"
    STATS_SUBMISSION_DENIED: ClassVar[str]   = "stats_submission_denied"
    ADMIN_ACTION: ClassVar[str]              = "admin_action"
    MODERATION_ACTION: ClassVar[str]         = "moderation_action"

    class Config:
        from_attributes = True

class WebhookOut(BaseModel):
    id: int
    url: HttpUrl
    secret: str
    events: List[WebhookType]
    team_id: Optional[int]
    player_id: Optional[int]
    active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class WebhookEventIn(BaseModel):
    event: WebhookType
    data: Dict[str, Any]
    timestamp: datetime

class WebhookVerification(BaseModel):
    challenge: str
    timestamp: datetime
    signature: str

class WebhookRetry(BaseModel):
    webhook_id: int
    event: WebhookEventOut
    attempt: int
    last_attempt: datetime
    next_attempt: datetime
    error: str
    
    class Config:
        from_attributes = True

# ... rest of handlers and routes remain unchanged ...
