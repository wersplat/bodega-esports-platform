from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models.models import Team
from database import get_db
from schemas.team import TeamCreate, TeamRead

router = APIRouter(prefix="/teams", tags=["Teams"])
...
