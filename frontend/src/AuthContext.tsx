import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { LoginResponse } from './types';

interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role?: 'USER' | 'ADMIN';
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (data: LoginResponse) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('jwt_token');
    const savedUser = localStorage.getItem('auth_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (data: LoginResponse) => {
    const authUser: AuthUser = {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: data.role,
    };
    setUser(authUser);
    setToken(data.token);
    localStorage.setItem('jwt_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(authUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
