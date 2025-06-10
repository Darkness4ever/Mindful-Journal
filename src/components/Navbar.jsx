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
    <nav className="bg-white/80 backdrop-blur-sm border-b border-primary-100 py-4 sticky top-0 z-10">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-serif font-semibold text-primary-700 hover:text-primary-800 transition"
        >
          Mindful Journal
        </Link>

        {currentUser ? (
          <div className="flex items-center space-x-6">
            <span className="text-gray-600 text-sm hidden sm:inline-block">
              {currentUser.email}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-primary-50 text-primary-700 px-4 py-2 rounded-lg hover:bg-primary-100 transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v1a1 1 0 102 0V9z"
                  clipRule="evenodd"
                />
              </svg>
              Logout
            </button>
          </div>
        ) : (
          <div className="space-x-4">
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 transition px-4 py-2"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition shadow-sm hover:shadow"
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
