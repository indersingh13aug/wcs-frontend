// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  const role = user?.employee?.role_id;

  if (!user) {
    // Not logged in — redirect to login
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user?.employee?.role_id)) {
    // Logged in but not authorized
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ User is authenticated (and authorized if roles given)
  return children;
};

export default ProtectedRoute;
