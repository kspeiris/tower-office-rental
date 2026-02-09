import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        console.log('🔍 Checking existing auth...', { hasToken: !!token, hasUser: !!storedUser });

        if (token && storedUser) {
          try {
            const response = await api.get('/auth/profile');
            console.log('✅ Profile response:', response.data);

            if (response.data.success) {
              setUser(response.data.user);
              setIsAuthenticated(true);
              console.log('✅ Auth restored');
            } else {
              console.log('❌ Profile check failed');
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            }
          } catch (error) {
            console.error('❌ Profile check error:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password, rememberMe = false) => {
    try {
      console.log('🔐 Attempting login...', { email, rememberMe });
      const response = await api.post('/auth/login', { email, password });

      console.log('📥 Login response:', response.data);

      if (response.data.success && response.data.token) {
        const { token, user } = response.data;

        console.log('✅ Login successful, saving data...');
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        setUser(user);
        setIsAuthenticated(true);

        toast.success('Login successful!');
        return { success: true, user };
      }

      const errorMsg = response.data.error || 'Login failed';
      console.log('❌ Login failed:', errorMsg);
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('Error response:', error.response?.data);
      const errorMsg = error.response?.data?.error || 'Login failed. Please try again.';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);

      if (response.data.success && response.data.token) {
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setUser(user);
        setIsAuthenticated(true);

        return { success: true, user };
      }

      return {
        success: false,
        error: response.data.error || 'Registration failed'
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed. Please try again.'
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);

      toast.success('Logged out successfully');
    }
  };

  const updateProfile = async (updates) => {
    try {
      const response = await api.put('/auth/profile', updates);

      if (response.data.success) {
        const updatedUser = response.data.user;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

        toast.success('Profile updated successfully');
        return { success: true, user: updatedUser };
      }

      const errorMsg = response.data.error || 'Update failed';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } catch (error) {
      console.error('Update profile error:', error);
      const errorMsg = error.response?.data?.error || 'Update failed. Please try again.';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const updatePassword = async (passwordData) => {
    try {
      const response = await api.put('/auth/update-password', passwordData);

      if (response.data.success) {
        toast.success('Password updated successfully');
        return { success: true };
      }

      const errorMsg = response.data.error || 'Password update failed';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } catch (error) {
      console.error('Update password error:', error);
      const errorMsg = error.response?.data?.error || 'Password update failed. Please try again.';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const updatePreferences = async (preferences) => {
    try {
      const response = await api.put('/auth/preferences', { preferences });

      if (response.data.success) {
        const updatedUser = response.data.user;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

        toast.success('Preferences updated successfully');
        return { success: true, user: updatedUser };
      }

      const errorMsg = response.data.error || 'Preferences update failed';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } catch (error) {
      console.error('Update preferences error:', error);
      const errorMsg = error.response?.data?.error || 'Preferences update failed. Please try again.';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
    updatePreferences
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};