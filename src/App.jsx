// src/App.jsx

import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import Navbar                 from './components/Navbar';
import Login                  from './pages/Login';
import Register               from './pages/Register';
import Dashboard              from './pages/Dashboard';
import LeagueBrowser          from './pages/LeagueBrowser';
import RegisterTeam           from './pages/RegisterTeam';
import SubmitPlayerStats      from './pages/SubmitPlayerStats';
import SubmitResult           from './pages/SubmitResult';
import Matches                from './pages/Matches';
import PublicMatches          from './pages/PublicMatches';
import PublicBracket          from './pages/PublicBracket';
import Champion               from './pages/Champion';
import Leaderboard            from './pages/Leaderboard';
import Standings              from './pages/Standings';
import Profile                from './pages/Profile';
import LeagueTeams            from './pages/LeagueTeams';

import Admin                  from './pages/Admin';
import AdminReviewMatches     from './pages/AdminReviewMatches';
import AdminSubmitResult      from './pages/AdminSubmitResult';
import AdminCreateLeague      from './pages/AdminCreateLeague';
import AdminAddTeam           from './pages/AdminAddTeam';
import AdminScheduleMatch     from './pages/AdminScheduleMatch';
import AdminReviewStats  from './pages/AdminReviewStats';
import OwnerSendContract from './pages/OwnerSendContract';
import MyContracts       from './pages/MyContracts';
import Notifications from './pages/Notifications';
import AdminRosterLock from './pages/AdminRosterLock';
import SendAnnouncement from './pages/SendAnnouncement';
import AdminManageWebhooks from './pages/AdminManageWebhooks';

function App() {
  const location = useLocation();

  useEffect(() => {
    const existing = document.getElementById('dynamic-theme');
    if (existing) existing.remove();

    const link = document.createElement('link');
    link.id   = 'dynamic-theme';
    link.rel  = 'stylesheet';
    link.href = location.pathname.startsWith('/alt')
      ? '/styles-alt.css'
      : '/styles.css';

    document.head.appendChild(link);
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <Routes>

        {/* Auth */}
        <Route path="/"         element={<Login />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Player/User */}
        <Route path="/dashboard"           element={<Dashboard />} />
        <Route path="/dashboard/:id"       element={<Dashboard />} />
        <Route path="/leagues"             element={<LeagueBrowser />} />
        <Route path="/leagues/:id"         element={<LeagueBrowser />} />
        <Route path="/register-team"       element={<RegisterTeam />} />
        <Route path="/submit-player-stats" element={<SubmitPlayerStats />} />
        <Route path="/submit-stats"        element={<SubmitPlayerStats />} />
        <Route path="/submit-result"       element={<SubmitResult />} />
        <Route path="/matches"             element={<Matches />} />
        <Route path="/public-matches"      element={<PublicMatches />} />
        <Route path="/public-bracket"      element={<PublicBracket />} />
        <Route path="/champion"            element={<Champion />} />
        <Route path="/leaderboard"         element={<Leaderboard />} />
        <Route path="/standings"           element={<Standings />} />
        <Route path="/profile"             element={<Profile />} />
        <Route path="/league/:id"          element={<LeagueTeams />} />
        <Route path="/contracts/send" element={<OwnerSendContract />} />
        <Route path="/contracts"      element={<MyContracts />} />
        <Route path="/notifications" element={<Notifications />} />

        {/* Admin */}
        <Route path="/admin"                  element={<Admin />} />
        <Route path="/admin-review-matches"   element={<AdminReviewMatches />} />
        <Route path="/admin-submit-result"    element={<AdminSubmitResult />} />
        <Route path="/admin-create-league"    element={<AdminCreateLeague />} />
        <Route path="/admin-add-team"         element={<AdminAddTeam />} />
        <Route path="/admin-schedule-match"   element={<AdminScheduleMatch />} />
        <Route path="/admin-review-stats"     element={<AdminReviewStats />} />
        <Route path="/admin-roster-lock"      element={<AdminRosterLock />} />
        <Route path="/admin-discord-announce" element={<SendAnnouncement />} />
        <Route path="/admin-manage-webhooks" element={<AdminManageWebhooks />} />

      
        {/* Alt Theme */}
        <Route path="/alt"                     element={<Login />} />
        <Route path="/alt/login"               element={<Login />} />
        <Route path="/alt/register"            element={<Register />} />

        <Route path="/alt/dashboard"           element={<Dashboard />} />
        <Route path="/alt/dashboard/:id"       element={<Dashboard />} />
        <Route path="/alt/leagues"             element={<LeagueBrowser />} />
        <Route path="/alt/leagues/:id"         element={<LeagueBrowser />} />
        <Route path="/alt/register-team"       element={<RegisterTeam />} />
        <Route path="/alt/submit-player-stats" element={<SubmitPlayerStats />} />
        <Route path="/alt/submit-stats"        element={<SubmitPlayerStats />} />
        <Route path="/alt/submit-result"       element={<SubmitResult />} />
        <Route path="/alt/matches"             element={<Matches />} />
        <Route path="/alt/public-matches"      element={<PublicMatches />} />
        <Route path="/alt/public-bracket"      element={<PublicBracket />} />
        <Route path="/alt/champion"            element={<Champion />} />
        <Route path="/alt/leaderboard"         element={<Leaderboard />} />
        <Route path="/alt/standings"           element={<Standings />} />
        <Route path="/alt/profile"             element={<Profile />} />
        <Route path="/alt/league/:id"          element={<LeagueTeams />} />
        <Route path="/alt/contracts/send" element={<OwnerSendContract />} />
        <Route path="/alt/contracts"      element={<MyContracts />} />
        <Route path="/alt/notifications" element={<Notifications />} />


        <Route path="/alt/admin"                   element={<Admin />} />
        <Route path="/alt/admin-review-matches"    element={<AdminReviewMatches />} />
        <Route path="/alt/admin-submit-result"     element={<AdminSubmitResult />} />
        <Route path="/alt/admin-create-league"     element={<AdminCreateLeague />} />
        <Route path="/alt/admin-add-team"          element={<AdminAddTeam />} />
        <Route path="/alt/admin-schedule-match"    element={<AdminScheduleMatch />} />
        <Route path="/alt/admin-roster-lock"     element={<AdminRosterLock />} />
        <Route path="/alt/admin-send-announcement" element={<SendAnnouncement />} />
        <Route path="/alt/admin-manage-webhooks"  element={<AdminManageWebhooks />} />

      </Routes>
    </>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
