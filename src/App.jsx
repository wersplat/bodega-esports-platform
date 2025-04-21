import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LeagueBrowser from './pages/LeagueBrowser';
import Admin from './pages/Admin';
import RegisterTeam from './pages/RegisterTeam';
import TeamCreation from './pages/TeamCreation';
import LeagueDetails from './pages/LeagueDetails';
import AdminBracketGenerator from './pages/AdminBracketGenerator';
import Matches from './pages/Matches';
import AdminMarkWinner from './pages/AdminMarkWinner'; // ✅ NEW: Admin Mark Winner page
import AdminAdvanceRound from './pages/AdminAdvanceRound';
import Champion from './pages/Champion';
import PublicBracket from './pages/PublicBracket';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leagues" element={<LeagueBrowser />} />
        <Route path="/league/:id" element={<LeagueDetails />} />
        <Route path="/teams" element={<TeamCreation />} />
        <Route path="/register-team" element={<RegisterTeam />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-bracket-generator" element={<AdminBracketGenerator />} />
        <Route path="/admin-mark-winner" element={<AdminMarkWinner />} /> {/* ✅ NEW route */}
        <Route path="/admin-advance-round" element={<AdminAdvanceRound />} /> {/* ✅ NEW route */}
        <Route path="/champion" element={<Champion />} /> {/* ✅ NEW route */}
        <Route path="/matches" element={<Matches />} />
        <Route path="/public-bracket" element={<PublicBracket />} /> {/* ✅ NEW route */}
      </Routes>
    </Router>
  );
}

export default App;
