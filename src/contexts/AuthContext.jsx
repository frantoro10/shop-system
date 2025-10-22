import React, { createContext, useState, useEffect } from 'react';
import { login as loginService, logout as logoutService, onAuthChange } from '../services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login user with email and password
  const login = async (email, password) => {
    try {
      const user = await loginService(email, password);
      setUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Logout current user
  const logout = async () => {
    try {
      await logoutService();
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};