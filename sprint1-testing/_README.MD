# 📂 Sprint 1 Testing Folder - README

---

## 📋 Purpose

This folder contains **all artifacts for Sprint 1 API Testing** for the Bodega Esports Platform backend (`https://api.bodegacatsgc.com`).

Designed for use with:
- ✅ API Client Lite (for direct `.http` testing)
- ✅ Obsidian.md (for test tracking and notes)
- ✅ VSCode (for development and fast access)

---

## 🗂 Folder Contents

| File | Purpose |
|:---|:---|
| `sprint1-api-test.http` | API test collection (Signup → Login → Profile → Teams) |
| `sprint1-validation-checklist.md` | Testing checklist (with checkboxes `[ ]`) |
| `sprint1-testing-notes.md` | Notes about any API bugs, oddities, improvements |
| `sprint1-errors.log` | (Optional) Copy-paste raw API errors during testing |

---

## 🧪 How to Use

1. Open `sprint1-api-test.http` in VSCode.
2. Run each section (`###`) in API Client Lite:
   - Signup → Login → Profile → Create Team → Invite Player
3. Track testing progress in `sprint1-validation-checklist.md`:
   - Mark each `[ ]` checkbox as `[x]` when done.
4. Jot down bugs, failures, or observations inside `sprint1-testing-notes.md`.
5. Save raw JSON error responses (optional) inside `sprint1-errors.log` for later debugging.

---

## 🌐 Environment Variables

Use manual substitution inside `.http`:

| Variable | Description |
|:---|:---|
| `{{access_token}}` | Access token from Login response |
| `{{team_id}}` | Team ID created in `/teams/create` |
| `{{player_id_from_player_team_view}}` | Player ID from database view `player_team_view` |

---

## 🛠 Quick Test Flow

1. Signup → Create a new user
2. Login → Get `access_token`
3. Fetch Profile → `/profile/me`
4. Update Profile → `/profile/update`
5. Create Team → `/teams/create`
6. Fetch Team → `/teams/{team_id}`
7. Update Team → `/teams/{team_id}/update`
8. Invite Player → `/teams/{team_id}/invite`
9. List Team Members → `/teams/{team_id}/members`

---

## 📈 Testing Goals for Sprint 1

- Ensure full **Auth ➔ Profile ➔ Team Creation ➔ Player Invite** flow works.
- Confirm data consistency by cross-referencing `player_team_view` in Supabase DB.
- Validate correct HTTP status codes and error handling.
- Prepare clean foundation for Sprint 2 Testing (Matches, Stats, Standings).

---

## 📚 Notes

- This folder is **self-contained** for Sprint 1 only.
- Future Sprints (2, 3, etc.) should create new folders `/sprint2-testing/`, `/sprint3-testing/`, etc.
- Keep test notes and artifacts organized for fast QA cycles later.

---

# ✅ Sprint 1 Testing Folder Setup Complete

Good luck & happy testing! 🚀

---
