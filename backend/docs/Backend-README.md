# Bodega Esports Platform — Backend

![Python](https://img.shields.io/badge/python-3.10%2B-blue.svg)
![Render](https://img.shields.io/badge/deployed%20on-Render-46b946)
![CI](https://github.com/wersplat/bodega-esports-platform/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/github/license/wersplat/bodega-esports-platform)

## Overview

The backend is a FastAPI service providing a REST API for managing players, teams, matches, and stats for the Bodega Esports Platform. It includes endpoints for leaderboards, standings, OCR-based stat extraction, and integrates with Discord for authentication.

## Tech Stack

- **Python 3.10+**
- **FastAPI** (web framework)
- **Uvicorn** (ASGI server)
- **SQLAlchemy** (ORM, Supabase Postgres backend)
- **Docker** (optional for local dev)
- **Render** (cloud deployment)

## Features

- Core API endpoints:  
  - `/api/leaderboard`  
  - `/api/standings`  
  - `/api/ocr`  
  - `/api/teams`  
  - `/api/matches`
- Row Level Security (RLS) via Supabase
- Stat normalization & MVP scoring
- CSV/Google Sheets export hooks
- Discord OAuth compatibility

## Folder Structure

```
backend/app/
├── api/
├── db/
├── models/
├── schemas/
├── main.py
├── config.py
```

## Quick Start

1. Clone the repo:  
     `git clone https://github.com/wersplat/bodega-esports-platform.git`
2. Enter backend:  
     `cd bodega-esports-platform/backend`
3. Create virtualenv & activate:  
     `python -m venv venv && source venv/bin/activate`
4. Install dependencies:  
     `pip install -r requirements.txt`
5. Copy and edit environment variables:  
     `cp .env.example .env`
6. Run server:  
     `uvicorn app.main:app --reload`

## Configuration

Key environment variables:

- `DATABASE_URL` — Supabase Postgres connection string
- `SUPABASE_KEY` — Supabase service key
- `DISCORD_OAUTH_CLIENT_ID` / `DISCORD_OAUTH_CLIENT_SECRET` — Discord OAuth credentials
- `SECRET_KEY` — FastAPI secret

## Deployment on Render

- Render auto-detects `backend/` as a web service.
- **Build command:** `pip install -r requirements.txt`
- **Start command:** `uvicorn app.main:app --host 0.0.0.0 --port 10000`
- **Health check:** `/healthz`

## Testing

- Run tests with:  
    `pytest`

## API Documentation

- OpenAPI docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Contributing

- Issues and PRs welcome!
- Follow PEP8 and repo coding style.
- Branches: `master` = production, `react` = frontend.

## License & Author

- GPLv3 License
- © [Bodega Cats Gaming Club](https://github.com/wersplat/bodega-esports-platform)
