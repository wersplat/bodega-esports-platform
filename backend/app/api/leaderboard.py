from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi.responses import StreamingResponse
from io import StringIO
import csv

from app.database import get_db
from app.models.models import PlayerStat, Profile, Match
from app.utils.sheets import append_leaderboard_to_sheet

router = APIRouter()


@router.get("/api/leaderboard")
def leaderboard(
    season_id: int,
    team_id: int = None,
    division_id: int = None,
    db: Session = Depends(get_db),
):
    query = db.query(
        PlayerStat, Profile.username
    ).join(
        Profile, PlayerStat.player_id == Profile.id
    )

    query = query.filter(PlayerStat.season_id == season_id)

    if team_id:
        query = query.filter(PlayerStat.team_id == team_id)
    if division_id:
        query = query.filter(Match.division_id == division_id)

    stats = []
    for stat, username in query.all():
        total_matches = db.query(Match).filter(
            (
                (Match.team1_id == stat.team_id) |
                (Match.team2_id == stat.team_id)
            ),
            Match.season_id == season_id
        ).count()

        wins = db.query(Match).filter(
            Match.winner_id == stat.team_id,
            Match.season_id == season_id
        ).count()

        win_pct = round(wins / total_matches, 2) if total_matches > 0 else 0

        stats.append(
            {
                "player_id": stat.player_id,
                "username": username,
                "points_per_game": stat.points,
                "assists_per_game": stat.assists,
                "rebounds_per_game": stat.rebounds,
                "win_percentage": win_pct,
            }
        )

    return stats


@router.get("/api/leaderboard/export/csv")
def export_csv(season_id: int, db: Session = Depends(get_db)):
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(["Username", "Points", "Assists", "Rebounds", "Win %"])

    query = (
        db.query(PlayerStat, Profile.username)
        .join(Profile, PlayerStat.player_id == Profile.id)
        .filter(PlayerStat.season_id == season_id)
    )

    for stat, username in query.all():
        writer.writerow([
            username,
            stat.points,
            stat.assists,
            stat.rebounds,
            "N/A",
        ])

    output.seek(0)
    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=leaderboard.csv",
        },
    )


@router.get("/api/leaderboard/export/sheets")
def export_to_sheets(season_id: int, db: Session = Depends(get_db)):
    stats = leaderboard(season_id, db=db)
    success = append_leaderboard_to_sheet(season_id, stats)
    return {"status": "success" if success else "error"}