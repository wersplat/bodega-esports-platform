from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Season, Team, Division
from typing import Optional

router = APIRouter(prefix="/api/meta", tags=["Meta"])


# Utility function for pagination
def paginate_query(query, skip: int, limit: int):
    return query.offset(skip).limit(limit)


@router.get("/seasons")
def get_seasons(
    db: Session = Depends(get_db),
    league_id: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1)
):
    query = db.query(Season).order_by(Season.id.desc())
    if league_id:
        query = query.filter(Season.league_id == league_id)
    return paginate_query(query, skip, limit).all()


@router.get("/teams")
def get_teams(
    db: Session = Depends(get_db),
    division_id: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1)
):
    query = db.query(Team).order_by(Team.name)
    if division_id:
        query = query.filter(Team.division_id == division_id)
    return paginate_query(query, skip, limit).all()


@router.get("/divisions")
def get_divisions(
    db: Session = Depends(get_db),
    season_id: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1)
):
    query = db.query(Division).order_by(Division.name)
    if season_id:
        query = query.filter(Division.season_id == season_id)
    return paginate_query(query, skip, limit).all()
