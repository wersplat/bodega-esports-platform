# 🏆 Bodega Esports Platform

A full-stack esports tournament management platform built with React, Supabase, and Vite.

Manage leagues, teams, players, brackets, and championships — fully self-hosted and tournament-organizer ready.

---

## 🚀 Tech Stack

- **Frontend:** React + Vite
- **Auth & Database:** Supabase
- **Styling:** Vanilla CSS (responsive, mobile-first)
- **State Management:** Lightweight React hooks
- **Backend:** Python (FastAPI)

---

## 📂 Project Structure

```
/public
  - index.html
  - img/
    - rt25k-bg.png
  - vite.svg

/src
  /components
    - Navbar.jsx
    - NotificationsBell.jsx
    - PrivateRoute.jsx
  /pages
    - Dashboard.jsx
    - Admin.jsx
    - PublicBracket.jsx
    - Champion.jsx
    - Matches.jsx
    - Login.jsx
    - Register.jsx
    - AdminCreateLeague.jsx
    - AdminAddTeam.jsx
    - LeagueBrowser.jsx
    - Standings.jsx
    - PlayerProfile.jsx
  - App.jsx
  - main.jsx
  - index.css
  - supabaseClient.js
  - theme.css

/backend
  /app
    - main.py
    - database.py
    /models
      - models.py
    /routers
      - players.py
      - teams.py
      - matches.py
      - standings.py
    /schemas
      - player.py
      - team.py
      - match.py
    /utils
      - auth.py
      - hash.py
      - sheets.py
  - requirements.txt
  - render.yaml

/supabase
  /functions
    /send-discord
      - index.ts
      - deno.json
  - config.toml

package.json
vite.config.js
vercel.json
README.md
```

---

## 🛠️ Setup Instructions

### 1. Clone the Project

```bash
git clone https://github.com/YOUR_USERNAME/bodega-esports-platform.git
cd bodega-esports-platform
```

### 2. Install Dependencies

```bash
npm install
```

For the backend:

```bash
pip install -r backend/requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file based on the provided `.env.example`:

```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Your Supabase project URL and anon key can be found under [Supabase Project Settings](https://app.supabase.com/).

### 4. Run Locally

Frontend:

```bash
npm run dev
```

Backend:

```bash
python backend/app/main.py
```

Default server:

```bash
Frontend: http://localhost:5173
Backend: http://localhost:8000
```

---

## 🔑 Core Features

| Feature | Status |
|---|---|
| Player Registration & Login | ✅ |
| Team Creation & Management | ✅ |
| League Creation & Admin Panel | ✅ |
| Team Registration into Leagues | ✅ |
| Randomized Bracket Generator | ✅ |
| Match Winner Selection & Advancement | ✅ |
| Auto-Advance Tournament Rounds | ✅ |
| Public Bracket Viewer | ✅ |
| Champion Detection | ✅ |
| Dynamic Theme Switching (`/` and `/alt`) | ✅ |
| Admin Dynamic Button Routing | ✅ |
| Full Mobile-First Responsive UI | ✅ |
| Notifications System | ✅ |
| Player Profiles | ✅ |
| Stats Tracking System | 🚧 In Progress |
| Public Pages Expansion | 🚧 In Progress |

---

## 🛠 Planned Features

| Feature | Description |
|---|---|
| Tournament Bracket System | Dynamic bracket generation, live updates, and match scheduling |
| Advanced Analytics | Player and team performance insights, heatmaps, and trends |
| Anti-Cheat System | Integration with third-party anti-cheat tools |
| Multi-Language Support | Localization for global audiences |
| Marketplace | In-app purchases for team branding, player perks, and more |
| Mobile App | Companion app for match updates, notifications, and stats |
| Google Sheets Auto-Sync | Automate export of stats and standings to Google Sheets |
| Player Profile Stats Endpoint | Provide players access to individual statistics |
| Full Table Exports | Enable comprehensive backups of player stats and match submissions |

---

## 📜 Notes

- Requires an active [Supabase](https://supabase.com/) project (free tier works)
- Database tables needed: `teams`, `players`, `matches`, `leagues`, `registrations`, `profiles`
- Supabase `auth` module handles user login/session management securely
- Manual winner selection and tournament advancement are controlled via Admin dashboard
- Supports clean deployment on free platforms or self-hosting

---

## 🌐 Deployment

Ready for easy deployment to:

- [Vercel](https://vercel.com/) (via `vercel.json`)
- [Netlify](https://www.netlify.com/)
- [Render](https://render.com/) (via `render.yaml`)
- Any custom server (Docker, Nginx, Apache)

---

## 🧐 Credits

Developed by **Cager**  
With systems design, live QA testing, and real TO-level optimization 🔥

---

## 🏋️‍♂️ Road to $25K Ready

Let's GO!
