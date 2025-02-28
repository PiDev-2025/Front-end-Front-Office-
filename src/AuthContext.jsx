import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem("token");
    return savedToken ? jwtDecode(savedToken) : null;
  });

  useEffect(() => {
    if (token) {
      try {
        setUser(jwtDecode(token)); // ✅ Just set user, no need to call login
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
  }, [token]);

  const login = (newToken) => {
    if (newToken === token) return; // ✅ Prevent infinite re-renders

    try {
      setToken(newToken);
      setUser(jwtDecode(newToken));
      localStorage.setItem("token", newToken);
    } catch (error) {
      console.error(error);
      logout();
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
