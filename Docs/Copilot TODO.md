# 📓 Copilot TODO.md for Bodega Esports Platform

This file gives GitHub Copilot (or any AI inside Visual Studio Code) a clear checklist of what features to build next.

---

# 🏋️ Project Name: **Bodega Esports Platform**

# 🏒 Goal:
Build a full esports team management and league platform, supporting user registration, authentication, league browsing, team dashboards, and payment processing.

---

# 🔢 High-Level Tasks

- [ ] Integrate Supabase authentication (email/password login + register)
- [ ] Create protected routes (Dashboard, Admin)
- [ ] Implement Supabase session checking (auto-login persistence)
- [ ] Build Stripe payment button (register team, pay fees)
- [ ] Connect Stripe webhooks (optional, future)
- [ ] Build team creation form (for team owners)
- [ ] Build league registration form (for players/teams)
- [ ] Create admin panel to:
  - [ ] Add leagues
  - [ ] View registered teams/players
  - [ ] Approve or deny league entries
- [ ] Add player dashboard stats view (Wins, Losses, Payments)
- [ ] Add league browser with public standings
- [ ] Create responsive mobile-friendly layouts (TailwindCSS)

---

# 🏛️ Detailed Feature TODOs

## 1. Supabase Authentication
- [ ] Create a Supabase project
- [ ] Connect to Supabase with environment variables
- [ ] Add signUp and signInWithPassword API calls in `Login.jsx` and `Register.jsx`
- [ ] Add logout button in Navbar
- [ ] Protect /dashboard and /admin routes with PrivateRoute component

## 2. Stripe Payments
- [ ] Setup Stripe account (test mode)
- [ ] Install `@stripe/stripe-js`
- [ ] Add simple checkout flow
- [ ] Track payment completion inside user profile (via Supabase row update)

## 3. Team Management
- [ ] Create "My Teams" page under dashboard
- [ ] Allow users to create a team (Team Name, Logo, Captain)
- [ ] Connect team creation form to Supabase database

## 4. League Management
- [ ] Create "Leagues" page
- [ ] List leagues from Supabase table
- [ ] Allow players/teams to register for leagues
- [ ] Admin can approve/deny entries

## 5. Admin Panel
- [ ] View all users
- [ ] View all teams
- [ ] View all league registrations
- [ ] Moderate users/teams/leagues

## 6. Mobile Responsive Polish
- [ ] Use TailwindCSS to ensure:
  - [ ] Navbar collapses to hamburger menu
  - [ ] Forms resize correctly
  - [ ] Dashboard and Browser pages adapt to mobile

---

# 🚀 Future Nice-to-Haves

- [ ] Discord webhook integration (game results posting)
- [ ] Player-to-player messaging system
- [ ] Admin dashboard charts (wins, league size growth)
- [ ] Team logo uploader (store in Supabase Storage)
- [ ] League statistics auto-calculator

---

# 👊 Notes for Copilot/AI:
- Use TailwindCSS where possible for styling.
- Use React Router v6 `Routes` and `Route` system.
- Use Supabase v2 client (`@supabase/supabase-js`).
- Keep all forms minimal at first (expand later).
- Prioritize functionality > visuals.

---

# 🚀 Let's build it!

