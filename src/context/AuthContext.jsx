
import React, { createContext, useContext, useState } from "react";
import { StorageKeys } from "../constants/StorageKeys.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(StorageKeys.CURRENT_USER);
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem(StorageKeys.CURRENT_USER, JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(StorageKeys.CURRENT_USER);
    localStorage.removeItem(StorageKeys.EMPLOYEES);
    localStorage.removeItem(StorageKeys.DEPARMENTS);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
