from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from collections import defaultdict
import json, io, csv

from app.database import get_db
from app.models.models import PlayerStat, Profile, Team
from app.schemas.leaderboard import PlayerLeaderboardEntry

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])

@router.get("/", response_model=list[PlayerLeaderboardEntry])
def get_leaderboard(
    season_id: int = Query(...),
    min_games: int = Query(5),
    sort_by: str = Query("ppg", regex="^(ppg|apg|rpg|eff)$"),
    db: Session = Depends(get_db)
):
    raw_stats = db.query(PlayerStat).filter(PlayerStat.season_id == season_id).all()

    player_aggregate = defaultdict(lambda: {
        "games": 0,
        "points": 0,
        "assists": 0,
        "rebounds": 0,
        "steals": 0,
        "blocks": 0,
        "turnovers": 0,
        "fouls": 0,
        "player_id": None,
        "team_id": None
    })

    for stat in raw_stats:
        p = player_aggregate[stat.player_id]
        p["games"] += 1
        p["points"] += stat.points
        p["assists"] += stat.assists
        p["rebounds"] += stat.rebounds
        p["steals"] += stat.steals
        p["blocks"] += stat.blocks
        p["turnovers"] += stat.turnovers
        p["fouls"] += stat.fouls
        p["player_id"] = stat.player_id
        p["team_id"] = stat.team_id

    leaderboard = []

    for player_id, stats in player_aggregate.items():
        if stats["games"] < min_games:
            continue

        profile = db.query(Profile).filter(Profile.id == player_id).first()
        team = db.query(Team).filter(Team.id == stats["team_id"]).first()

        leaderboard.append(PlayerLeaderboardEntry(
            player_id=player_id,
            player_name=profile.username if profile else "Unknown",
            team_id=team.id if team else 0,
            team_name=team.name if team else "Unknown",
            ppg=round(stats["points"] / stats["games"], 2),
            apg=round(stats["assists"] / stats["games"], 2),
            rpg=round(stats["rebounds"] / stats["games"], 2),
            eff=round(
                (stats["points"] + stats["assists"] + stats["rebounds"] +
                 stats["steals"] + stats["blocks"] -
                 stats["turnovers"] - stats["fouls"]) / stats["games"], 2
            ),
            mvp=False  # default
        ))

    leaderboard = sorted(leaderboard, key=lambda x: -getattr(x, sort_by))
    if leaderboard:
        leaderboard[0].mvp = True

    return leaderboard

@router.get("/export")
def export_leaderboard_csv(
    season_id: int = Query(...),
    min_games: int = Query(5),
    sort_by: str = Query("ppg", regex="^(ppg|apg|rpg|eff)$"),
    db: Session = Depends(get_db)
):
    players = get_leaderboard(season_id=season_id, min_games=min_games, sort_by=sort_by, db=db)

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Player", "Team", "PPG", "APG", "RPG", "EFF", "MVP"])
    for p in players:
        writer.writerow([p.player_name, p.team_name, p.ppg, p.apg, p.rpg, p.eff, "✅" if p.mvp else ""])

    response = StreamingResponse(iter([output.getvalue()]), media_type="text/csv")
    response.headers["Content-Disposition"] = f"attachment; filename=leaderboard_s{season_id}.csv"
    return response
