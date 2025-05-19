from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.models import PlayerStat, Match, Team, User as Profile
from sqlalchemy import func, select

router = APIRouter(prefix="/api/stats", tags=["Stats Charts"])


@router.get("/top-scorers")
async def top_scorers(season_id: int, db: AsyncSession = Depends(get_db)):
    stmt = select(
        PlayerStat.user_id,
        func.avg(PlayerStat.points).label("avg_points"),
        Profile.id,
        Profile.username
    ).join(Profile, PlayerStat.user_id == Profile.id)
    stmt = stmt.where(PlayerStat.season_id == season_id)
    stmt = stmt.group_by(PlayerStat.user_id, Profile.id, Profile.username)
    stmt = stmt.order_by(func.avg(PlayerStat.points).desc())
    stmt = stmt.limit(10)
    result = await db.execute(stmt)
    results = result.all()
    return [
        {
            "profile_id": r.user_id,
            "username": r.username,
            "avg_points": round(r.avg_points, 2),
        }
        for r in results
    ]


@router.get("/team-wins")
async def team_wins(season_id: int, db: AsyncSession = Depends(get_db)):
    stmt = select(
        Team.id.label("team_id"),
        Team.name.label("team_name"),
        func.count(Match.winner_id).label("wins")
    ).join(Match, Match.winner_id == Team.id)
    stmt = stmt.where(Match.season_id == season_id)
    stmt = stmt.group_by(Team.id, Team.name)
    result = await db.execute(stmt)
    results = result.all()
    return [
        {
            "team_id": r.team_id,
            "team_name": r.team_name,
            "wins": r.wins,
        }
        for r in results
    ]


@router.get("/stat-progression")
async def stat_progression(
    profile_id: int,
    stat_type: str = Query("points"),
    db: AsyncSession = Depends(get_db),
):
    # Use SQLAlchemy text() for dynamic column
    from sqlalchemy import text
    stat_col = getattr(PlayerStat, stat_type, None)
    if stat_col is None:
        return []
    stmt = select(
        Match.scheduled_time,
        stat_col
    ).join(Match, Match.id == PlayerStat.match_id)
    stmt = stmt.where(PlayerStat.profile_id == profile_id)
    stmt = stmt.order_by(Match.scheduled_time)
    result = await db.execute(stmt)
    results = result.all()
    return [
        {
            "date": r.scheduled_time.isoformat(),
            stat_type: r[1],
        }
        for r in results
    ]
