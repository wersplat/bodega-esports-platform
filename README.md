# Bodega Esports Platform  

_05/17/2025_
---

![Node.js](https://img.shields.io/badge/node-18.x-blue?logo=node.js)
![TypeScript](https://img.shields.io/badge/type-checked-blue?logo=typescript)
![Discord.js](https://img.shields.io/npm/v/discord.js?label=discord.js&color=blueviolet)
![License](https://img.shields.io/github/license/wersplat/bodega-esports-platform)
[![Railway Deployment](https://img.shields.io/badge/Deploy-Railway-blue)](https://railway.app/REPLACE_WITH_PROJECT_URL)
![CI](https://github.com/wersplat/bodega-esports-platform/actions/workflows/ci.yml/badge.svg?branch=react)
[![GPLv3 License](https://img.shields.io/badge/license-GPLv3-blue.svg)](LICENSE)
[![Discord](https://img.shields.io/discord/854734760877752330?label=Discord&logo=discord)](https://discord.gg/bodegacatsgc)
[![Sentry Monitoring](https://img.shields.io/badge/Sentry-Monitoring-orange)](https://sentry.io/REPLACE_WITH_PROJECT_URL)
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

Bodega Esports Platform is a full-stack web application designed for gaming tournament management. Its **frontend** is a Next.js-based React application providing a dynamic, component-driven UI. The **backend** is a Node.js/Express server exposing RESTful APIs. A separate **Discord bot** component uses Discord.js to facilitate community interactions (e.g., registering users, reporting scores). In a future update, an OCR (Optical Character Recognition) module (e.g., Tesseract) will be added to parse match screenshots and scoreboards automatically.

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

```plaintext
bodega-esports-platform/
├── frontend/            # Next.js application
│   ├── app/             # Next.js App Router directory
│   ├── public/          # Static assets
│   ├── components/      # Shared React components
│   ├── pages/           # Legacy pages (if any)
│   ├── next.config.js   # Next.js configuration
│   ├── tsconfig.json    # TypeScript config
│   └── package.json     # Frontend dependencies
├── backend/             # Node.js/Express server
│   ├── src/
│   ├── routes/
│   └── package.json
├── discord-bot/         # Discord bot (Node.js, Discord.js)
│   ├── commands/
│   ├── index.js
│   └── package.json
├── ocr/                 # Placeholder for future OCR component
├── package.json         # (Workspace or root metadata)
└── README.md
```

---

## Setup and Installation

**Prerequisites:**
- [Node.js](https://nodejs.org/) v16+ and npm  
- Discord bot credentials (token, client ID)  
- Environment variables managed via `.env` files in each module

### Frontend

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies and start the dev server:
   ```bash
   npm install
   npm run dev
   ```
3. The app will run at `http://localhost:3000` by default. Configure API URL and other settings via `.env.local`, e.g.:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

### Backend

1. Open a new terminal and enter the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy and configure environment variables:
   ```bash
   cp .env.example .env
   # then edit .env to set PORT, DATABASE_URL, etc.
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
5. The API will be available at `http://localhost:5000` (or your configured port).

### Discord Bot

1. In another terminal, go to the `discord-bot` folder:
   ```bash
   cd discord-bot
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment template and configure:
   ```bash
   cp .env.example .env
   # set DISCORD_TOKEN, CLIENT_ID, GUILD_ID, etc.
   ```
4. Deploy slash commands (if applicable):
   ```bash
   npm run deploy
   ```
5. Start the bot:
   ```bash
   npm start
   ```

After these steps, you should have the frontend, backend, and Discord bot running locally. Each component has its own `.env` and scripts to manage development and production builds.

## Usage

- **Frontend:** Browse to `http://localhost:3000`. Use the UI to view tournaments, teams, and scores.  
- **Backend:** Interact with REST endpoints via HTTP clients (e.g., `curl`, Postman) under `/api`, e.g., `GET /api/teams`.  
- **Discord Bot:** Invite the bot using its OAuth2 URL, then use configured slash commands in your Discord server (e.g., `/register`, `/report-score`).

## Future Work

- **OCR Integration (Placeholder):** Add an OCR component (e.g., Tesseract) in `ocr/` to parse text from match screenshots and automate stat entry.  
- **Deployment:** Replace badge placeholders with real Railway and Sentry URLs once deployed, and configure CI/CD pipelines accordingly.

## References

- [Next.js Documentation](https://nextjs.org/docs)  
- [Express.js Guide](https://expressjs.com/)  
- [Discord.js Getting Started](https://discord.js.org/#/)  
- [Tesseract OCR](https://github.com/tesseract-ocr/tesseract)  
---

## 📄 License

GPLv3 — open-source and modifiable with attribution.

---

## 👤 Author & Community

**Bodega Cats Gaming Club**  
🌐 [bodegacatsgc.gg](https://bodegacatsgc.gg)  
💬 [Discord: Bodega Cats Gaming Club](https://discord.gg/bodegacatsgc)
