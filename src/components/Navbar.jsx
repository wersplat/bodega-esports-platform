import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAlt = location.pathname.startsWith('/alt');
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session?.user ? session : null);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate(isAlt ? '/alt' : '/');
  };

  const linkClass = (path) => 
    `nav-link ${location.pathname === path ? 'active-link' : ''}`;

  return (
    <nav>
      {/* Player Pages */}
      <Link to={isAlt ? "/alt/dashboard" : "/dashboard"} className={linkClass(isAlt ? "/alt/dashboard" : "/dashboard")}>Dashboard</Link>
      <Link to={isAlt ? "/alt/leagues" : "/leagues"} className={linkClass(isAlt ? "/alt/leagues" : "/leagues")}>Leagues</Link>
      <Link to={isAlt ? "/alt/matches" : "/matches"} className={linkClass(isAlt ? "/alt/matches" : "/matches")}>Matches</Link>
      <Link to={isAlt ? "/alt/public-bracket" : "/public-bracket"} className={linkClass(isAlt ? "/alt/public-bracket" : "/public-bracket")}>Bracket</Link>
      <Link to={isAlt ? "/alt/champion" : "/champion"} className={linkClass(isAlt ? "/alt/champion" : "/champion")}>Champion</Link>
      <Link to={isAlt ? "/alt/public-matches" : "/public-matches"} className={linkClass(isAlt ? "/alt/public-matches" : "/public-matches")}>Public Matches</Link>

      {/* Divider */}
      <span className="nav-divider">|</span>

      {/* Admin/Submission Pages */}
      <Link to={isAlt ? "/alt/submit-result" : "/submit-result"} className={linkClass(isAlt ? "/alt/submit-result" : "/submit-result")}>Submit Result</Link>
      <Link to={isAlt ? "/alt/admin" : "/admin"} className={linkClass(isAlt ? "/alt/admin" : "/admin")}>Admin</Link>
      <Link to={isAlt ? "/alt/leaderboard" : "/leaderboard"} className={linkClass(isAlt ? "/alt/leaderboard" : "/leaderboard")}>Leaderboard</Link>
      <Link to={isAlt ? "/alt/standings" : "/standings"} className={linkClass(isAlt ? "/alt/standings" : "/standings")}>Standings</Link>

      {/* Divider */}
      <span className="nav-divider">|</span>

      {/* Auth/Profile */}
      {session ? (
        <>
          <Link to={isAlt ? "/alt/profile" : "/profile"} className={linkClass(isAlt ? "/alt/profile" : "/profile")}>My Profile</Link>
          <button onClick={handleLogout} className="nav-link logout-link">Logout</button>
        </>
      ) : (
        <Link to={isAlt ? "/alt/login" : "/login"} className={linkClass(isAlt ? "/alt/login" : "/login")}>Login</Link>
      )}
    </nav>
  );
}

export default Navbar;
