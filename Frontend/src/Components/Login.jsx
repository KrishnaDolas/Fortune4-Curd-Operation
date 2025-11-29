// src/Pages/Login.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ onAuthChange }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setSuccessMsg("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { email: email.trim(), password: password.trim() },
        { timeout: 30000 }
      );

      if (res?.data?.token) {
        localStorage.setItem("token", res.data.token);
        setSuccessMsg("Login successful.");
        if (typeof onAuthChange === "function") {
          onAuthChange(true);
        }
        navigate("/home");
      } else {
        setError("Login successful but token not received.");
      }
    } catch (err) {
      console.error("Login error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setSuccessMsg("");
    setError("");
    if (typeof onAuthChange === "function") {
      onAuthChange(false);
    }
    alert("Logged out and token removed.");
  };

  const currentToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-emerald-50 flex items-center justify-center px-4 py-8">
      <div className="relative max-w-md w-full">
        {/* Glow background blob */}
        <div className="pointer-events-none absolute -inset-4 bg-gradient-to-tr from-amber-200/70 via-rose-300/50 to-emerald-200/60 blur-3xl opacity-60" />

        {/* Glass card */}
        <div className="relative rounded-3xl bg-white/80 backdrop-blur-2xl shadow-2xl border border-white/70 px-6 py-8 sm:px-8 sm:py-9">
          {/* Logo / title */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-400 text-2xl shadow-lg">
              🍽️
            </div>
            <p className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Welcome back
            </p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Login to your kitchen
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Access your saved recipes and share new creations.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Email
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
                  ✉️
                </span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-300 shadow-inner"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
                  🔒
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-300 shadow-inner"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-2xl px-3 py-2">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-2xl px-3 py-2">
                {successMsg}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                disabled={loading}
                onClick={handleLogin}
                className="flex-1 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-emerald-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-200/60 hover:brightness-105 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/60 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Logout
              </button>
            </div>

            {/* Token debug (optional) */}
            {/* <div className="mt-2 text-[11px] text-slate-500 break-all">
              <strong>Current token:</strong>{" "}
              {currentToken || "No token stored in localStorage"}
            </div> */}

            {/* Footer */}
            <div className="pt-3 text-xs text-center text-slate-600">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
