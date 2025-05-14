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
import type { RouteObject } from "react-router-dom";
import { Route, createRoutesFromElements } from "react-router-dom";

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


export const createRoutes = (): RouteObject[] =>
  createRoutesFromElements(
    <>
      <Route
        path={routes.root}
        element={
          
            <Dashboard />
          
        }
      />
      <Route
        path={routes.login}
        element={
          
            <LoginPage />
          
        }
      />
      <Route
        path={routes.leagues}
        element={
          
            <LeagueBrowser />
          
        }
      />
      <Route
        path={routes.matches}
        element={
          
            <Matches />
          
        }
      />
      <Route
        path={routes.profile}
        element={
          
            <PlayerProfile />
          
        }
      />
      <Route
        path={routes.teams}
        element={
          
            <Teams />
          
        }
      />
      {/* Admin routes */}
      <Route path={routes.admin.root}>
        <Route
          path={routes.admin.createLeague}
          element={
            
              <AdminCreateLeague />
            
          }
        />
        <Route
          path={routes.admin.addTeam}
          element={
            
              <AdminAddTeam />
            
          }
        />
        <Route
          path={routes.admin.scheduleMatch}
          element={
            
              <ScheduleMatch />
            
          }
        />
        <Route
          path={routes.admin.reviewStats}
          element={
            
              <ReviewStats />
            
          }
        />
        <Route
          path={routes.admin.rosterLock}
          element={
            
              <RosterLock />
            
          }
        />
      </Route>
    </>
  );
