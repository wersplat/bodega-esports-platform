from fastapi import FastAPI, Request
import subprocess
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path="/opt/bodega-esports/bodega-esports-platform/backend/.env")

app = FastAPI()

SECRET_TOKEN = os.getenv("DEPLOY_SECRET_TOKEN")
REPO_PATH = "/opt/bodega-esports/bodega-esports-platform"

@app.get("/")
async def root():
    return {"message": "Deploy Server Running"}

@app.post("/deploy-backend")
async def deploy_backend(request: Request):
    token = request.headers.get("Authorization")
    if token != f"Bearer {SECRET_TOKEN}":
        return {"status": "unauthorized"}

    git_pull = subprocess.run(["git", "pull"], cwd=REPO_PATH, capture_output=True, text=True)
    pull_output = git_pull.stdout.strip()

    if "Already up to date." in pull_output:
        return {"status": "success", "message": "No updates pulled, no restart needed."}
    else:
        subprocess.run(["docker", "compose", "restart", "backend"], cwd=REPO_PATH)
        return {"status": "success", "message": "Updates pulled, backend restarted."}
