// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateEntry from "./pages/CreateEntry";
import EditEntry from "./pages/EditEntry";
import ViewEntry from "./pages/ViewEntry";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// Context
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        {/* We can include a Navbar on all pages if desired */}
        <Navbar />

        <div className="min-h-screen bg-gray-100">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes (requires auth) */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreateEntry />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <ProtectedRoute>
                  <EditEntry />
                </ProtectedRoute>
              }
            />
            <Route
              path="/entry/:id"
              element={
                <ProtectedRoute>
                  <ViewEntry />
                </ProtectedRoute>
              }
            />

            {/* Catch All → Redirect to Dashboard or Login */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
  // return (
  //   <div className="min-h-screen flex items-center justify-center bg-primary-600">
  //     <h1 className="text-4xl font-bold text-white">
  //       Tailwind is working if you see blue!
  //     </h1>
  //   </div>
  // );
};

export default App;
