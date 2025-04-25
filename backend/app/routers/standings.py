from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Team, Match, MatchSubmission
from collections import defaultdict
import io
import csv

router = APIRouter(prefix="/api/standings", tags=["Standings"])


@router.get("/", response_model=dict)
def get_standings(season_id: int | None = None, db: Session = Depends(get_db)):
    # Filter match submissions by season (if given)
    match_query = db.query(
        MatchSubmission.match_id
    ).distinct().join(
        Match, Match.id == MatchSubmission.match_id
    )
    if season_id:
        match_query = match_query.filter(Match.season_id == season_id)
    match_ids = [row[0] for row in match_query.all()]

    matches = db.query(Match).filter(Match.id.in_(match_ids)).all()

    standings = defaultdict(lambda: {
        "wins": 0,
        "losses": 0,
        "point_diff": 0,
    })

    for match in matches:
        if match.winner_id:
            standings[match.winner_id]["wins"] += 1
            standings[match.loser_id]["losses"] += 1
            standings[match.winner_id]["point_diff"] += match.point_diff
            standings[match.loser_id]["point_diff"] -= match.point_diff

    result = {
        team_id: {
            "team_name": (
                db.query(Team.name)
                .filter(Team.id == team_id)
                .scalar()
            ),
            **stats,
            "win_pct": round(
                stats["wins"] / (stats["wins"] + stats["losses"]), 2
            ) if stats["wins"] + stats["losses"] > 0 else 0,
        }
        for team_id, stats in standings.items()
    }

    return result


@router.get("/export")
def export_standings_csv(
    season_id: int = Query(...), db: Session = Depends(get_db)
):
    # Flattened single season standings for export
    raw_data = get_standings(season_id, db)
    teams = raw_data.get(season_id, [])

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Team", "Wins", "Losses", "Point Diff", "Win %"])
    for team in teams:
        writer.writerow([
            team["team_name"],
            team["wins"],
            team["losses"],
            team["point_diff"],
            team["win_pct"]
        ])

    response = StreamingResponse(
        iter([output.getvalue()]), media_type="text/csv"
    )
    response.headers[
        "Content-Disposition"
    ] = f"attachment; filename=standings_s{season_id}.csv"
    return response
