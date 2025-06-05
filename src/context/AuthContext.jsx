import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebaseConfig";

// 1. Create the AuthContext
const AuthContext = createContext();

// 2. Custom hook to consume the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // (a) Email/password signup
  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // (b) Email/password login
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // (c) Google Sign-In
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    // Optionally, you can add custom scopes (e.g., provider.addScope('profile'))
    return signInWithPopup(auth, provider);
  };

  // (d) Logout
  const logout = () => {
    return signOut(auth);
  };

  // (e) Listen for auth state changes (on mount)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    googleSignIn,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
