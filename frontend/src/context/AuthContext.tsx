import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/auth.service';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  loginAsDemoUser: () => Promise<void>;
  loginAsDemoAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('pv_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('pv_token');
      if (storedToken) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
        } catch (error) {
          console.warn('Stored token expired or invalid:', error);
          localStorage.removeItem('pv_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await authService.login(email, pass);
      const { user: loggedInUser, token: authToken } = res.data;
      localStorage.setItem('pv_token', authToken);
      setToken(authToken);
      setUser(loggedInUser);
      showToast(`Welcome back, ${loggedInUser.name}! 🔥`, 'success');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Login failed. Please verify credentials.';
      showToast(msg, 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await authService.register(data);
      const { user: registeredUser, token: authToken } = res.data;
      localStorage.setItem('pv_token', authToken);
      setToken(authToken);
      setUser(registeredUser);
      showToast(`Welcome to Protein Villa, ${registeredUser.name}! 🏋️`, 'success');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Registration failed.';
      showToast(msg, 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('pv_token');
    setToken(null);
    setUser(null);
    showToast('Logged out successfully.', 'info');
  };

  const refreshUser = async () => {
    try {
      const userData = await authService.getMe();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const loginAsDemoUser = async () => {
    await login('user@proteinvilla.demo', 'User@12345');
  };

  const loginAsDemoAdmin = async () => {
    await login('owner@proteinvilla.demo', 'Owner@12345');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        loginAsDemoUser,
        loginAsDemoAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
