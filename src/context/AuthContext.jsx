import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '../services/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessiblePages, setAccessiblePages] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedPages = localStorage.getItem('pages');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      if (storedPages) {
        setAccessiblePages(JSON.parse(storedPages));
      }
    }
  }, []);


const login = async (userData) => {
  // ✅ Save tokens in localStorage
  localStorage.setItem('access_token', userData.access_token);
  localStorage.setItem('refresh_token', userData.refresh_token);

  // ✅ Save user info
  localStorage.setItem('user', JSON.stringify(userData));
  setUser(userData);

  try {
    const res = await axios.get(`/admin/accessible?role_id=${userData.employee.role_id}`);
    setAccessiblePages(res.data);
    localStorage.setItem('pages', JSON.stringify(res.data));
  } catch (error) {
    console.error('Failed to fetch accessible pages', error);
  }
};


  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('pages');
    setUser(null);
    setAccessiblePages([]);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, accessiblePages }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
