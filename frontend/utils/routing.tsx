// Routing utilities for the Bodega Esports Platform
import React, { Suspense, lazy } from "react";
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

// Lazy-loaded components
const LoginPage = lazy(() => import('../pages/auth/login').then(m => ({ default: m.Login })));
const PrivateRoute = lazy(() => import('../components/ui/PrivateRoute'));
const Dashboard = lazy(() => import('../pages/admin/admin'));
const LeagueBrowser = lazy(() => import('../pages/leagues/league-browser'));
const Matches = lazy(() => import('../pages/matches/matches'));
const PlayerProfile = lazy(() => import('../pages/profile/player-profile'));
const Teams = lazy(() => import('../pages/Teams'));
const AdminCreateLeague = lazy(() => import('../pages/admin/admin-create-league.jsx'));
const AdminAddTeam = lazy(() => import('../pages/admin/admin-add-team.jsx'));
const ScheduleMatch = lazy(() => import('../pages/admin/admin-schedule-match.jsx'));
const ReviewStats = lazy(() => import('../pages/admin/admin-review-stats.jsx'));
const RosterLock = lazy(() => import('../pages/admin/admin-roster-lock.jsx'));

export const createRoutes = (): RouteObject[] =>
  createRoutesFromElements(
    <>
      <Route
        path={routes.root}
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <Dashboard />
          </Suspense>
        }
      />
      <Route
        path={routes.login}
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <LoginPage />
          </Suspense>
        }
      />
      <Route
        path={routes.leagues}
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <LeagueBrowser />
          </Suspense>
        }
      />
      <Route
        path={routes.matches}
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <Matches />
          </Suspense>
        }
      />
      <Route
        path={routes.profile}
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <PlayerProfile />
          </Suspense>
        }
      />
      <Route
        path={routes.teams}
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <Teams />
          </Suspense>
        }
      />
      {/* Admin routes */}
      <Route path={routes.admin.root}>
        <Route
          path={routes.admin.createLeague}
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <AdminCreateLeague />
            </Suspense>
          }
        />
        <Route
          path={routes.admin.addTeam}
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <AdminAddTeam />
            </Suspense>
          }
        />
        <Route
          path={routes.admin.scheduleMatch}
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <ScheduleMatch />
            </Suspense>
          }
        />
        <Route
          path={routes.admin.reviewStats}
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <ReviewStats />
            </Suspense>
          }
        />
        <Route
          path={routes.admin.rosterLock}
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <RosterLock />
            </Suspense>
          }
        />
      </Route>
    </>
  );
