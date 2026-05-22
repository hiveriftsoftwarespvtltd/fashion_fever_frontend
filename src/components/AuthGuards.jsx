import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

// Proper useAuth hook that reads from our UserContext
export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, role } = useUser();

  return {
    user,
    token,
    isAuthenticated,
    role,
    isLoading
  };
};

export const RoleGuard = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    console.warn(`Access denied for role: ${role}. Required: ${allowedRoles}`);
    return <Navigate to="/" replace />;
  }

  return children;
};
