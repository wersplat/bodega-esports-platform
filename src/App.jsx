import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login'; // ✅
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LeagueBrowser from './pages/LeagueBrowser';
import Admin from './pages/Admin';
import PublicBracket from './pages/PublicBracket';
import Matches from './pages/Matches';
import Champion from './pages/Champion';
import AdminCreateLeague from './pages/AdminCreateLeague';
import AdminAddTeam from './pages/AdminAddTeam';
import AdminScheduleMatch from './pages/AdminScheduleMatch';
import AdminSubmitResult from './pages/AdminSubmitResult'; // ✅
import SubmitResult from './pages/SubmitResult'; // ✅
import Profile from './pages/Profile';
import LeagueTeams from './pages/LeagueTeams';
import PublicMatches from './pages/PublicMatches';
import AdminReviewMatches from './pages/AdminReviewMatches';
import Leaderboard from './pages/Leaderboard';
import Standings from './pages/Standings';

function App() {
  const location = useLocation();

  useEffect(() => {
    const existingLink = document.getElementById('dynamic-theme');
    if (existingLink) existingLink.remove();

    const link = document.createElement('link');
    link.id = 'dynamic-theme';
    link.rel = 'stylesheet';
    link.href = location.pathname.startsWith('/alt') ? '/styles-alt.css' : '/styles.css';
    document.head.appendChild(link);
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leagues" element={<LeagueBrowser />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/public-bracket" element={<PublicBracket />} />
        <Route path="/champion" element={<Champion />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-create-league" element={<AdminCreateLeague />} />
        <Route path="/admin-add-team" element={<AdminAddTeam />} />
        <Route path="/admin-schedule-match" element={<AdminScheduleMatch />} />
        <Route path="/admin-submit-result" element={<AdminSubmitResult />} />
        <Route path="/submit-result" element={<SubmitResult />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/league/:id" element={<LeagueTeams />} />
        <Route path="/public-matches" element={<PublicMatches />} />
        <Route path="/admin-review-matches" element={<AdminReviewMatches />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/standings" element={<Standings />} />
      


        {/* ALT Theme Routes */}
        <Route path="/alt" element={<Login />} />
        <Route path="/alt/login" element={<Login />} />
        <Route path="/alt/register" element={<Register />} />
        <Route path="/alt/dashboard" element={<Dashboard />} />
        <Route path="/alt/leagues" element={<LeagueBrowser />} />
        <Route path="/alt/matches" element={<Matches />} />
        <Route path="/alt/public-bracket" element={<PublicBracket />} />
        <Route path="/alt/champion" element={<Champion />} />
        <Route path="/alt/admin" element={<Admin />} />
        <Route path="/alt/admin-create-league" element={<AdminCreateLeague />} />
        <Route path="/alt/admin-add-team" element={<AdminAddTeam />} />
        <Route path="/alt/admin-schedule-match" element={<AdminScheduleMatch />} />
        <Route path="/alt/admin-submit-result" element={<AdminSubmitResult />} />
        <Route path="/alt/submit-result" element={<SubmitResult />} />
        <Route path="/alt/profile" element={<Profile />} />
        <Route path="/alt/league/:id" element={<LeagueTeams />} />
        <Route path="/alt/public-matches" element={<PublicMatches />} />
        <Route path="/alt/admin-review-matches" element={<AdminReviewMatches />} />
        <Route path="/alt/leaderboard" element={<Leaderboard />} />
        <Route path="/alt/standings" element={<Standings />} />
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
