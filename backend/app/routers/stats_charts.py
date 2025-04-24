from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import PlayerStat, Match, Team, Profile
from sqlalchemy import func

router = APIRouter(prefix="/api/stats", tags=["Chart Data"])

@router.get("/top-scorers")
def top_scorers(season_id: int, db: Session = Depends(get_db)):
    results = (
        db.query(
            PlayerStat.player_id,
            func.avg(PlayerStat.points).label("avg_points"),
            Profile.id,
            Profile.username
        )
        .join(Profile, PlayerStat.player_id == Profile.id)
        .filter(PlayerStat.season_id == season_id)
        .group_by(PlayerStat.player_id, Profile.id, Profile.username)
        .order_by(func.avg(PlayerStat.points).desc())
        .limit(10)
        .all()
    )
    return [{"player_id": r.player_id, "username": r.username, "avg_points": round(r.avg_points, 2)} for r in results]

@router.get("/team-wins")
def team_wins(season_id: int, db: Session = Depends(get_db)):
    results = (
        db.query(
            Team.id.label("team_id"),
            Team.name.label("team_name"),
            func.count(Match.id).label("wins")
        )
        .join(Match, Team.id == Match.winner_id)
        .filter(Match.season_id == season_id)
        .group_by(Team.id, Team.name)
        .order_by(func.count(Match.id).desc())
        .all()
    )
    return [{"team_id": r.team_id, "team_name": r.team_name, "wins": r.wins} for r in results]

@router.get("/stat-progression")
def stat_progression(player_id: int, stat_type: str = Query("points"), db: Session = Depends(get_db)):
    # Sanitize allowed stat_type to prevent injection
    if stat_type not in {"points", "assists", "rebounds", "steals", "blocks"}:
        return {"error": "Invalid stat type"}

    # Use raw column access to dynamically select stat field
    stat_column = getattr(PlayerStat, stat_type)

    results = (
        db.query(
            Match.scheduled_time,
            stat_column
        )
        .join(Match, PlayerStat.match_id == Match.id)
        .filter(PlayerStat.player_id == player_id)
        .order_by(Match.scheduled_time.asc())
        .all()
    )

    return [{"date": r.scheduled_time.isoformat(), stat_type: r[1]} for r in results]
