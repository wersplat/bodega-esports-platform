// DEPRECATED: This file is replaced by routing.tsx. Do not edit.

import { Suspense, lazy } from 'react';
import { createBrowserRouter, createRoutesFromElements, RouteObject } from 'react-router-dom';

// Route paths
export const routes = {
  root: '/',
  dashboard: '/dashboard',
  leagues: '/leagues',
  matches: '/matches',
  profile: '/profile',
  teams: '/teams',
  players: '/players',
  stats: '/stats',
  settings: '/settings',
  admin: {
    root: '/admin',
    createLeague: '/admin/create-league',
    addTeam: '/admin/add-team',
    scheduleMatch: '/admin/schedule-match',
    reviewStats: '/admin/review-stats',
    rosterLock: '/admin/roster-lock',
    discordAnnounce: '/admin/discord-announce',
    manageWebhooks: '/admin/manage-webhooks',
    reviewBoard: '/admin/review-board',
    leagueSettings: '/admin/league-settings',
  },
} as const;

// Route configuration
// Lazy-loaded components
const LoginPage = lazy(() => import('../pages/auth/login').then(m => ({ default: m.Login })));
const PrivateRoute = lazy(() => import('../components/ui/PrivateRoute'));
const Dashboard = lazy(() => import('../pages/admin/admin'));
const LeagueBrowser = lazy(() => import('../pages/leagues/league-browser'));
const Matches = lazy(() => import('../pages/matches/matches'));
const PlayerProfile = lazy(() => import('../pages/profile/player-profile'));
const Teams = lazy(() => import('../pages/Teams'));
// The following lazy imports are commented out because the files/directories do not exist:
// const Players = lazy(() => import('../pages/players/Players'));
// const Stats = lazy(() => import('../pages/stats/Stats'));
// const Settings = lazy(() => import('../pages/settings/Settings'));
// const AdminRoute = lazy(() => import('../components/auth/AdminRoute'));
const AdminCreateLeague = lazy(() => import('../pages/admin/admin-create-league.jsx'));
const AdminAddTeam = lazy(() => import('../pages/admin/admin-add-team.jsx'));
const ScheduleMatch = lazy(() => import('../pages/admin/admin-schedule-match.jsx'));
const ReviewStats = lazy(() => import('../pages/admin/admin-review-stats.jsx'));
const RosterLock = lazy(() => import('../pages/admin/admin-roster-lock.jsx'));
// The following files do not exist: discord-announce, manage-webhooks, review-board, league-settings
// const DiscordAnnounce = lazy(() => import('../pages/admin/discord-announce'));
// const ManageWebhooks = lazy(() => import('../pages/admin/manage-webhooks'));
// const ReviewBoard = lazy(() => import('../pages/admin/review-board'));
// const LeagueSettings = lazy(() => import('../pages/admin/league-settings'));

// DEPRECATED: All routing logic has moved to routing.tsx. Do not use this file.
export {};

  return createRoutesFromElements(
    [
      // Public Routes
      {
        path: routes.root,
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LoginPage />
          </Suspense>
        )
      },
      // Protected Routes
      {
        path: '*',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <PrivateRoute />
          </Suspense>
        ),
        children: [
          {
            path: routes.dashboard,
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <Dashboard />
              </Suspense>
            )
          },
          {
            path: routes.leagues,
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <LeagueBrowser />
              </Suspense>
            )
          },
          {
            path: routes.matches,
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <Matches />
              </Suspense>
            )
          },
          {
            path: routes.profile,
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <PlayerProfile />
              </Suspense>
            )
          },
          {
            path: routes.teams,
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <Teams />
              </Suspense>
            )
          },
          // {
//   path: routes.players,
//   element: (
//     <Suspense fallback={<div>Loading...</div>}>
//       <Players />
//     </Suspense>
//   )
// },
// {
//   path: routes.stats,
//   element: (
//     <Suspense fallback={<div>Loading...</div>}>
//       <Stats />
//     </Suspense>
//   )
// },
// {
//   path: routes.settings,
//   element: (
//     <Suspense fallback={<div>Loading...</div>}>
//       <Settings />
//     </Suspense>
//   )
// },
// Admin Routes
// Since AdminRoute does not exist, we will not wrap admin children in a Suspense/AdminRoute. Instead, just define the children directly.
{
  path: routes.admin.root,
  children: [
              {
    path: routes.admin.createLeague,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <AdminCreateLeague />
      </Suspense>
    )
  },
  {
    path: routes.admin.addTeam,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <AdminAddTeam />
      </Suspense>
    )
  },
  {
    path: routes.admin.scheduleMatch,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ScheduleMatch />
      </Suspense>
    )
  },
  {
    path: routes.admin.reviewStats,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ReviewStats />
      </Suspense>
    )
  },
  {
    path: routes.admin.rosterLock,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <RosterLock />
      </Suspense>
    )
  },
  // The following admin routes are commented out because the files do not exist:
  // {
  //   path: routes.admin.discordAnnounce,
  //   element: (
  //     <Suspense fallback={<div>Loading...</div>}>
  //       <DiscordAnnounce />
  //     </Suspense>
  //   )
  // },
  // {
  //   path: routes.admin.manageWebhooks,
  //   element: (
  //     <Suspense fallback={<div>Loading...</div>}>
  //       <ManageWebhooks />
  //     </Suspense>
  //   )
  // },
  // {
  //   path: routes.admin.reviewBoard,
  //   element: (
  //     <Suspense fallback={<div>Loading...</div>}>
  //       <ReviewBoard />
  //     </Suspense>
  //   )
  // },
  // {
  //   path: routes.admin.leagueSettings,
  //   element: (
  //     <Suspense fallback={<div>Loading...</div>}>
  //       <LeagueSettings />
  //     </Suspense>
  //   )
  // },

            ]
          }
        ]
      }
    ]
  );
};

// Create the router
export const router = createBrowserRouter(createRoutes());
