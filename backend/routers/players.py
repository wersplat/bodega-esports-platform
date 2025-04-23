from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models.models import Player
from database import get_db
from schemas.player import PlayerCreate, PlayerRead

router = APIRouter(prefix="/players", tags=["Players"])
...
