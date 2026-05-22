import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Safe Local Storage Session Loader
  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const sessionStr = localStorage.getItem('user_session');
        if (sessionStr) {
          const session = JSON.parse(sessionStr);
          if (session?.token && session?.user) {
            setToken(session.token);
            setUser(session.user);
            
            // Sync authorization header on initial load
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${session.token}`;
          }
        }
      } catch (err) {
        console.error("Failed to parse user session securely:", err);
        localStorage.removeItem('user_session'); // Clean corrupted storage
      } finally {
        setIsLoading(false);
      }
    };
    bootstrapAuth();
  }, []);

  const login = (sessionData) => {
    try {
      const dataToSave = {
        user: sessionData.safeUser || sessionData.user,
        token: sessionData.access_token || sessionData.token,
      };
      setUser(dataToSave.user);
      setToken(dataToSave.token);
      localStorage.setItem('user_session', JSON.stringify(dataToSave));
      
      // Update interceptor state dynamically
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${dataToSave.token}`;
    } catch (err) {
      console.error("Failed during session login storage:", err);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user_session');
    
    // Clear Authorization header completely
    delete apiClient.defaults.headers.common['Authorization'];
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      try {
        const sessionStr = localStorage.getItem('user_session');
        if (sessionStr) {
          const session = JSON.parse(sessionStr);
          session.user = updated;
          localStorage.setItem('user_session', JSON.stringify(session));
        }
      } catch (e) {
        console.error("Error saving updated user details:", e);
      }
      return updated;
    });
  };

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        token, 
        isLoading, 
        login, 
        logout, 
        updateUser,
        isAuthenticated: !!token,
        role: user?.role
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
