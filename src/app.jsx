import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LeagueBrowser from './pages/LeagueBrowser';
import LeagueDetails from './pages/LeagueDetails';
import Admin from './pages/Admin';
import TeamCreation from './pages/TeamCreation';
import RegisterTeam from './pages/RegisterTeam';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/leagues" element={<LeagueBrowser />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute requireAdmin={true}>
                <Admin />
              </PrivateRoute>
            }
          />
          <Route
            path="/teams"
            element={
              <PrivateRoute>
                <TeamCreation />
              </PrivateRoute>
            }
          />
          <Route
            path="/register-team"
            element={
              <PrivateRoute>
                <RegisterTeam />
              </PrivateRoute>
            }
          />
          <Route path="/league/:id" element={<LeagueDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
