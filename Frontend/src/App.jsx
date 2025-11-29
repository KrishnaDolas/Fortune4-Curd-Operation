// src/App.jsx
import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./Components/Navbar.jsx";
import Home from "./Pages/Home.jsx";
import AddRecipe from "./Pages/AddRecipe.jsx";
import Register from "./Components/Register.jsx";
import Login from "./Components/Login.jsx";

// Simple ProtectedRoute wrapper
function ProtectedRoute({ children }) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!token) {
    // Not logged in → send to login
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // On first load, check if token exists and set auth state
  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setIsAuthenticated(!!token);
  }, []);

  const handleAuthChange = (auth) => {
    setIsAuthenticated(auth);
  };

  return (
    <Router>
      {/* Show Navbar only when user is authenticated and pass handleAuthChange */}
      {isAuthenticated && <Navbar onAuthChange={handleAuthChange} />}

      <div>
        <Routes>
          {/* Default route → if logged in go to /home, else show Register */}
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/home" replace /> : <Register />
            }
          />

          {/* Login route */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/home" replace />
              ) : (
                <Login onAuthChange={handleAuthChange} />
              )
            }
          />

          {/* Register route */}
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/home" replace />
              ) : (
                <Register />
              )
            }
          />

          {/* Protected app routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-recipe"
            element={
              <ProtectedRoute>
                <AddRecipe />
              </ProtectedRoute>
            }
          />

          {/* Fallback: anything unknown → if logged in go to /home, else /login */}
          <Route
            path="*"
            element={
              isAuthenticated ? (
                <Navigate to="/home" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
