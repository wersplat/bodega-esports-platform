# Bodega Esports Platform

## Build Status

| Frontend | Backend |
|:--------:|:-------:|
| [![Frontend Build Check](https://github.com/wersplat/bodega-esports-platform/actions/workflows/check-builds.yml/badge.svg?branch=mono)](https://github.com/wersplat/bodega-esports-platform/actions/workflows/check-builds.yml) | [![Backend Build Check](https://github.com/wersplat/bodega-esports-platform/actions/workflows/check-builds.yml/badge.svg?branch=mono)](https://github.com/wersplat/bodega-esports-platform/actions/workflows/check-builds.yml) |

---


[![GPLv3 License](https://img.shields.io/badge/license-GPLv3-blue.svg)](LICENSE)
[![Discord](https://img.shields.io/discord/roadto25k?label=Discord&logo=discord)](https://discord.gg/roadto25k)

A full-stack, modular platform for managing competitive NBA 2K leagues. Features OCR-based stat tracking, player/team management, automated leaderboards, Discord and Google Sheets integration, and robust admin tooling. Built to power the "Road to $25K" league.

---

## 🚀 Features

- 🏀 OCR stat parsing from NBA 2K box score images
- 📊 Leaderboards with division, stat type, and season filters
- 🔁 Google Sheets + CSV export with webhook sync
- 🔐 Supabase-based user authentication and RLS policies
- ⚙️ Admin dashboard for match submission, standings, and team control
- 🧠 MVP and game winner auto-detection
- 🖥️ Modern React frontend (Vite, Tailwind)
- 🐍 FastAPI backend with PostgreSQL (via Supabase)
- 📡 Discord webhook integration
- 🛠️ Virtualenv + systemd deployment (no Docker required)

---

## 🛠️ Tech Stack

- **Frontend:** React, TailwindCSS, Vite
- **Backend:** FastAPI, Python 3.11
- **Database:** Supabase (PostgreSQL)
- **OCR Engine:** PaddleOCR, PIL, fallback to Tesseract
- **DevOps:** GitHub Actions, systemd, Render, Cloudways

---

## 📁 Folder Structure

```text
bodega-esports-platform/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── services/
│   │   └── main.py
│   ├── tests/
├── src/
│   ├── components/
│   ├── pages/
│   └── App.jsx
├── .github/
│   └── workflows/
├── .env.example
├── setup-move-off-docker.sh
├── README.md
└── CHANGELOG.md
```

---

## ⚡ Installation

### Backend Setup (FastAPI)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend Setup (React + Vite)

```bash
cd src
npm install
npm run dev
```

---

### 🐳 Optional: Docker (Legacy)

If you still want to use Docker (deprecated):

```bash
docker-compose up --build
```

> **Note:** Virtualenv + systemd deployments are now recommended.  
> Use `setup-move-off-docker.sh` to migrate off Docker.

---

## 🚀 Deployment Notes

- Runs great on VPS environments (Cloudways, bare metal NAS, etc.)
- See `setup-move-off-docker.sh` for Docker migration.

---

## 📄 License

GPLv3 license – open-source and modifiable with attribution.

---

## 👤 Author & Community

**Bodega Cats Gaming Club**  
🌐 [bodegacatsgc.gg](https://bodegacatsgc.gg)  
💬 [Discord: Road to $25K](https://discord.gg/roadto25k)