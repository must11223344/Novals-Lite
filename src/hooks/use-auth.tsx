
'use client';

import type { User } from '@/lib/types';
import { mockUser } from '@/lib/data';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useToast } from './use-toast';

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('ms-stories-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('ms-stories-user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = () => {
    const today = new Date().toDateString();
    const lastLogin = localStorage.getItem('last_login_date');
    
    // For demo purposes, we'll set the user first.
    localStorage.setItem('ms-stories-user', JSON.stringify(mockUser));
    setUser(mockUser);
    
    if (lastLogin !== today) {
       toast({
          title: 'Daily Bonus!',
          description: 'You earned 5 coins for logging in today.',
        });
       localStorage.setItem('last_login_date', today);
    }
    
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('ms-stories-user');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
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
