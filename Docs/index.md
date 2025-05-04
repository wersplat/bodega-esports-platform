# Bodega Esports Platform  

_05/01/2025_
---

![Node.js](https://img.shields.io/badge/node-18.x-blue?logo=node.js)
![TypeScript](https://img.shields.io/badge/type-checked-blue?logo=typescript)
![Discord.js](https://img.shields.io/npm/v/discord.js?label=discord.js&color=blueviolet)
![License](https://img.shields.io/github/license/wersplat/bodega-esports-platform)
![Render](https://img.shields.io/badge/deployed-on%20render-3c4dff?logo=render)
![CI](https://github.com/wersplat/bodega-esports-platform/actions/workflows/ci.yml/badge.svg?branch=react)
[![GPLv3 License](https://img.shields.io/badge/license-GPLv3-blue.svg)](LICENSE)
[![Discord](https://img.shields.io/discord/854734760877752330?label=Discord&logo=discord)](https://discord.gg/bodegacatsgc)
---

## 📊 Monitoring Status

Bodega Platform monitoring via [UptimeRobot Public Dashboard](https://stats.uptimerobot.com/d061trTIVy):

| Service          | Type        | Status Badge                                                                 |
|------------------|-------------|------------------------------------------------------------------------------|
| **Frontend**    | HTTP(s)   | ![Frontend](https://img.shields.io/uptimerobot/status/m800447789-74d2d86574933346aa3b6cc0?label=Frontend%20uptime) |
| **Backend**     | HTTP(s)   | ![Backend](https://img.shields.io/uptimerobot/status/m800447858-35b48c2610c0c12087ce60fb?label=api%20uptime) |
| **Discord Bot** | Heartbeat | ![Bot](https://img.shields.io/uptimerobot/status/m800447867-6863cbd32f0761f2e5b3b358?label=bot%20uptime) |

🔗 View live status: [uptime dashboard](https://stats.uptimerobot.com/d061trTIVy)

---

## 🎯 Overview

A full-stack, modular platform for managing competitive NBA 2K leagues.  
Built to power the **Road to $25K** league, this system supports roster management, stat tracking, automated MVP calculations, leaderboard exports, and more—integrated with Discord, Supabase, and Google Sheets.

---

## 📦 Platform Components

### 🖥️ Frontend (Next.js + Tailwind)

- SSR React app for players, team managers, and admins
- Leaderboards with season/division/stat filtering
- Auth via Supabase
- Responsive mobile-first layout with custom styling
- Exports to Google Sheets and CSV

### ⚙️ Backend (FastAPI + Supabase)

- REST API for players, teams, matches, and stats
- Supabase Postgres with full schema and RLS
- Stat normalization, MVP scoring, match result handling
- Export-ready endpoints for leaderboard and standings
- OAuth-ready, supports Discord-based auth

### 🤖 Discord Bot (TS + discord.js)

- Slash commands: `/roster`, `/submitstats`, `/flag`, `/broadcast`
- OCR screenshot submission via `/submitstats`
- Weekly MVP alerts, top scorers, reminders
- Deployed as Render Background Worker from `discord-bot/`
- Uses heartbeat ping to Healthchecks.io

### 🧠 OCR Engine (Python, PaddleOCR)

- OCR parser for 2K box scores (JPG/PNG)
- Uses PaddleOCR with PIL and fallback to Tesseract
- Exposed via `/api/ocr` FastAPI route
- Supports positional parsing, stat cleanup, and stat validation

---

## 📁 Folder Structure

```text
bodega-esports-platform/
├── .github/              # CI workflows
├── Docs/                 # Project documentation
├── OCR/                  # PaddleOCR parsing scripts
├── backend/              # FastAPI backend
│   └── app/
│       ├── api/
│       ├── db/
│       ├── models/
│       └── main.py
├── deploy/               # Deployment notes
├── discord-bot/          # Discord slash command bot
│   ├── commands/
│   ├── scripts/
│   ├── utils/
│   ├── main.ts
│   └── .env.example
├── frontend/             # Next.js frontend
│   ├── components/
│   ├── pages/
│   ├── public/
│   ├── styles/
│   └── tailwind.config.js
├── public/               # Shared static assets
├── sprint1-testing/      # Legacy testing folder
├── supabase/             # DB config, migrations, types
├── .env.example
├── CHANGELOG.md
└── README.md
```

---

## 🧪 Local Setup

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Discord Bot

```bash
cd discord-bot
npm install
npm run dev
```

Add a `.env` based on `.env.example` with:

- `DISCORD_TOKEN`
- `CLIENT_ID`
- `GUILD_ID`
- `API_URL`
- `HEALTHCHECKS_PING_URL`

---

## 🚀 Deployment Notes

- All services (frontend, backend, bot) are deployed via **Render**
- Render auto-builds from the appropriate subfolders:
  - `frontend/` → Web Service
  - `backend/` → Web Service
  - `discord-bot/` → Background Worker
- Uptime badge powered by Healthchecks.io (heartbeat ping)
- CI via GitHub Actions (`check-builds.yml`)

---

## 📄 License

GPLv3 — open-source and modifiable with attribution.

---

## 👤 Author & Community

**Bodega Cats Gaming Club**  
🌐 [bodegacatsgc.gg](https://bodegacatsgc.gg)  
💬 [Discord: Bodega Cats Gaming Club](https://discord.gg/bodegacatsgc)
