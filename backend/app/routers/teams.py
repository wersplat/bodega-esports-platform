from fastapi import APIRouter

router = APIRouter(prefix="/teams", tags=["Teams"])

@router.get("/teams/all")
def get_all_teams(db: Session = Depends(get_db)):
    teams = db.query(Team).all()
    return [{"id": t.id, "name": t.name} for t in teams]
