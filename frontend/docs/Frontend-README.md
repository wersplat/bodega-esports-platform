# Bodega Esports Platform — Frontend

![Node.js](https://img.shields.io/badge/node-%3E=18.x-green.svg)
![Render](https://img.shields.io/badge/deployed%20on-Render-blueviolet)
![CI](https://github.com/wersplat/bodega-esports-platform/actions/workflows/ci.yml/badge.svg)
![License: GPLv3](https://img.shields.io/badge/license-GPLv3-blue)

## Overview

A React/Next.js dashboard for Bodega Esports Platform. View teams, players, matches, standings, leaderboards, and review OCR errors. Prioritizes function and data clarity for admins and users.

## Tech Stack

- [Next.js](https://nextjs.org/) & [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Recharts](https://recharts.org/) for charts
- [Supabase JS client](https://supabase.com/docs/reference/javascript/installing) (dev only)
- Fetch-based API integration (FastAPI backend)

## Features

- Core pages: Dashboard (`/`), Leaderboard, Standings, Player Profile, Admin Review, OCR Error Review
- Export data to CSV/Google Sheets
- Filters: season, team, division, stat
- Charts for stats over time (Recharts)
- Pagination, interactive embeds

## Folder Structure

```
/frontend/
    pages/           # Route pages (entry: Login.jsx)
    components/      # Reusable UI components
    styles/          # Tailwind/global styles
    lib/             # API clients, utilities
    public/          # Static assets
```
> Entry point: `pages/Login.jsx` (not Vite default).

## Quick Start

```bash
git clone https://github.com/wersplat/bodega-esports-platform.git
cd bodega-esports-platform/frontend
npm install
cp .env.local.example .env.local
npm run dev
```

## Configuration

Set these in `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-api-url
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
# Add other required variables as needed
```

## Deployment on Render

- Root path: `/frontend`
- Build command: `npm run build`
- Start command: `npm run start`
- Health check: `/` (or `/api/health` if available)
- Set environment variables in Render dashboard

## Testing & Linting

- Run tests: `npm test` (if available)
- Lint: `npm run lint`
- Format: `npm run format` (Prettier)

## Usage

- Login via Discord OAuth
- Navigate pages from sidebar/menu
- Use filters to refine data
- Export tables to CSV/Sheets via export button

## Contributing

- Open issues/PRs on [GitHub](https://github.com/wersplat/bodega-esports-platform)
- Follow coding conventions (Prettier, ESLint)
- Branches: `master` = production, `react` = frontend work

## License & Acknowledgments

- [GPLv3](./LICENSE)
- By [Bodega Cats Gaming Club](https://bodegacats.gg)
- UI libraries: [shadcn/ui](https://ui.shadcn.com/), [lucide-react](https://lucide.dev/)
