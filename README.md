
# 🏆 Bodega Esports Platform

A full-stack esports tournament management platform built with React, Supabase, and Vite.

Manage leagues, teams, players, brackets, and championships — fully self-hosted and tournament-organizer ready.

---

## 🚀 Tech Stack

- **Frontend:** React + Vite
- **Auth & Database:** Supabase
- **Styling:** Vanilla CSS (responsive, mobile-first)
- **State Management:** Lightweight React hooks

---

## 📂 Project Structure

```
/public
  - index.html

/src
  /components
    - Navbar.jsx
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
  - App.jsx
  - main.jsx
  - index.css

package.json
vite.config.js
README.md
.env.example
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

### 3. Configure Environment Variables

Create a `.env` file based on the provided `.env.example`:

```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Your Supabase project URL and anon key can be found under [Supabase Project Settings](https://app.supabase.com/).

### 4. Run Locally

```bash
npm run dev
```

Default server:  
```
http://localhost:5173
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

- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [Render](https://render.com/)
- Any custom server (Docker, Nginx, Apache)

---

## 🧐 Credits

Developed by **Cager**  
With systems design, live QA testing, and real TO-level optimization 🔥

---

# 🏋️‍♂️ Road to $25K Ready.  
# 🏆 Let's GO.
