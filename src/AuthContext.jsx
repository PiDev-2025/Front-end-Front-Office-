import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Holds user details
  const [token, setToken] = useState(localStorage.getItem('token')); // Holds token

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded); // Set user details from token
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token"); // Remove invalid token
        setToken(null);
      }
    } else {
      setUser(null); // If no token, clear user
    }
  }, [token]);

  const login = (newToken) => {
    setToken(newToken); // Set token in state and localStorage
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setToken(null); // Clear token
    setUser(null); // Clear user
    localStorage.removeItem('token'); // Remove token from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
