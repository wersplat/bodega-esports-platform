from fastapi import FastAPI
from routers import teams, players, matches  # ✅ must match filenames

app = FastAPI()

app.include_router(teams.router)
app.include_router(players.router)
app.include_router(matches.router)

@app.get("/")
def root():
    return {"message": "Backend is live"}

@app.get("/ping")
def ping():
    return {"message": "pong"}
