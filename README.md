# 🏆 Bodega Esports Platform

A full-stack esports tournament management platform built with React, Supabase, and Vite.

Manage leagues, teams, players, brackets, and championships — fully self-hosted and tournament-organizer ready.

---

## 🚀 Tech Stack

- **Frontend:** React + Vite
- **Auth & DB:** Supabase
- **Styling:** Vanilla CSS (responsive, mobile-friendly)
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

### 3. Environment Variables

Create a `.env` file based on the provided `.env.example`:

```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

You can find these in your [Supabase Project Settings](https://app.supabase.com/).

### 4. Run Locally

```bash
npm run dev
```

The platform will start on:

```
http://localhost:5173
```

---

## 🔑 Core Features

| Feature | Status |
|---|---|
| Player Registration/Login | ✅ |
| Team Creation & Management | ✅ |
| League Creation & Admin Control | ✅ |
| Randomized Bracket Generation | ✅ |
| Winner Selection and Match Advancement | ✅ |
| Auto-Advance Tournament Rounds | ✅ |
| Public Bracket Viewing | ✅ |
| Champion Detection and Display | ✅ |
| Admin Panel with Inline Controls | ✅ |
| Responsive Mobile-First Design | ✅ |

---

## 📜 Notes

- Requires a live Supabase project (free tier works)
- Assumes `teams`, `players`, `matches`, and `leagues` tables are configured
- Supabase `auth` module is used for secure login/logout/session management
- Match winner and tournament advancement are managed manually through admin actions

---

## 🌐 Deployment

The platform can be deployed easily on:

- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [Render](https://render.com/)
- Your own server (Docker, Nginx, Apache, etc.)

---

## 🧐 Credits

Developed by **Cager** with systems design, testing, and real TO-level optimization 🔥

---

# 🏋️ Road to $25K Ready. Let's GO.

