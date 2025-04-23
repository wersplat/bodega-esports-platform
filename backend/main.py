from fastapi import FastAPI
from routers import teams, players, matches

app = FastAPI()

# Include routers
app.include_router(teams.router)
app.include_router(players.router)
app.include_router(matches.router)

# Health check route
@app.get("/ping")
def ping():
    return {"message": "pong"}
