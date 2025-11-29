// src/Components/Navbar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ onAuthChange }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (typeof onAuthChange === "function") {
      onAuthChange(false);
    }
    navigate("/login", { replace: true });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-30">
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <div className="flex items-center justify-between rounded-full bg-white/70 backdrop-blur-xl border border-white/80 shadow-lg shadow-amber-100/50 px-4 py-2 sm:px-6 sm:py-3">
          {/* Left: logo / title */}
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-400 text-lg shadow-md">
              🍽️
            </div>
            <div className="text-left">
              <p className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 leading-tight">
                Recipe App
              </p>
              <p className="text-[10px] text-slate-500 leading-tight">
                Cook, share & enjoy
              </p>
            </div>
          </button>

          {/* Right: links + logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/home"
              className={`hidden sm:inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive("/home")
                  ? "bg-emerald-500 text-white shadow"
                  : "bg-white/60 text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Home
            </Link>

            <Link
              to="/add-recipe"
              className={`hidden sm:inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive("/add-recipe")
                  ? "bg-amber-500 text-white shadow"
                  : "bg-white/60 text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Add Recipe
            </Link>

            {/* Mobile nav pills */}
            <div className="flex sm:hidden items-center gap-1 text-[11px]">
              <Link
                to="/home"
                className={`px-2.5 py-1 rounded-full font-medium ${
                  isActive("/home")
                    ? "bg-emerald-500 text-white"
                    : "bg-white/60 text-slate-700 border border-slate-200"
                }`}
              >
                Home
              </Link>
              <Link
                to="/add-recipe"
                className={`px-2.5 py-1 rounded-full font-medium ${
                  isActive("/add-recipe")
                    ? "bg-amber-500 text-white"
                    : "bg-white/60 text-slate-700 border border-slate-200"
                }`}
              >
                Add
              </Link>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              type="button"
              className="inline-flex items-center rounded-full bg-gradient-to-r from-rose-500 to-red-500 px-3 sm:px-4 py-1.5 text-xs font-semibold text-white shadow-md hover:brightness-105 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
