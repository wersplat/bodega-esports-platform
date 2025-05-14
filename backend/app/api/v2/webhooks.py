from datetime import datetime, timedelta, UTC
from enum import Enum
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Body, Depends, Query
from pydantic import BaseModel, Field, HttpUrl
from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v2.base import not_found_error, raise_error
from app.api.v2.responses import ListResponse, SingleResponse
from app.database import get_db
from app.models import Player, PlayerStats, Team, Webhook

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
    # Team-related events
    TEAM_UPDATE = "team_update"
    TEAM_MEMBER_UPDATE = "team_member_update"
    ROSTER_UPDATE = "roster_update"
    TEAM_RANKING = "team_ranking"
    
    # Player-related events
    PLAYER_UPDATE = "player_update"
    PLAYER_STATS = "player_stats"
    PLAYER_RANKING = "player_ranking"
    
    # Game-related events
    GAME_SCHEDULE = "game_schedule"
    GAME_RESULT = "game_result"
    GAME_STATS = "game_stats"
    
    # League-related events
    LEAGUE_UPDATE = "league_update"
    SEASON_UPDATE = "season_update"
    
    # Admin events
    ADMIN_NOTIFICATION = "admin_notification"
    SYSTEM_ALERT = "system_alert"

class WebhookConfig(BaseModel):
    url: HttpUrl = Field(description="Webhook URL")
    secret: str = Field(description="Webhook secret")
    events: List[WebhookType] = Field(description="List of events to subscribe to")
    team_id: Optional[int] = Field(default=None, description="Team ID to filter events")
    player_id: Optional[str] = Field(default=None, description="Player ID to filter events")
    active: bool = Field(default=True, description="Webhook active status")
    retry_count: int = Field(default=3, description="Number of retry attempts")
    retry_delay: int = Field(default=60, description="Delay between retries in seconds")
    rate_limit: int = Field(default=100, description="Maximum requests per minute")
    last_retry: Optional[datetime] = Field(default=None, description="Timestamp of last retry")
    last_error: Optional[str] = Field(default=None, description="Last error message")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Creation timestamp")
    updated_at: datetime = Field(default_factory=datetime.utcnow, description="Last update timestamp")

class WebhookEvent(BaseModel):
    event_type: WebhookType = Field(description="Type of event")
    timestamp: datetime = Field(description="Event timestamp")
    data: Dict[str, Any] = Field(description="Event data")
    webhook_id: str = Field(description="Webhook ID")
    attempt: int = Field(default=1, description="Delivery attempt number")
    max_attempts: int = Field(default=3, description="Maximum delivery attempts")
    STATS_UPDATE = "stats_update"
    ACHIEVEMENT_UPDATE = "achievement_update"
    
    # Game-related events
    GAME_UPDATE = "game_update"
    GAME_STATS_SUBMITTED = "game_stats_submitted"
    GAME_MVP_AWARDED = "game_mvp_awarded"
    
    # Season-related events
    SEASON_UPDATE = "season_update"
    SEASON_SUMMARY = "season_summary"
    
    # Schedule events
    SCHEDULE_UPDATE = "schedule_update"
    MATCH_SCHEDULED = "match_scheduled"
    MATCH_RESCHEDULED = "match_rescheduled"
    
    # Analytics events
    LEADERBOARD_UPDATE = "leaderboard_update"
    WEEKLY_TOP5 = "weekly_top5"
    DAILY_MVP = "daily_mvp"
    
    # System events
    SYSTEM_ALERT = "system_alert"
    ANNOUNCEMENT = "announcement"
    STATS_SUBMISSION_FLAGGED = "stats_submission_flagged"
    STATS_SUBMISSION_APPROVED = "stats_submission_approved"
    STATS_SUBMISSION_DENIED = "stats_submission_denied"
    
    # Admin events
    ADMIN_ACTION = "admin_action"
    MODERATION_ACTION = "moderation_action"

class WebhookConfig(BaseModel):
    url: HttpUrl = Field(..., description="Webhook URL to receive events")
    secret: str = Field(..., description="Secret token for webhook verification")
    events: List[WebhookType] = Field(..., description="List of events to subscribe to")
    team_id: Optional[int] = Field(None, description="Team ID to subscribe to")
    player_id: Optional[int] = Field(None, description="Player ID to subscribe to")
    active: bool = Field(True, description="Whether the webhook is active")
    retry_count: int = Field(3, description="Number of retry attempts")
    retry_delay: int = Field(60, description="Delay between retry attempts (seconds)")
    rate_limit: int = Field(100, description="Maximum events per minute")
    last_retry: Optional[datetime] = Field(None, description="Last retry attempt timestamp")
    last_error: Optional[str] = Field(None, description="Last error message")
    
    class Config:
        orm_mode = True

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
        orm_mode = True

class WebhookEvent(BaseModel):
    event: WebhookType
    data: Dict[str, Any]
    timestamp: datetime

class WebhookVerification(BaseModel):
    challenge: str
    timestamp: datetime
    signature: str

# Webhook event handlers
async def handle_team_update(team_id: int, db: AsyncSession):
    team = await db.get(Team, team_id)
    if not team:
        return
        
    event = WebhookEvent(
        event=WebhookType.TEAM_UPDATE,
        data={
            "id": team.id,
            "name": team.name,
            "description": team.description,
            "logo_url": team.logo_url,
            "updated_at": team.updated_at
        },
        timestamp=datetime.now(UTC)
    )
    
    await send_webhook_event(event, db)

async def handle_player_update(player_id: int, db: AsyncSession):
    player = await db.get(Player, player_id)
    if not player:
        return
        
    event = WebhookEvent(
        event=WebhookType.PLAYER_UPDATE,
        data={
            "id": player.id,
            "name": player.name,
            "position": player.position,
            "jersey_number": player.jersey_number,
            "updated_at": player.updated_at
        },
        timestamp=datetime.now(UTC)
    )
    
    await send_webhook_event(event, db)

async def handle_stats_update(stats_id: int, db: AsyncSession):
    stats = await db.get(PlayerStats, stats_id)
    if not stats:
        return
        
    event = WebhookEvent(
        event=WebhookType.STATS_UPDATE,
        data={
            "id": stats.id,
            "player_id": stats.player_id,
            "game_id": stats.game_id,
            "points": stats.points,
            "assists": stats.assists,
            "rebounds": stats.rebounds,
            "updated_at": stats.updated_at
        },
        timestamp=datetime.now(UTC)
    )
    
    await send_webhook_event(event, db)

class WebhookRetry(BaseModel):
    webhook_id: int
    event: WebhookEvent
    attempt: int
    last_attempt: datetime
    next_attempt: datetime
    error: str
    
    class Config:
        orm_mode = True

async def send_webhook_event(event: WebhookEvent, db: AsyncSession):
    # Get active webhooks for this event type
    stmt = select(Webhook)
    stmt = stmt.where(
        and_(
            Webhook.active == True,
            event.event in Webhook.events
        )
    )
    
    # Apply event-specific filters
    if event.event in [WebhookType.TEAM_UPDATE, WebhookType.TEAM_MEMBER_UPDATE, WebhookType.ROSTER_UPDATE]:
        stmt = stmt.where(Webhook.team_id == event.data.get("team_id"))
    
    if event.event in [WebhookType.PLAYER_UPDATE, WebhookType.STATS_UPDATE]:
        stmt = stmt.where(Webhook.player_id == event.data.get("player_id"))
    
    webhooks = await db.execute(stmt)
    webhooks = webhooks.scalars().all()
    
    for webhook in webhooks:
        try:
            # Send webhook with retry logic
            success = await send_webhook_request(webhook, event)
            
            if not success:
                # Create retry record
                retry = WebhookRetry(
                    webhook_id=webhook.id,
                    event=event,
                    attempt=1,
                    last_attempt=datetime.now(UTC),
                    next_attempt=datetime.now(UTC) + timedelta(seconds=webhook.retry_delay),
                    error="Initial send failed"
                )
                db.add(retry)
                await db.commit()
                
        except Exception as e:
            webhook.last_error = str(e)
            webhook.last_retry = datetime.now(UTC)
            await db.commit()

async def trigger_daily_mvp_event(db: AsyncSession):
    """Trigger webhook for daily MVP announcement"""
    try:
        # Get today's MVP from API
        res = await fetch(f"{process.env.API_URL}/api/mvp/today")
        data = await res.json()
        
        # Create webhook event
        event = WebhookEvent(
            event=WebhookType.DAILY_MVP,
            data={
                "player": data.get("player"),
                "stats": data.get("stats"),
                "timestamp": datetime.now(UTC).isoformat()
            }
        )
        
        await send_webhook_event(event, db)
        
    except Exception as e:
        logger.error(f"Failed to trigger daily MVP webhook: {e}")

async def trigger_weekly_top5_event(db: AsyncSession):
    """Trigger webhook for weekly top 5 leaderboard"""
    try:
        # Get weekly top 5 from API
        res = await fetch(f"{process.env.API_URL}/api/leaderboard/top5?period=week")
        data = await res.json()
        
        # Create webhook event
        event = WebhookEvent(
            event=WebhookType.WEEKLY_TOP5,
            data={
                "top": data.get("top", []),
                "timestamp": datetime.now(UTC).isoformat()
            }
        )
        
        await send_webhook_event(event, db)
        
    except Exception as e:
        logger.error(f"Failed to trigger weekly top 5 webhook: {e}")
    # Get active webhooks for this event type
    stmt = select(Webhook)
    stmt = stmt.where(
        and_(
            Webhook.active == True,
            event.event in Webhook.events
        )
    )
    
    # Apply rate limiting
    now = datetime.now(UTC)
    stmt = stmt.where(
        or_(
            Webhook.last_retry.is_(None),
            Webhook.last_retry + timedelta(minutes=1) < now
        )
    )
    
    # If event is team-specific, filter by team_id
    if event.event in [WebhookType.TEAM_UPDATE, WebhookType.TEAM_MEMBER_UPDATE, WebhookType.ROSTER_UPDATE]:
        stmt = stmt.where(Webhook.team_id == event.data.get("id"))
    
    # If event is player-specific, filter by player_id
    if event.event in [WebhookType.PLAYER_UPDATE, WebhookType.STATS_UPDATE]:
        stmt = stmt.where(Webhook.player_id == event.data.get("player_id"))
    
    webhooks = await db.execute(stmt)
    webhooks = webhooks.scalars().all()
    
    for webhook in webhooks:
        try:
            # Check rate limit
            if webhook.rate_limit:
                events_stmt = select(func.count()).select_from(WebhookRetry)
                events_stmt = events_stmt.where(
                    and_(
                        WebhookRetry.webhook_id == webhook.id,
                        WebhookRetry.last_attempt > now - timedelta(minutes=1)
                    )
                )
                event_count = await db.execute(events_stmt)
                event_count = event_count.scalar()
                
                if event_count >= webhook.rate_limit:
                    continue
            
            # Send webhook with retry logic
            success = await send_webhook_request(webhook, event)
            
            if not success:
                # Create retry record
                retry = WebhookRetry(
                    webhook_id=webhook.id,
                    event=event,
                    attempt=1,
                    last_attempt=now,
                    next_attempt=now + timedelta(seconds=webhook.retry_delay),
                    error="Initial send failed"
                )
                db.add(retry)
                await db.commit()
                
        except Exception as e:
            webhook.last_error = str(e)
            webhook.last_retry = now
            await db.commit()

async def send_webhook_request(webhook: Webhook, event: WebhookEvent) -> bool:
    try:
        # Sign the payload
        payload = {
            "event": event.event,
            "data": event.data,
            "timestamp": event.timestamp.isoformat(),
            "signature": create_signature(webhook.secret, event.data)
        }
        
        # Send the request
        # TODO: Implement actual HTTP request with proper headers
        return True
        
    except Exception as e:
        return False

async def process_webhook_retries(db: AsyncSession):
    """Process pending webhook retries"""
    now = datetime.now(UTC)
    
    # Get pending retries
    stmt = select(WebhookRetry).join(Webhook)
    stmt = stmt.where(
        and_(
            WebhookRetry.next_attempt <= now,
            WebhookRetry.attempt < Webhook.retry_count
        )
    )
    
    retries = await db.execute(stmt)
    retries = retries.scalars().all()
    
    for retry in retries:
        try:
            success = await send_webhook_request(retry.webhook, retry.event)
            
            if success:
                await db.delete(retry)
            else:
                retry.attempt += 1
                retry.last_attempt = now
                retry.next_attempt = now + timedelta(seconds=retry.webhook.retry_delay)
                retry.error = "Retry failed"
                
            await db.commit()
            
        except Exception as e:
            retry.error = str(e)
            await db.commit()
    # Get active webhooks for this event type
    stmt = select(Webhook)
    stmt = stmt.where(
        and_(
            Webhook.active == True,
            event.event in Webhook.events
        )
    )
    
    # If event is team-specific, filter by team_id
    if event.event in [WebhookType.TEAM_UPDATE, WebhookType.TEAM_MEMBER_UPDATE]:
        stmt = stmt.where(Webhook.team_id == event.data.get("id"))
    
    # If event is player-specific, filter by player_id
    if event.event in [WebhookType.PLAYER_UPDATE, WebhookType.STATS_UPDATE]:
        stmt = stmt.where(Webhook.player_id == event.data.get("player_id"))
    
    webhooks = await db.execute(stmt)
    webhooks = webhooks.scalars().all()
    
    for webhook in webhooks:
        # TODO: Implement actual webhook sending with signature verification
        pass

@router.post(
    "/webhooks",
    response_model=SingleResponse[WebhookOut],
    summary="Create a new webhook subscription",
    description="""
    Create a new webhook subscription to receive real-time updates for specified events.
    The webhook will be verified using the provided secret token.
    """
)
async def create_webhook(
    webhook_config: WebhookConfig = Body(...),
    db: AsyncSession = Depends(get_db)
):
    try:
        # Create webhook
        webhook = Webhook(
            url=webhook_config.url,
            secret=webhook_config.secret,
            events=webhook_config.events,
            team_id=webhook_config.team_id,
            player_id=webhook_config.player_id,
            active=webhook_config.active
        )
        db.add(webhook)
        await db.commit()
        await db.refresh(webhook)
        
        return SingleResponse(item=webhook)
        
    except Exception as e:
        raise_error(
            code="INTERNAL_ERROR",
            message="Failed to create webhook",
            details={"error": str(e)}
        )

@router.get(
    "/webhooks",
    response_model=ListResponse[WebhookOut],
    summary="List webhook subscriptions",
    description="""
    List all webhook subscriptions with optional filtering.
    Supports filtering by:
    - Team ID
    - Player ID
    - Event type
    - Active status
    """
)
async def list_webhooks(
    team_id: Optional[int] = Query(None, description="Filter by team ID"),
    player_id: Optional[int] = Query(None, description="Filter by player ID"),
    event: Optional[WebhookType] = Query(None, description="Filter by event type"),
    active: Optional[bool] = Query(None, description="Filter by active status"),
    db: AsyncSession = Depends(get_db)
):
    try:
        stmt = select(Webhook)
        
        if team_id:
            stmt = stmt.where(Webhook.team_id == team_id)
        if player_id:
            stmt = stmt.where(Webhook.player_id == player_id)
        if event:
            stmt = stmt.where(event in Webhook.events)
        if active is not None:
            stmt = stmt.where(Webhook.active == active)
        
        result = await db.execute(stmt)
        webhooks = result.scalars().all()
        
        return ListResponse(items=webhooks)
        
    except Exception as e:
        raise_error(
            code="INTERNAL_ERROR",
            message="Failed to list webhooks",
            details={"error": str(e)}
        )

@router.get(
    "/webhooks/{webhook_id}",
    response_model=SingleResponse[WebhookOut],
    summary="Get webhook subscription",
    description="Retrieve details of a specific webhook subscription"
)
async def get_webhook(
    webhook_id: int = Path(..., description="The ID of the webhook to retrieve"),
    db: AsyncSession = Depends(get_db)
):
    try:
        webhook = await db.get(Webhook, webhook_id)
        if not webhook:
            raise not_found_error("Webhook", webhook_id)
            
        return SingleResponse(item=webhook)
        
    except Exception as e:
        raise_error(
            code="INTERNAL_ERROR",
            message="Failed to get webhook",
            details={"error": str(e)}
        )

@router.put(
    "/webhooks/{webhook_id}",
    response_model=SingleResponse[WebhookOut],
    summary="Update webhook subscription",
    description="Update the configuration of an existing webhook subscription"
)
async def update_webhook(
    webhook_id: int = Path(..., description="The ID of the webhook to update"),
    webhook_config: WebhookConfig = Body(...),
    db: AsyncSession = Depends(get_db)
):
    try:
        webhook = await db.get(Webhook, webhook_id)
        if not webhook:
            raise not_found_error("Webhook", webhook_id)
            
        # Update webhook
        webhook.url = webhook_config.url
        webhook.secret = webhook_config.secret
        webhook.events = webhook_config.events
        webhook.team_id = webhook_config.team_id
        webhook.player_id = webhook_config.player_id
        webhook.active = webhook_config.active
        
        await db.commit()
        await db.refresh(webhook)
        
        return SingleResponse(item=webhook)
        
    except Exception as e:
        raise_error(
            code="INTERNAL_ERROR",
            message="Failed to update webhook",
            details={"error": str(e)}
        )

@router.delete(
    "/webhooks/{webhook_id}",
    response_model=SingleResponse[Dict[str, str]],
    summary="Delete webhook subscription",
    description="Delete an existing webhook subscription"
)
async def delete_webhook(
    webhook_id: int = Path(..., description="The ID of the webhook to delete"),
    db: AsyncSession = Depends(get_db)
):
    try:
        webhook = await db.get(Webhook, webhook_id)
        if not webhook:
            raise not_found_error("Webhook", webhook_id)
            
        await db.delete(webhook)
        await db.commit()
        
        return SingleResponse(item={"message": "Webhook deleted successfully"})
        
    except Exception as e:
        raise_error(
            code="INTERNAL_ERROR",
            message="Failed to delete webhook",
            details={"error": str(e)}
        )

@router.post(
    "/webhooks/{webhook_id}/verify",
    response_model=SingleResponse[Dict[str, str]],
    summary="Verify webhook",
    description="Verify webhook URL and signature"
)

@router.post(
    "/webhooks/process-retries",
    response_model=SingleResponse[Dict[str, int]],
    summary="Process pending webhook retries",
    description="Process all pending webhook retries with rate limiting"
)

@router.get(
    "/webhooks/analytics",
    response_model=ListResponse[WebhookAnalytics],
    summary="Get webhook analytics",
    description="""
    Get analytics for all webhooks, including:
    - Success/failure rates
    - Latency statistics
    - Event distribution
    - Retry statistics
    - Rate limit hits
    """
)
async def get_webhook_analytics(
    webhook_id: Optional[int] = Query(None, description="Filter by webhook ID"),
    event_type: Optional[WebhookType] = Query(None, description="Filter by event type"),
    start_date: Optional[date] = Query(None, description="Start date for analytics"),
    end_date: Optional[date] = Query(None, description="End date for analytics"),
    db: AsyncSession = Depends(get_db)
):
    try:
        # Base query
        stmt = select(
            Webhook.id,
            Webhook.events,
            func.count().filter(WebhookRetry.success == True).label("success_count"),
            func.count().filter(WebhookRetry.success == False).label("failure_count"),
            func.max(WebhookRetry.last_attempt).label("last_success"),
            func.max(WebhookRetry.last_attempt).label("last_failure"),
            func.avg(WebhookRetry.latency).label("average_latency"),
            func.max(WebhookRetry.latency).label("max_latency"),
            func.min(WebhookRetry.latency).label("min_latency"),
            (func.count().filter(WebhookRetry.success == False) / func.count() * 100).label("error_rate"),
            func.count().filter(WebhookRetry.rate_limit_hit == True).label("rate_limit_hits")
        ).join(WebhookRetry, Webhook.id == WebhookRetry.webhook_id, isouter=True)
        
        # Apply filters
        if webhook_id:
            stmt = stmt.where(Webhook.id == webhook_id)
        if event_type:
            stmt = stmt.where(event_type in Webhook.events)
        if start_date:
            stmt = stmt.where(WebhookRetry.last_attempt >= start_date)
        if end_date:
            stmt = stmt.where(WebhookRetry.last_attempt <= end_date)
        
        # Group by webhook and event type
        stmt = stmt.group_by(Webhook.id, Webhook.events)
        
        # Calculate event distribution
        event_dist_stmt = select(
            Webhook.id,
            WebhookRetry.event,
            func.count().label("count")
        ).join(WebhookRetry, Webhook.id == WebhookRetry.webhook_id)
        event_dist_stmt = event_dist_stmt.group_by(Webhook.id, WebhookRetry.event)
        event_dist_stmt = event_dist_stmt.alias("event_dist")
        
        # Calculate retry distribution
        retry_dist_stmt = select(
            Webhook.id,
            WebhookRetry.attempt,
            func.count().label("count")
        ).join(WebhookRetry, Webhook.id == WebhookRetry.webhook_id)
        retry_dist_stmt = retry_dist_stmt.group_by(Webhook.id, WebhookRetry.attempt)
        retry_dist_stmt = retry_dist_stmt.alias("retry_dist")
        
        # Join with event and retry distributions
        stmt = stmt.outerjoin(event_dist_stmt, Webhook.id == event_dist_stmt.c.id)
        stmt = stmt.outerjoin(retry_dist_stmt, Webhook.id == retry_dist_stmt.c.id)
        
        result = await db.execute(stmt)
        analytics = result.all()
        
        return ListResponse(items=[{
            "webhook_id": a.id,
            "event_type": event_type,
            "success_count": a.success_count,
            "failure_count": a.failure_count,
            "last_success": a.last_success,
            "last_failure": a.last_failure,
            "average_latency": a.average_latency,
            "max_latency": a.max_latency,
            "min_latency": a.min_latency,
            "error_rate": a.error_rate,
            "event_distribution": {},  # TODO: Calculate event distribution
            "retry_distribution": {},  # TODO: Calculate retry distribution
            "rate_limit_hits": a.rate_limit_hits
        } for a in analytics])
        
    except Exception as e:
        raise_error(
            code="INTERNAL_ERROR",
            message="Failed to fetch webhook analytics",
            details={"error": str(e)}
        )

@router.get(
    "/webhooks/health",
    response_model=ListResponse[WebhookHealth],
    summary="Get webhook health status",
    description="""
    Get health status for all webhooks, including:
    - Response times
    - Success rates
    - Error counts
    - Last check timestamps
    """
)
async def get_webhook_health(
    webhook_id: Optional[int] = Query(None, description="Filter by webhook ID"),
    status: Optional[str] = Query(None, description="Filter by health status"),
    severity: Optional[str] = Query(None, description="Filter by alert severity"),
    db: AsyncSession = Depends(get_db)
):
    try:
        # Get webhook health
        stmt = select(
            Webhook.id,
            Webhook.active,
            Webhook.last_retry,
            Webhook.last_error,
            func.avg(WebhookRetry.latency).label("average_response_time"),
            func.count().filter(WebhookRetry.success == True).label("success_count"),
            func.count().filter(WebhookRetry.success == False).label("error_count")
        ).join(WebhookRetry, Webhook.id == WebhookRetry.webhook_id, isouter=True)
        
        # Apply filters
        if webhook_id:
            stmt = stmt.where(Webhook.id == webhook_id)
        if status:
            stmt = stmt.where(Webhook.active == (status == "active"))
        
        # Group by webhook
        stmt = stmt.group_by(Webhook.id, Webhook.active, Webhook.last_retry, Webhook.last_error)
        
        result = await db.execute(stmt)
        health = result.all()
        
        return ListResponse(items=[{
            "webhook_id": h.id,
            "status": "healthy" if h.active and not h.last_error else "unhealthy",
            "last_check": h.last_retry,
            "response_time": h.average_response_time,
            "error_count": h.error_count,
            "success_rate": (h.success_count / (h.success_count + h.error_count) * 100) if h.success_count + h.error_count > 0 else 0
        } for h in health])
        
    except Exception as e:
        raise_error(
            code="INTERNAL_ERROR",
            message="Failed to fetch webhook health",
            details={"error": str(e)}
        )

@router.get(
    "/webhooks/alerts",
    response_model=ListResponse[WebhookAlert],
    summary="Get webhook alerts",
    description="""
    Get alerts for webhook issues, including:
    - Failed deliveries
    - Rate limit hits
    - Configuration issues
    - System errors
    """
)
async def get_webhook_alerts(
    webhook_id: Optional[int] = Query(None, description="Filter by webhook ID"),
    alert_type: Optional[str] = Query(None, description="Filter by alert type"),
    severity: Optional[str] = Query(None, description="Filter by severity"),
    resolved: Optional[bool] = Query(None, description="Filter by resolved status"),
    db: AsyncSession = Depends(get_db)
):
    try:
        stmt = select(WebhookAlert)
        
        if webhook_id:
            stmt = stmt.where(WebhookAlert.webhook_id == webhook_id)
        if alert_type:
            stmt = stmt.where(WebhookAlert.alert_type == alert_type)
        if severity:
            stmt = stmt.where(WebhookAlert.severity == severity)
        if resolved is not None:
            stmt = stmt.where(WebhookAlert.resolved == resolved)
        
        stmt = stmt.order_by(WebhookAlert.timestamp.desc())
        
        result = await db.execute(stmt)
        alerts = result.scalars().all()
        
        return ListResponse(items=alerts)
        
    except Exception as e:
        raise_error(
            code="INTERNAL_ERROR",
            message="Failed to fetch webhook alerts",
            details={"error": str(e)}
        )
async def process_pending_retries(
    db: AsyncSession = Depends(get_db)
):
    try:
        # Process retries
        await process_webhook_retries(db)
        
        # Get retry statistics
        stats_stmt = select(
            func.count().label("total_retries"),
            func.count(WebhookRetry.webhook_id).distinct().label("unique_webhooks"),
            func.max(WebhookRetry.attempt).label("max_attempts")
        ).select_from(WebhookRetry)
        
        stats = await db.execute(stats_stmt)
        stats = stats.first()
        
        return SingleResponse(item={
            "message": "Webhook retries processed",
            "statistics": {
                "total_retries": stats.total_retries,
                "unique_webhooks": stats.unique_webhooks,
                "max_attempts": stats.max_attempts
            }
        })
        
    except Exception as e:
        raise_error(
            code="INTERNAL_ERROR",
            message="Failed to process webhook retries",
            details={"error": str(e)}
        )
async def verify_webhook(
    webhook_id: int = Path(..., description="The ID of the webhook to verify"),
    verification: WebhookVerification = Body(...),
    db: AsyncSession = Depends(get_db)
):
    try:
        webhook = await db.get(Webhook, webhook_id)
        if not webhook:
            raise not_found_error("Webhook", webhook_id)
            
        # TODO: Implement actual verification logic
        # This would typically involve:
        # 1. Sending a challenge request to the webhook URL
        # 2. Verifying the response matches the expected signature
        # 3. Updating the webhook status
        
        return SingleResponse(item={"message": "Webhook verification initiated"})
        
    except Exception as e:
        raise_error(
            code="INTERNAL_ERROR",
            message="Failed to verify webhook",
            details={"error": str(e)}
        )
