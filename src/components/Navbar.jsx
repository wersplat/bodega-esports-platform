import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const isAlt = location.pathname.startsWith('/alt');

  return (
    <nav>
      <Link to={isAlt ? "/alt/dashboard" : "/dashboard"}>Dashboard</Link>
      <Link to={isAlt ? "/alt/leagues" : "/leagues"}>Leagues</Link>
      <Link to={isAlt ? "/alt/matches" : "/matches"}>Matches</Link>
      <Link to={isAlt ? "/alt/public-bracket" : "/public-bracket"}>Bracket</Link>
      <Link to={isAlt ? "/alt/champion" : "/champion"}>Champion</Link>
      <Link to={isAlt ? "/alt/admin" : "/admin"}>Admin</Link>
      <Link to={isAlt ? "/alt" : "/"}>Logout</Link>
    </nav>
  );
}

export default Navbar;
