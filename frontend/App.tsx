// frontend/App.tsx

import React, { useEffect } from 'react';
import { RouterProvider, useLocation, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/theme/theme';

// Create and use theme
const AppTheme = theme;

// Components
import Navbar from '@/components/ui/Navbar';

// Pages
import Login from './pages/public/login';
import Register from './pages/public/register';
import Dashboard from './pages/index';
import LeagueBrowser from './pages/leagues/league-browser';
import RegisterTeam from './pages/teams/register-team';
import SubmitPlayerStats from './pages/profile/submit-player-stats';
// If you have a SubmitResult page, update the path accordingly, otherwise comment/remove
// import SubmitResult from './pages/submit-result';
// import Matches from './pages/matches';
// import PublicMatches from './pages/public-matches';
// import PublicBracket from './pages/public-bracket';
// import Champion from './pages/champion';
// import Leaderboard from './pages/leaderboard';
// import Standings from './pages/standings';
import PlayerProfile from './pages/profile/player-profile';
import LeagueTeams from './pages/teams/league-teams';
import OwnerSendContract from './pages/teams/owner-send-contract';
// import MyContracts from './pages/my-contracts';
import Notifications from './pages/notifications/notifications';
import Admin from './pages/admin/admin';
import AdminReviewMatches from './pages/admin/admin-review-matches';
import AdminSubmitResult from './pages/admin/admin-submit-result';
import AdminCreateLeague from './pages/admin/admin-create-league';
import AdminAddTeam from './pages/admin/admin-add-team';
import AdminScheduleMatch from './pages/admin/admin-schedule-match';
import AdminReviewStats from './pages/admin/admin-review-stats';
import AdminRosterLock from './pages/admin/admin-roster-lock';
import SendAnnouncement from './pages/admin/admin-manage-webhooks';
import AdminManageWebhooks from './pages/admin/admin-manage-webhooks';
import AdminReviewBoard from './pages/admin/admin-review-board';
import LeagueSettings from './pages/leagues/league-settings';

function App() {
  const location = useLocation();

  useEffect(() => {
    const existing = document.getElementById('dynamic-theme');
    if (existing) existing.remove();

    const link = document.createElement('link');
    link.id = 'dynamic-theme';
    link.rel = 'stylesheet';
    link.href = '/combined-theme.css';
    document.head.appendChild(link);
  }, [location.pathname]);

  useEffect(() => {
    const themeClass = location.pathname.startsWith('/alt')
      ? 'theme-alt-dark'
      : location.pathname.startsWith('/roadto24k')
      ? 'theme-roadto24k'
      : 'theme-dark';
    document.body.className = themeClass;
  }, [location.pathname]);

  return (
    <>
      {/* Always render Navbar */}
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/:id" element={<Dashboard />} />
          <Route path="/leagues" element={<LeagueBrowser />} />
          <Route path="/leagues/:id" element={<LeagueBrowser />} />
          <Route path="/register-team" element={<RegisterTeam />} />
          <Route path="/submit-player-stats" element={<SubmitPlayerStats />} />
          
          <Route path="/profile" element={<PlayerProfile />} />
          <Route path="/league/:id" element={<LeagueTeams />} />
          <Route path="/contracts/send" element={<OwnerSendContract />} />
          
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin-review-matches" element={<AdminReviewMatches />} />
          <Route path="/admin-submit-result" element={<AdminSubmitResult />} />
          <Route path="/admin-create-league" element={<AdminCreateLeague />} />
          <Route path="/admin-add-team" element={<AdminAddTeam />} />
          <Route path="/admin-schedule-match" element={<AdminScheduleMatch />} />
          <Route path="/admin-review-stats" element={<AdminReviewStats />} />
          <Route path="/admin-roster-lock" element={<AdminRosterLock />} />
          <Route path="/admin-discord-announce" element={<SendAnnouncement />} />
          <Route path="/admin-manage-webhooks" element={<AdminManageWebhooks />} />
          <Route path="/admin-review-board" element={<AdminReviewBoard />} />
          <Route path="/admin-league-settings" element={<LeagueSettings />} />
        </Routes>
      </div>
    </>
  );
}

export default function AppWrapper() {
  return (
    <ThemeProvider theme={AppTheme}>
      <CssBaseline />
      <RouterProvider router={undefined as any}>
        <App />
      </RouterProvider>
    </ThemeProvider>
  );
}
