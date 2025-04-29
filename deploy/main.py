from fastapi import FastAPI, Request
import subprocess

app = FastAPI()

SECRET_TOKEN = "your-super-secret-token"  # CHANGE THIS

REPO_PATH = "/opt/bodega-esports/bodega-esports-platform"  # corrected

@app.post("/deploy-backend")
async def deploy_backend(request: Request):
    token = request.headers.get("Authorization")
    if token != f"Bearer {SECRET_TOKEN}":
        return {"status": "unauthorized"}

    # Git pull latest changes
    git_pull = subprocess.run(["git", "pull"], cwd=REPO_PATH, capture_output=True, text=True)
    pull_output = git_pull.stdout.strip()

    if "Already up to date." in pull_output:
        return {"status": "success", "message": "No updates pulled, no restart needed."}
    else:
        # Restart ONLY the backend docker service
        subprocess.run(["docker", "compose", "restart", "backend"], cwd=REPO_PATH)
        return {"status": "success", "message": "Updates pulled, backend restarted."}
