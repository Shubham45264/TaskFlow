import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import { User } from '../types';

const API_BASE_URL = 'http://localhost:5001/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: { name: string }) => Promise<{ error: string | null }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('taskflow_token');
      const savedUser = localStorage.getItem('taskflow_user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Optionally verify token with backend
          await axios.get(`${API_BASE_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (error) {
          localStorage.removeItem('taskflow_token');
          localStorage.removeItem('taskflow_user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/users/login`, { email, password });

      const userData = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role
      };

      setUser(userData);
      localStorage.setItem('taskflow_token', data.token);
      localStorage.setItem('taskflow_user', JSON.stringify(userData));

      return { error: null };
    } catch (error: any) {
      return { error: error.response?.data?.message || 'Authentication failed' };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/users/register`, { name, email, password });

      const userData = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role
      };

      setUser(userData);
      localStorage.setItem('taskflow_token', data.token);
      localStorage.setItem('taskflow_user', JSON.stringify(userData));

      return { error: null };
    } catch (error: any) {
      return { error: error.response?.data?.message || 'Registration failed' };
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
  };

  const updateProfile = async (updates: { name: string }) => {
    if (!user) return { error: 'No user authenticated' };
    const token = localStorage.getItem('taskflow_token');

    try {
      const { data } = await axios.put(`${API_BASE_URL}/users/profile`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedUser = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role
      };

      setUser(updatedUser);
      localStorage.setItem('taskflow_user', JSON.stringify(updatedUser));
      return { error: null };
    } catch (error: any) {
      return { error: error.response?.data?.message || 'Failed to update profile' };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) return { error: 'No user authenticated' };
    const token = localStorage.getItem('taskflow_token');

    try {
      await axios.put(`${API_BASE_URL}/users/profile/password`, { currentPassword, newPassword }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { error: null };
    } catch (error: any) {
      return { error: error.response?.data?.message || 'Failed to update password' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
