from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Division

router = APIRouter()

@router.get("/divisions")
def get_all_divisions(db: Session = Depends(get_db)):
    divisions = db.query(Division).all()
    return [{"id": div.id, "name": div.name} for div in divisions]
