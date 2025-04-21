import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/">Login</Link>
      <Link to="/register">Register</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/leagues">Leagues</Link>
      <Link to="/admin">Admin</Link>
    </nav>
  );
}

export default Navbar;
