import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-900 p-4 text-white flex gap-4">
      <Link to="/">Login</Link>
      <Link to="/register">Register</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/leagues">Browse Leagues</Link>
      <Link to="/admin">Admin</Link>
    </nav>
  );
}

export default Navbar;