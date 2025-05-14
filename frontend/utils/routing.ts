// DEPRECATED: This file is replaced by routing.tsx. Do not edit.

import { createBrowserRouter } from 'react-router-dom';

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







// The following lazy imports are commented out because the files/directories do not exist:









// The following files do not exist: discord-announce, manage-webhooks, review-board, league-settings





// DEPRECATED: All routing logic has moved to routing.tsx. Do not use this file.
export {};

  return createRoutesFromElements(
    [
      // Public Routes
      {
        path: routes.root,
        element: (
          
            <LoginPage />
          
        )
      },
      // Protected Routes
      {
        path: '*',
        element: (
          
            <PrivateRoute />
          
        ),
        children: [
          {
            path: routes.dashboard,
            element: (
              
                <Dashboard />
              
            )
          },
          {
            path: routes.leagues,
            element: (
              
                <LeagueBrowser />
              
            )
          },
          {
            path: routes.matches,
            element: (
              
                <Matches />
              
            )
          },
          {
            path: routes.profile,
            element: (
              
                <PlayerProfile />
              
            )
          },
          {
            path: routes.teams,
            element: (
              
                <Teams />
              
            )
          },
          // {
//   path: routes.players,
//   element: (
//     
//       <Players />
//     
//   )
// },
// {
//   path: routes.stats,
//   element: (
//     
//       <Stats />
//     
//   )
// },
// {
//   path: routes.settings,
//   element: (
//     
//       <Settings />
//     
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
      
        <AdminCreateLeague />
      
    )
  },
  {
    path: routes.admin.addTeam,
    element: (
      
        <AdminAddTeam />
      
    )
  },
  {
    path: routes.admin.scheduleMatch,
    element: (
      
        <ScheduleMatch />
      
    )
  },
  {
    path: routes.admin.reviewStats,
    element: (
      
        <ReviewStats />
      
    )
  },
  {
    path: routes.admin.rosterLock,
    element: (
      
        <RosterLock />
      
    )
  },
  // The following admin routes are commented out because the files do not exist:
  // {
  //   path: routes.admin.discordAnnounce,
  //   element: (
  //     
  //       <DiscordAnnounce />
  //     
  //   )
  // },
  // {
  //   path: routes.admin.manageWebhooks,
  //   element: (
  //     
  //       <ManageWebhooks />
  //     
  //   )
  // },
  // {
  //   path: routes.admin.reviewBoard,
  //   element: (
  //     
  //       <ReviewBoard />
  //     
  //   )
  // },
  // {
  //   path: routes.admin.leagueSettings,
  //   element: (
  //     
  //       <LeagueSettings />
  //     
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
