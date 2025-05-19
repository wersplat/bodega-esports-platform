from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.responses import StreamingResponse
from io import StringIO
import csv
import asyncio
from sqlalchemy.future import select
from sqlalchemy import or_
from starlette.concurrency import run_in_threadpool

from app.database import get_db
from app.models.models import PlayerStat, User as Profile, Match
from app.utils.sheets import append_leaderboard_to_sheet  # You’ll implement this

router = APIRouter(prefix="/api/leaderboard", tags=["Leaderboard"])


@router.get("/")
async def get_leaderboard(
    season_id: int,
    team_id: int = None,
    division_id: int = None,
    db: AsyncSession = Depends(get_db),
):
    stmt = select(PlayerStat, Profile.username).join(Profile, PlayerStat.user_id == Profile.id)
    stmt = stmt.where(PlayerStat.season_id == season_id)
    if team_id:
        stmt = stmt.where(PlayerStat.team_id == team_id)
    if division_id:
        stmt = stmt.where(Match.division_id == division_id)

    result = await db.execute(stmt)
    rows = result.all()
    stats = []
    for stat, username in rows:
        total_matches_stmt = select(Match).where(
            or_(Match.team1_id == stat.team_id, Match.team2_id == stat.team_id),
            Match.season_id == season_id
        )
        total_matches_result = await db.execute(total_matches_stmt)
        total_matches_count = len(total_matches_result.scalars().all())
        wins_stmt = select(Match).where(
            Match.winner_id == stat.team_id,
            Match.season_id == season_id
        )
        wins_result = await db.execute(wins_stmt)
        wins_count = len(wins_result.scalars().all())
        win_pct = round(wins_count / total_matches_count, 2) if total_matches_count > 0 else 0
        stats.append({
            "player_id": stat.player_id,
            "username": username,
            "points_game": stat.points_game,
            "assists_game": stat.assists_game,
            "rebounds_game": stat.rebounds_game,
            "win_percentage": win_pct,
        })
    return stats


@router.get("/export/csv")
async def export_csv(season_id: int, db: AsyncSession = Depends(get_db)):
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(["Username", "Points", "Assists", "Rebounds", "Win %"])

    stmt = select(PlayerStat, Profile.username).join(Profile, PlayerStat.player_id == Profile.id).where(PlayerStat.season_id == season_id)
    result = await db.execute(stmt)
    rows = result.all()
    for stat, username in rows:
        writer.writerow([
            username,
            stat.points,
            stat.assists,
            stat.rebounds,
            "N/A"  # You can add win % logic here too
        ])
    output.seek(0)
    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=leaderboard.csv"
        },
    )


@router.get("/export/sheets")
async def export_to_sheets(season_id: int, db: AsyncSession = Depends(get_db)):
    stats = await get_leaderboard(season_id, db=db)
    success = await run_in_threadpool(append_leaderboard_to_sheet, season_id, stats)
    return {"status": "success" if success else "error"}
