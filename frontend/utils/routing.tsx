// Routing utilities for the Bodega Esports Platform
// Routing utilities for the Bodega Esports Platform

// Route paths
export const routes = {
  root: "/",
  login: "/auth/login",
  admin: {
    root: "/admin",
    createLeague: "/admin/create-league",
    addTeam: "/admin/add-team",
    scheduleMatch: "/admin/schedule-match",
    reviewStats: "/admin/review-stats",
    rosterLock: "/admin/roster-lock",
    // ... other admin routes
  },
  leagues: "/leagues",
  matches: "/matches",
  profile: "/profile",
  teams: "/teams",
};



