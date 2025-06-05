// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 py-4 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-semibold text-primary-600 hover:text-primary-700 transition"
        >
          My Journal
        </Link>

        {currentUser ? (
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 text-sm">{currentUser.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-accent-500 text-white px-3 py-1 rounded-lg hover:bg-accent-600 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="space-x-4">
            <Link
              to="/login"
              className="text-gray-600 hover:text-gray-800 transition"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
