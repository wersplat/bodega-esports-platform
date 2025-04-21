import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LeagueBrowser from './pages/LeagueBrowser';
import Admin from './pages/Admin';
import PublicBracket from './pages/PublicBracket';
import Matches from './pages/Matches';
import Champion from './pages/Champion';
import AdminCreateLeague from './pages/AdminCreateLeague';
import AdminAddTeam from './pages/AdminAddTeam';

function App() {
  const location = useLocation();

  useEffect(() => {
    const existingLink = document.getElementById('dynamic-theme');

    if (existingLink) {
      existingLink.remove();
    }

    const link = document.createElement('link');
    link.id = 'dynamic-theme';
    link.rel = 'stylesheet';

    if (location.pathname.startsWith('/alt')) {
      link.href = '/styles-alt.css';
    } else {
      link.href = '/styles.css';
    }

    document.head.appendChild(link);
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <Routes>
        {/* Normal Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leagues" element={<LeagueBrowser />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/public-bracket" element={<PublicBracket />} />
        <Route path="/champion" element={<Champion />} />
        <Route path="/admin-create-league" element={<AdminCreateLeague />} />
        <Route path="/admin-add-team" element={<AdminAddTeam />} />

        {/* Alt Routes */}
        <Route path="/alt" element={<Login />} />
        <Route path="/alt/register" element={<Register />} />
        <Route path="/alt/dashboard" element={<Dashboard />} />
        <Route path="/alt/leagues" element={<LeagueBrowser />} />
        <Route path="/alt/admin" element={<Admin />} />
        <Route path="/alt/matches" element={<Matches />} />
        <Route path="/alt/public-bracket" element={<PublicBracket />} />
        <Route path="/alt/champion" element={<Champion />} />
        <Route path="/alt/admin-create-league" element={<AdminCreateLeague />} />
        <Route path="/alt/admin-add-team" element={<AdminAddTeam />} />

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
