from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Team, Match, MatchSubmission, MatchResult
from app.schemas.standings import TeamStanding
import json, io, csv
from collections import defaultdict

router = APIRouter(prefix="/standings", tags=["Standings"])

@router.get("/", response_model=dict)
def get_standings(season_id: int | None = None, db: Session = Depends(get_db)):
    # Filter match submissions by season (if given)
    match_query = db.query(MatchSubmission.match_id).distinct().join(Match, Match.id == MatchSubmission.match_id)
    if season_id:
        match_query = match_query.filter(Match.season_id == season_id)
    match_ids = [row[0] for row in match_query.all()]

    matches = db.query(Match).filter(Match.id.in_(match_ids)).all()

    season_grouped_standings = defaultdict(list)

    for match in matches:
        result = db.query(MatchResult).filter(MatchResult.match_id == match.id).first()
        if not result:
            continue

        try:
            result_data = json.loads(result.result_data)
            team1_score = result_data["team1_score"]
            team2_score = result_data["team2_score"]
        except (KeyError, json.JSONDecodeError):
            continue

        team1_id = match.team1_id
        team2_id = match.team2_id
        winner_id = match.winner_id
        season_id = match.season_id
        point_diff = abs(team1_score - team2_score)

        standings = {}
        for tid in [team1_id, team2_id]:
            team = db.query(Team).filter(Team.id == tid).first()
            standings[tid] = {
                "team_id": tid,
                "team_name": team.name,
                "wins": 0,
                "losses": 0,
                "point_diff": 0
            }

        if winner_id:
            loser_id = team1_id if winner_id == team2_id else team2_id
            standings[winner_id]["wins"] += 1
            standings[loser_id]["losses"] += 1
            standings[winner_id]["point_diff"] += point_diff
            standings[loser_id]["point_diff"] -= point_diff

        for team in standings.values():
            total_games = team["wins"] + team["losses"]
            team["win_pct"] = round(team["wins"] / total_games, 3) if total_games else 0
            season_grouped_standings[season_id].append(team)

    return season_grouped_standings


@router.get("/export")
def export_standings_csv(season_id: int = Query(...), db: Session = Depends(get_db)):
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

    response = StreamingResponse(iter([output.getvalue()]), media_type="text/csv")
    response.headers["Content-Disposition"] = f"attachment; filename=standings_s{season_id}.csv"
    return response
