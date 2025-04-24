# Next Steps

## April 23, 2025 - Completed Items

### General Achievements

- ✅ SQLAlchemy + Supabase PostgreSQL integration
- ✅ Admin-protected FastAPI endpoints
- ✅ Stat deduplication
- ✅ Google Sheets exports with secure service account usage

## April 23, 2025 - TODO Items

### Auto-Sync to Google Sheets

- [ ] Implement a `/export/all` endpoint to trigger exports.
- [ ] Integrate a scheduling mechanism (e.g., cron jobs) to automate weekly exports.
- [ ] Ensure exported data is organized by season and week for clarity.

### Player Profile Stats Endpoint

- [ ] Develop a `/me/statline` endpoint to return personal performance metrics.
- [ ] Include filters for season and team to allow detailed views.
- [ ] Ensure proper authentication to protect user data.

### Full Table Exports for Archiving

- [ ] Create endpoints like `/export/player-stats` and `/export/submissions`.
- [ ] Format exports with clear naming conventions, e.g., `Stats_S4`, `Submissions_W3`.
- [ ] Store backups in a secure and accessible location.

### Frontend Integration for Live Leaderboards

- [ ] Replace static data in `Leaderboard.jsx` and `Standings.jsx` with dynamic content fetched from the backend.
- [ ] Implement season selectors to allow users to view different timeframes.
- [ ] Ensure responsive design for optimal viewing on various devices.

### Discord Integration for Updates

- [ ] Set up Discord webhooks to post weekly summaries, MVPs, and standings.
- [ ] Format messages with embeds for better readability and engagement.
- [ ] Provide admin controls to manage the frequency and content of posts.

### Backup & Monitoring

- [ ] Implement a `/health` endpoint to monitor the status of database and external integrations.
- [ ] Schedule regular backups of critical data to prevent loss.
- [ ] Set up alerts for any failures or anomalies in the system.

### Optional Enhancements

- [ ] Develop a CLI tool for local stat synchronization.
- [ ] Write unit tests for key functionalities like `get_standings` and `get_leaderboard`.
- [ ] Organize FastAPI routes with tags for better documentation and maintenance.

---

## April 24, 2025 - TODO Items

### General Tasks

- [ ] Review and finalize the `MANUAL.md` file for completeness and accuracy.
- [ ] Ensure all team members are familiar with the updated manual.

### Frontend Tasks

- [ ] Test all pages in the `src/pages/` directory for responsiveness and cross-browser compatibility.
- [ ] Optimize the `Leaderboard.jsx` and `Leaderboardsup.jsx` components for performance.
- [ ] Add unit tests for critical components in `src/components/`.

### Backend Tasks

- [ ] Review and refactor the `app/api` endpoints for consistency and error handling.
- [ ] Add logging to critical operations in `app/utils`.
- [ ] Ensure the `test_db.py` script covers all database edge cases.

### Supabase Tasks

- [ ] Verify all Supabase functions in `supabase/functions/` are working as expected.
- [ ] Document the `send-discord` function in the `MANUAL.md`.

### OCR Automation Tasks

- [ ] Test the OCR pipeline with a variety of input files in `toProcess/images/`.
- [ ] Update the `Automate 2k TEMPLATE.xlsx` to include new data fields.

### Deployment Tasks

- [ ] Configure CI/CD pipelines for both frontend and backend.
- [ ] Test the Dockerized backend on a staging environment.
- [ ] Verify Vercel deployment settings for the frontend.

### Miscellaneous Tasks

- [ ] Conduct a team review of the `Phase 2 Plan.md` and `Phase 3 Plan.md` documents.
- [ ] Archive outdated files in the workspace to reduce clutter.

---

This list will be updated as tasks are completed or new items are identified.
