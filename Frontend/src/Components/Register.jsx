// src/Pages/Register.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");
    setSuccessMsg("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/register`,
        {
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
        },
        { timeout: 10000 }
      );

      setSuccessMsg(res?.data?.message || "User registered successfully");

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Register error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-emerald-50 flex items-center justify-center px-4 py-8">
      <div className="relative max-w-md w-full">
        {/* Glow background blob */}
        <div className="pointer-events-none absolute -inset-4 bg-gradient-to-tr from-emerald-200/70 via-rose-300/50 to-amber-200/60 blur-3xl opacity-60" />

        {/* Glass card */}
        <div className="relative rounded-3xl bg-white/80 backdrop-blur-2xl shadow-2xl border border-white/70 px-6 py-8 sm:px-8 sm:py-9">
          {/* Logo / title */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-400 to-amber-400 text-2xl shadow-lg">
              ✨
            </div>
            <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Join the community
            </p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Create your account
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Save your favourite recipes and share your own.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Name
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
                  👤
                </span>
                <input
                  type="text"
                  placeholder="Your full name"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-300 shadow-inner"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

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
                  placeholder="Create a password"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-300 shadow-inner"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Confirm password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
                  ✅
                </span>
                <input
                  type="password"
                  placeholder="Repeat your password"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-300 shadow-inner"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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

            {/* Button */}
            <button
              type="button"
              disabled={loading}
              onClick={handleRegister}
              className="w-full inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 via-rose-400 to-amber-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200/60 hover:brightness-105 disabled:opacity-60 disabled:cursor-not-allowed transition-all mt-1"
            >
              {loading ? "Registering..." : "Create account"}
            </button>

            {/* Footer */}
            <div className="pt-3 text-xs text-center text-slate-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={goToLogin}
                className="font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
