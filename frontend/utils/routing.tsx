// Routing utilities for the Bodega Esports Platform
import React from "react";
import { Login as LoginPage } from '../pages/auth/login';
import Dashboard from '../pages/admin/admin';
import LeagueBrowser from '../pages/leagues/league-browser';
import Matches from '../pages/matches/matches';
import PlayerProfile from '../pages/profile/player-profile';
import Teams from '../pages/teams';
import AdminCreateLeague from '../pages/admin/admin-create-league.jsx';
import AdminAddTeam from '../pages/admin/admin-add-team.jsx';
import ScheduleMatch from '../pages/admin/admin-schedule-match.jsx';
import ReviewStats from '../pages/admin/admin-review-stats.jsx';
import RosterLock from '../pages/admin/admin-roster-lock.jsx';



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



