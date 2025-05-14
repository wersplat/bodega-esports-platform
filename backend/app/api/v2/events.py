from app.api.v2.types import APIRouter, Depends, HTTPException, Query
from app.api.v2.types import AsyncSession
from app.api.v2.types import raise_error, not_found_error, conflict_error
from app.api.v2.types import ListResponse, SingleResponse
from app.models import Team, League, Event
from app.api.v2.types import func, select, and_
from app.api.v2.types import List, Optional, Dict, Any, Union
from app.api.v2.types import BaseModel, Field
from app.api.v2.types import datetime
from dateutil.relativedelta import relativedelta
from app.api.v2.types import Enum

router = APIRouter(
    prefix="/api/v2",
    tags=["Events"],
    responses={
        404: {"description": "Event not found"},
        400: {"description": "Invalid date range"},
        409: {"description": "Event conflict"}
    }
)

class EventStatus(str, Enum):
    SCHEDULED = "scheduled"
    LIVE = "live"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    POSTPONED = "postponed"

class EventBase(BaseModel):
    id: int = Field(description="Event ID")
    title: str = Field(description="Event title")
    date: datetime = Field(description="Event date and time")
    venue: Optional[str] = Field(default=None, description="Event venue")
    status: EventStatus = Field(description="Event status")
    teams: List[Dict[str, str]] = Field(description="Participating teams")
    league: Optional[Dict[str, str]] = Field(default=None, description="League information")
    season: Optional[Dict[str, str]] = Field(default=None, description="Season information")
    created_at: datetime = Field(description="Event creation timestamp")
    updated_at: datetime = Field(description="Event last update timestamp")
    
    class Config:
        orm_mode = True
        allow_population_by_field_name = True

class EventResult(BaseModel):
    team_id: int
    score: Optional[int]
    outcome: Optional[str]

class EventOut(EventBase):
    results: List[EventResult]
    lineups: Dict[str, List[Dict[str, str]]]
    stats: Dict[str, any]

@router.get("/events", response_model=ListResponse[EventBase])
async def list_events(
    start_date: Optional[date] = Query(None, description="Start date for filtering"),
    end_date: Optional[date] = Query(None, description="End date for filtering"),
    team_id: Optional[int] = Query(None, description="Filter by team ID"),
    league_id: Optional[int] = Query(None, description="Filter by league ID"),
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    try:
        # Base query
        stmt = select(Event)
        
        # Apply filters
        if start_date:
            stmt = stmt.where(Event.date >= start_date)
        if end_date:
            stmt = stmt.where(Event.date <= end_date)
        if team_id:
            stmt = stmt.where(Event.teams.any(Team.id == team_id))
        if league_id:
            stmt = stmt.where(Event.league_id == league_id)
            
        # Count total items
        total_stmt = select(func.count()).select_from(stmt.subquery())
        total = await db.execute(total_stmt)
        total = total.scalar()
        
        # Apply pagination
        offset = (page - 1) * per_page
        stmt = stmt.offset(offset).limit(per_page)
        
        # Get results
        result = await db.execute(stmt)
        events = result.scalars().all()
        
        return ListResponse(
            items=events,
            pagination={
                "total": total,
                "page": page,
                "per_page": per_page,
                "total_pages": (total + per_page - 1) // per_page
            }
        )
        
    except Exception as e:
        raise_error(
            code="INTERNAL_ERROR",
            message="Failed to fetch events",
            details={"error": str(e)}
        )

@router.get("/events/upcoming", response_model=ListResponse[EventBase])
async def get_upcoming_events(
    days: int = Query(7, ge=1, le=30, description="Number of days to look ahead"),
    db: AsyncSession = Depends(get_db)
):
    try:
        # Get events from now until X days ahead
        now = datetime.utcnow()
        end_date = now + relativedelta(days=days)
        
        stmt = select(Event)
        stmt = stmt.where(
            and_(
                Event.date >= now,
                Event.date <= end_date
            )
        )
        stmt = stmt.order_by(Event.date.asc())
        
        result = await db.execute(stmt)
        events = result.scalars().all()
        
        return ListResponse(
            items=events,
            metadata={
                "date_range": {
                    "start": now.isoformat(),
                    "end": end_date.isoformat()
                }
            }
        )
        
    except Exception as e:
        raise_error(
            code="INTERNAL_ERROR",
            message="Failed to fetch upcoming events",
            details={"error": str(e)}
        )

@router.get("/events/{event_id}", response_model=SingleResponse[EventOut])
async def get_event(
    event_id: int,
    db: AsyncSession = Depends(get_db)
):
    try:
        # Get event details
        stmt = select(Event)
        stmt = stmt.where(Event.id == event_id)
        result = await db.execute(stmt)
        event = result.scalar()
        
        if not event:
            raise not_found_error("Event", event_id)
            
        # Get results
        results_stmt = select(EventResult)
        results_stmt = results_stmt.where(EventResult.event_id == event_id)
        results_result = await db.execute(results_stmt)
        results = results_result.scalars().all()
        
        # Get lineups
        lineups_stmt = select(Player)
        lineups_stmt = lineups_stmt.join(EventResult)
        lineups_stmt = lineups_stmt.where(EventResult.event_id == event_id)
        lineups_result = await db.execute(lineups_stmt)
        players = lineups_result.scalars().all()
        
        # Format response
        event_data = {
            **event.dict(),
            "results": [result.dict() for result in results],
            "lineups": {
                "home": [],
                "away": []
            },
            "stats": {}
        }
        
        return SingleResponse(item=event_data)
        
    except Exception as e:
        raise_error(
            code="INTERNAL_ERROR",
            message="Failed to fetch event details",
            details={"error": str(e)}
        )
