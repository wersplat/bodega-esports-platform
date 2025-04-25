from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import PlayerStat, Match, Team, Profile
from sqlalchemy import func

router = APIRouter(prefix="/api/stats", tags=["Stats Charts"])


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

    return [
        {
            "player_id": result.player_id,
            "username": result.username,
            "avg_points": round(result.avg_points, 2),
        }
        for result in results
    ]


@router.get("/team-wins")
def team_wins(season_id: int, db: Session = Depends(get_db)):
    results = db.query(
        Team.id.label("team_id"),
        Team.name.label("team_name"),
        func.count(Match.winner_id).label("wins")
    ).join(
        Match, Match.winner_id == Team.id
    ).filter(
        Match.season_id == season_id
    ).group_by(
        Team.id, Team.name
    ).all()

    return [
        {
            "team_id": r.team_id,
            "team_name": r.team_name,
            "wins": r.wins,
        }
        for r in results
    ]


@router.get("/stat-progression")
def stat_progression(
    player_id: int,
    stat_type: str = Query("points"),
    db: Session = Depends(get_db),
):
    results = db.query(
        Match.scheduled_time,
        getattr(PlayerStat, stat_type)
    ).join(
        Match, Match.id == PlayerStat.match_id
    ).filter(
        PlayerStat.player_id == player_id
    ).order_by(
        Match.scheduled_time
    ).all()

    return [
        {
            "date": r.scheduled_time.isoformat(),
            stat_type: r[1],
        }
        for r in results
    ]
