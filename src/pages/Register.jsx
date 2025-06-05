import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signup, googleSignIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    try {
      await signup(email, password);
      navigate("/");
    } catch {
      setError("Failed to register. Email may already be in use.");
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      await googleSignIn();
      navigate("/");
    } catch {
      setError("Failed to sign up with Google.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Register
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        {/* Email / Password Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 text-white font-medium py-2 rounded-lg hover:bg-primary-700 transition"
          >
            Register
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3 text-gray-500">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center space-x-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-100 transition"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.9 0 7.4 1.4 10.1 4.1l7.5-7.5C36.3 1.7 30.5 0 24 0 14.6 0 6.5 5.1 2.2 12.7l8.7 6.8C12.9 14 18 9.5 24 9.5z"
            />
            <path
              fill="#34A853"
              d="M46.5 24c0-1.7-0.1-3.3-0.4-4.9H24v9.3h12.8c-0.6 3.4-2.5 6.2-5.4 8.1l8.7 6.8C42.8 36.6 46.5 30.9 46.5 24z"
            />
            <path
              fill="#4A90E2"
              d="M9.7 28.4a14.5 14.5 0 010-8.8L1 12.9a23.9 23.9 0 000 22.2l8.7-6.7z"
            />
            <path
              fill="#FBBC05"
              d="M24 46.5c6.5 0 12.3-2.1 16.5-5.8l-8.7-6.8c-2.3 1.5-5.2 2.4-8 2.4-6 0-11.1-4.5-12.9-10.5l-8.7 6.7C6.5 41.4 14.6 46.5 24 46.5z"
            />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
          <span className="text-gray-700 font-medium">
            Continue with Google
          </span>
        </button>

        {/* “Already have an account?” Link */}
        <p className="mt-6 text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-600 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
