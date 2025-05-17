// frontend/App.tsx

import React, { useEffect } from 'react';
import { RouterProvider, useLocation, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/theme/theme';

// Create and use theme
const AppTheme = theme;

// Components
import Navbar from '@/components/Navbar';

// Pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import LeagueBrowser from '@/pages/LeagueBrowser';
import RegisterTeam from '@/pages/RegisterTeam';
import SubmitPlayerStats from '@/pages/SubmitPlayerStats';
import SubmitResult from './pages/SubmitResult';
import Matches from './pages/Matches';
import PublicMatches from './pages/PublicMatches';
import PublicBracket from './pages/PublicBracket';
import Champion from './pages/Champion';
import Leaderboard from './pages/Leaderboard';
import Standings from './pages/Standings';
import PlayerProfile from './pages/PlayerProfile';
import LeagueTeams from './pages/LeagueTeams';
import OwnerSendContract from './pages/OwnerSendContract';
import MyContracts from './pages/MyContracts';
import Notifications from './pages/Notifications';
import Admin from './pages/Admin';
import AdminReviewMatches from './pages/AdminReviewMatches';
import AdminSubmitResult from './pages/AdminSubmitResult';
import AdminCreateLeague from './pages/AdminCreateLeague';
import AdminAddTeam from './pages/AdminAddTeam';
import AdminScheduleMatch from './pages/AdminScheduleMatch';
import AdminReviewStats from './pages/AdminReviewStats';
import AdminRosterLock from './pages/AdminRosterLock';
import SendAnnouncement from './pages/SendAnnouncement';
import AdminManageWebhooks from './pages/AdminManageWebhooks';
import AdminReviewBoard from './pages/AdminReviewBoard';
import LeagueSettings from './pages/LeagueSettings';

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
          <Route path="/submit-result" element={<SubmitResult />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/public-matches" element={<PublicMatches />} />
          <Route path="/public-bracket" element={<PublicBracket />} />
          <Route path="/champion" element={<Champion />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/profile" element={<PlayerProfile />} />
          <Route path="/league/:id" element={<LeagueTeams />} />
          <Route path="/contracts/send" element={<OwnerSendContract />} />
          <Route path="/contracts" element={<MyContracts />} />
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
