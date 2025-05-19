# FastAPI imports
from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse

# Database imports
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

# Project imports
from app.models import Team, Match, PlayerStat
from app.models.models import User as Profile
from app.api.v2.base import not_found_error
from app.database import get_db

# Type imports
from typing import Optional
from datetime import datetime
from enum import Enum
import io
import csv

# For Excel export
import pandas as pd

router = APIRouter(
    prefix="/api/v2",
    tags=["Exports"],
    responses={
        404: {"description": "Resource not found"},
        400: {"description": "Invalid parameters"}
    }
)


class ExportFormat(str, Enum):
    CSV = "csv"
    EXCEL = "excel"
    JSON = "json"


class ExportType(str, Enum):
    TEAMS = "teams"
    PLAYERS = "players"
    MATCHES = "matches"
    STATS = "stats"
    STANDINGS = "standings"


@router.get("/export/{export_type}", response_model=None)
async def export_data(
    export_type: ExportType,
    format: ExportFormat = Query(ExportFormat.CSV),
    season_id: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    team_id: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """Export data in various formats"""
    data = []
    filename = f"{export_type}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    # Get requested data based on export type
    if export_type == ExportType.TEAMS:
        query = select(Team)
        if season_id:
            query = query.where(Team.season_id == season_id)
        result = await db.execute(query)
        teams = result.scalars().all()
        data = [{
            "id": str(team.id),
            "name": team.name,
            "description": team.description,
            "season_id": str(team.season_id) if team.season_id else None,
            "status": team.status,
            "created_at": team.created_at.isoformat() if team.created_at else None,
            "updated_at": team.updated_at.isoformat() if team.updated_at else None,
        } for team in teams]
        
    elif export_type == ExportType.PLAYERS:
        query = select(Profile)
        result = await db.execute(query)
        profiles = result.scalars().all()
        data = [{
            "id": str(profile.id),
            "username": profile.username,
            "display_name": profile.display_name,
            "gamer_tag": profile.gamer_tag,
            "platform": profile.platform,
            "status": profile.status,
            "created_at": profile.created_at.isoformat() if profile.created_at else None,
        } for profile in profiles]
    
    elif export_type == ExportType.MATCHES:
        query = select(Match)
        if season_id:
            query = query.where(Match.season_id == season_id)
        if team_id:
            query = query.where(or_(Match.team1_id == team_id, Match.team2_id == team_id))
        result = await db.execute(query)
        matches = result.scalars().all()
        data = [{
            "id": str(match.id),
            "team1_id": str(match.team1_id),
            "team2_id": str(match.team2_id),
            "team1_score": match.team1_score,
            "team2_score": match.team2_score,
            "scheduled_at": match.scheduled_at.isoformat() if match.scheduled_at else None,
            "status": match.status,
            "season_id": str(match.season_id) if match.season_id else None,
        } for match in matches]
    
    elif export_type == ExportType.STATS:
        query = select(PlayerStat)
        if team_id:
            # This would need a join with matches and then filtering by team_id
            pass
        result = await db.execute(query)
        stats = result.scalars().all()
        data = [{
            "id": str(stat.id),
            "profile_id": str(stat.profile_id),
            "match_id": str(stat.match_id),
            "stat_type": stat.stat_type,
            "value": stat.value,
            "created_at": stat.created_at.isoformat() if stat.created_at else None,
        } for stat in stats]
    
    # Return data in the requested format
    if format == ExportFormat.JSON:
        return {"data": data}
    
    elif format == ExportFormat.CSV:
        # Create in-memory CSV file
        if not data:
            not_found_error(f"No data found for export type: {export_type}")
            
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=data[0].keys())
        writer.writeheader()
        writer.writerows(data)
        output.seek(0)
        
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}.csv"}
        )
    
    elif format == ExportFormat.EXCEL:
        # Create in-memory Excel file
        if not data:
            not_found_error(f"No data found for export type: {export_type}")
            
        output = io.BytesIO()
        df = pd.DataFrame(data)
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            df.to_excel(writer, sheet_name=export_type.capitalize(), index=False)
        output.seek(0)
        
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename={filename}.xlsx"}
        )
