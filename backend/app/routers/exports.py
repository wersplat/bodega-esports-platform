from fastapi import APIRouter, Depends, Query
from app.utils.sheets import write_sheet
from app.routers.standings import get_standings
from app.routers.leaderboard import get_leaderboard
from app.database import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/export", tags=["Google Sheets Export"])

SHEET_ID = "your_google_sheet_id_here"

@router.post("/standings-to-sheets")
def export_standings_to_sheets(season_id: int = Query(...), db: Session = Depends(get_db)):
    standings_by_season = get_standings(season_id=season_id, db=db)
    rows = []
    for team in standings_by_season.get(season_id, []):
        rows.append([
            team["team_name"],
            team["wins"],
            team["losses"],
            team["point_diff"],
            team["win_pct"]
        ])

    write_sheet(
        SHEET_ID,
        tab_name=f"Standings S{season_id}",
        headers=["Team", "Wins", "Losses", "Point Diff", "Win %"],
        rows=rows
    )
    return {"status": "Standings exported to Google Sheets."}

@router.post("/leaderboard-to-sheets")
def export_leaderboard_to_sheets(
    season_id: int = Query(...),
    min_games: int = Query(5),
    db: Session = Depends(get_db)
):
    players = get_leaderboard(season_id=season_id, min_games=min_games, db=db)
    rows = []
    for p in players:
        rows.append([p.player_name, p.team_name, p.ppg, p.apg, p.rpg, p.eff, "✅" if p.mvp else ""])

    write_sheet(
        SHEET_ID,
        tab_name=f"Leaderboard S{season_id}",
        headers=["Player", "Team", "PPG", "APG", "RPG", "EFF", "MVP"],
        rows=rows
    )
    return {"status": "Leaderboard exported to Google Sheets."}
