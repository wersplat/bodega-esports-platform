from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi.responses import StreamingResponse
from io import StringIO
import csv

from app.database import get_db
from app.models.models import PlayerStat, Match, User as Profile
from app.utils.sheets import append_leaderboard_to_sheet

router = APIRouter()


@router.get("/api/leaderboard")
async def leaderboard(
    season_id: int,
    team_id: int = None,
    division_id: int = None,
    db: AsyncSession = Depends(get_db),
):
    stmt = select(PlayerStat, Profile.username).join(Profile, PlayerStat.user_id == Profile.id).join(Match, PlayerStat.match_id == Match.id).where(PlayerStat.season_id == season_id)
    if team_id:
        stmt = stmt.where(PlayerStat.team_id == team_id)
    if division_id:
        stmt = stmt.where(Match.division_id == division_id)
    result = await db.execute(stmt)
    rows = result.all()
    stats = []
    for stat, username in rows:
        match_stmt = select(Match).where(
            ((Match.team1_id == stat.team_id) | (Match.team2_id == stat.team_id)),
            Match.season_id == season_id
        )
        total_matches = len((await db.execute(match_stmt)).scalars().all())
        stats.append({
            "username": username,
            "team_id": stat.team_id,
            "total_points": stat.points,
            "total_assists": stat.assists,
            "total_rebounds": stat.rebounds,
            "total_matches": total_matches,
        })
    return stats


@router.get("/api/leaderboard/export/csv")
def export_csv(season_id: int, db: AsyncSession = Depends(get_db)):
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(["Username", "Points", "Assists", "Rebounds", "Win %"])

    query = (
        db.query(PlayerStat, Profile.username)
        .join(Profile, PlayerStat.player_id == Profile.id)
        .join(Match, PlayerStat.match_id == Match.id)
        .filter(PlayerStat.season_id == season_id)
    )

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

        win_percentage = (
            (wins / total_matches * 100) if total_matches > 0 else 0
        )

        writer.writerow([
            username,
            stat.points,
            stat.assists,
            stat.rebounds,
            f"{win_percentage:.2f}%",
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
def export_to_sheets(season_id: int, db: AsyncSession = Depends(get_db)):
    stats = leaderboard(season_id, db=db)
    success = append_leaderboard_to_sheet(season_id, stats)
    return {"status": "success" if success else "error"}

