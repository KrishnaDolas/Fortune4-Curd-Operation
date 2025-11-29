// src/Components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ onAuthChange }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token
    localStorage.removeItem("token");

    // Update App auth state
    onAuthChange(false);

    // Redirect to login page
    navigate("/login", { replace: true });
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Recipe App</h1>

      <div className="space-x-4 flex items-center">
        <Link to="/home" className="hover:underline">
          Home
        </Link>
        <Link to="/add-recipe" className="hover:underline">
          Add Recipe
        </Link>

        <button
          onClick={handleLogout}
          className="ml-4 px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-sm"
          type="button"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
