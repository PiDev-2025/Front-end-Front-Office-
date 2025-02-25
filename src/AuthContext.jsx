import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Holds user details
  const [token, setToken] = useState(localStorage.getItem('token')); // Holds token

  useEffect(() => {
    if (token) {
      login(token);
    } else {
      logout();
    }
  }, [token]);

  const login = (newToken) => {
    try {
      setToken(newToken); // Set token in state and localStorage
      setUser(jwtDecode(newToken));
      localStorage.setItem('token', newToken);
    } catch (error) {
      console.error(error);
      logout();
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token'); // Remove token from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
