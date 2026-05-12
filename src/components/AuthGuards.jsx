import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Proper useAuth hook that reads from our session structure
export const useAuth = () => {
  const sessionStr = localStorage.getItem('user_session');
  let session = null;
  try {
    session = sessionStr ? JSON.parse(sessionStr) : null;
  } catch (e) {
    console.error("Auth session parse error", e);
  }
  
  return {
    user: session?.user || null,
    token: session?.token || null,
    isAuthenticated: !!session?.token,
    role: session?.user?.role || null,
    isLoading: false
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
