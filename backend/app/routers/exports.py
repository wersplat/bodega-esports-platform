from fastapi import APIRouter, Depends, Query, HTTPException, status
from app.utils.sheets import write_sheet
from app.routers.standings import get_standings
from app.routers.leaderboard import get_leaderboard
from app.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.concurrency import run_in_threadpool
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/exports", tags=["Exports"])

SHEET_ID = "your_google_sheet_id_here"


@router.post("/export-standings")
async def export_standings_to_sheets(
    season_id: int = Query(...),
    db: AsyncSession = Depends(get_db)
):
    standings_by_season = await run_in_threadpool(get_standings, season_id, db)
    rows = []
    for team in standings_by_season.get(season_id, []):
        rows.append([
            team['team_name'],
            team['wins'],
            team['losses'],
            team['point_diff'],
            team['win_pct']
        ])
    await run_in_threadpool(write_sheet, SHEET_ID, "Standings", rows)
    return {"message": "Standings exported successfully."}


@router.post("/export-leaderboard")
async def export_leaderboard_to_sheets(
    season_id: int = Query(...),
    min_games: int = Query(5),
    db: AsyncSession = Depends(get_db)
):
    players = await run_in_threadpool(get_leaderboard, season_id, min_games, db)
    rows = []
    for p in players:
        rows.append([
            p.player_name,
            p.team_name,
            p.ppg,
            p.apg,
            p.rpg,
            p.eff,
            "✅" if p.mvp else ""
        ])
    await run_in_threadpool(
        write_sheet,
        SHEET_ID,
        tab_name=f"Leaderboard S{season_id}",
        headers=["Player", "Team", "PPG", "APG", "RPG", "EFF", "MVP"],
        rows=rows
    )
    return {"status": "Leaderboard exported to Google Sheets."}


@router.post("/export-all")
async def export_all_to_sheets(
    season_id: int = Query(...),
    min_games: int = Query(5),
    db: AsyncSession = Depends(get_db)
):
    # Export standings
    standings_by_season = await run_in_threadpool(get_standings, season_id, db)
    standings_rows = []
    for team in standings_by_season.get(season_id, []):
        standings_rows.append([
            team["team_name"],
            team["wins"],
            team["losses"],
            team["point_diff"],
            team["win_pct"]
        ])
    await run_in_threadpool(
        write_sheet,
        SHEET_ID,
        tab_name=f"Standings S{season_id}",
        headers=["Team", "Wins", "Losses", "Point Diff", "Win %"],
        rows=standings_rows
    )
    # Export leaderboard
    players = await run_in_threadpool(get_leaderboard, season_id, min_games, db)
    leaderboard_rows = []
    for p in players:
        leaderboard_rows.append([
            p.player_name,
            p.team_name,
            p.ppg,
            p.apg,
            p.rpg,
            p.eff,
            "✅" if p.mvp else ""
        ])
    await run_in_threadpool(
        write_sheet,
        SHEET_ID,
        tab_name=f"Leaderboard S{season_id}",
        headers=["Player", "Team", "PPG", "APG", "RPG", "EFF", "MVP"],
        rows=leaderboard_rows
    )
    return {"status": "All data exported to Google Sheets."}


@router.post("/discord/announce")
async def send_discord_announcement(
    webhook_url: str,
    title: str,
    description: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Endpoint to send a Discord announcement.

    :param webhook_url: The Discord webhook URL.
    :param title: The title of the announcement.
    :param description: The description of the announcement.
    """
    from app.utils.discord import send_discord_message

    # Ensure the user is authorized to send announcements
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to send announcements."
        )

    # Prepare the embed for the announcement
    embed = {
        "title": title,
        "description": description,
        "color": 5814783  # Blue color
    }

    # Send the message using the utility function
    try:
        send_discord_message(webhook_url, content="", embeds=[embed])
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send announcement: {str(e)}"
        )

    return {"status": "success", "message": "Announcement sent successfully."}
