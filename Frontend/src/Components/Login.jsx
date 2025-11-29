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

  const rawEnv = import.meta.env.VITE_API_URL;
  // const API_BASE = rawEnv.replace(/\/$/, "") + "/api/auth";

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
        `${import.meta.env.VITE_API_URL}/login`,
        { email: email.trim(), password: password.trim() },
        { timeout: 30000 }
      );

      if (res?.data?.token) {
        localStorage.setItem("token", res.data.token);
        setSuccessMsg("Login successful.");
        if (typeof onAuthChange === "function") {
          onAuthChange(true);
        }
        // Go to main app page
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
    <div className="max-w-md mx-auto p-4 border rounded mt-4">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <div className="space-y-3">
        <div>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}
        {successMsg && (
          <div className="text-green-600 text-sm">{successMsg}</div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={handleLogin}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Logout
          </button>
        </div>

        <div className="mt-2 text-xs text-gray-600 break-all">
          <strong>Current token:</strong>{" "}
          {currentToken || "No token stored in localStorage"}
        </div>

        <div className="mt-4 text-sm text-center">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-blue-600 underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
