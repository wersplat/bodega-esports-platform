# Bodega Esports Platform Manual

## 1. Introduction

**Bodega Esports Platform** is an all-in-one solution for managing esports leagues. It offers:

- **League management**: Organize seasons, divisions, teams, and matches.
- **Stats tracking**: Automated and manual stat entry, leaderboards, and player profiles.
- **OCR bot**: Extracts box scores from images posted in Discord.
- **Dashboard**: Visualizes data, manages rosters, and reviews errors.

**Who is this for?**

- **Admins**: Oversee leagues, manage data, resolve errors.
- **Team Managers**: Submit results, manage rosters.
- **Players**: View stats, profiles, and standings.

---

## 2. Access & Authentication

### Logging In

- Visit [dashboard.bodegacatsgc.gg](https://dashboard.bodegacatsgc.gg).
- Click **Login with Discord**. Authorize the app.

### User Roles

- **Admin**: Full access (edit, override, settings).
- **Viewer**: Read-only (view stats, standings).

**Note:** Permissions are managed via Discord roles.

---

## 3. Dashboard Overview

### Home

- **Widgets**: Recent matches, top performers, quick stats.

### Leaderboards

- **Filters**: By season, division, stat type.
- **Sorting**: Click column headers.
- **MVP Highlights**: Badges for top players.
- **Charts**: Visualize trends.

### Standings

- **Grouping**: By season/division.
- **Metrics**: Win %, point differential.
- **Export**: Download as CSV/Sheets.

### Matches

- **Submission Form**: Enter results, upload screenshots.
- **Status**: Pending, verified, error.
- **Edit History**: Track changes.

### Teams & Players

- **Roster View**: See team members, contracts.
- **Profiles**: Player stats, history, contract status.

### OCR Error Review

- **Correction Tools**: Edit mis-parsed stats, approve changes.

---

## 4. Data Submission & OCR Bot

### Submitting Box Scores

- Post match screenshots in the designated Discord channel.

### What the Bot Does

- Extracts stats using OCR.
- Posts results as Discord embeds.
- Updates Google Sheets/CSV.

### Reviewing OCR Errors

- Dashboard highlights errors.
- Edit and approve corrections.

**Tip:** Use clear, high-res images for best OCR results.

---

## 5. Exports & Integrations

### Exporting Data

- Click **Export** on any table to download CSV or sync to Google Sheets.

### Webhook Notifications

- Get updates in Discord or Sheets.

### Admin Webhook Setup

1. Go to **Settings > Integrations**.
2. Enter webhook URL.
3. Test and save.

---

## 6. Admin Tools

- **Manual Standings Adjustments**: Edit team records.
- **Roster Lock/Unlock**: Control player movement.
- **Match Result Overrides**: Correct errors.
- **League Settings**: Manage seasons, divisions.

---

## 7. Deployment & Health

- **Frontend**: [dashboard.bodegacatsgc.gg](https://dashboard.bodegacatsgc.gg)
- **API**: [api.bodegacatsgc.gg](https://api.bodegacatsgc.gg)
- **Bot**: Runs in Discord.

### Checking Service Health

- **UptimeRobot**: [status page link]
- **Health Endpoints**: `/health` on API.

---

## 8. Troubleshooting

### Common Issues

- **Login Failures**: Check Discord permissions.
- **API Errors**: Refresh, check status page.
- **Bot Timeouts**: Re-invite bot, check Discord status.

### Viewing Logs

- On [Render dashboard](https://dashboard.render.com), select service > **Logs**.

### Support

- Contact: [admin@bodegacatsgc.gg](mailto:admin@bodegacatsgc.gg)

---

## 9. FAQ

- **What if a game is double-booked?**
  - Contact an admin to resolve scheduling conflicts.
- **How do I change my team logo?**
  - Go to **Teams > Edit Team** and upload a new logo.
- **Why aren’t my stats appearing?**
  - Check OCR errors or contact support.

---

## 10. Glossary

- **MVP**: Most Valuable Player
- **RLS**: Rocket League Sideswipe
- **OCR**: Optical Character Recognition
- **Supabase**: Backend database service
- **Render**: Cloud hosting platform
- **React**: Frontend framework
- **FastAPI**: Python API framework

---

**Note:** For screenshots and detailed walkthroughs, see the [Docs folder](./Docs) or contact support.
