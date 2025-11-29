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

  const rawEnv = import.meta.env.VITE_API_URL;
  const API_BASE = rawEnv.replace(/\/$/, "") + "/api/auth";

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
        `${API_BASE}/register`,
        {
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
        },
        { timeout: 10000 }
      );

      setSuccessMsg(res?.data?.message || "User registered successfully");

      // Optional: auto-redirect to login after a short while
      // or just ask the user to click login button
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
    <div className="max-w-md mx-auto p-4 border rounded mt-4">
      <h2 className="text-2xl font-bold mb-4">Register</h2>

      <div className="space-y-3">
        <div>
          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 border border-gray-300 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

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

        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-2 border border-gray-300 rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}
        {successMsg && (
          <div className="text-green-600 text-sm">{successMsg}</div>
        )}

        <button
          type="button"
          disabled={loading}
          onClick={handleRegister}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-60"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <div className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <button
            type="button"
            onClick={goToLogin}
            className="text-blue-600 underline"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
