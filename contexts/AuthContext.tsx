'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, mockUsers } from '@/lib/mockData';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  signup: (userData: Partial<User>, referralCode: string) => { success: boolean; message: string };
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);

  useEffect(() => {
    // Check for stored user in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    
    // Always sync with latest mockUsers data (force update)
    // This ensures new users from mockData.ts are available
    setUsers(mockUsers);
    localStorage.setItem('users', JSON.stringify(mockUsers));
  }, []);

  const login = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const signup = (userData: Partial<User>, referralCode: string): { success: boolean; message: string } => {
    // Validate referral code
    const referrer = users.find(u => u.referralCode === referralCode);
    if (!referralCode || !referrer) {
      return { success: false, message: 'Invalid referral code' };
    }

    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
      return { success: false, message: 'Email already registered' };
    }

    // Generate unique referral code
    const newReferralCode = `USER${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      dateOfBirth: userData.dateOfBirth || '',
      referralCode: newReferralCode,
      referrerId: referrer.id,
      isApproved: false, // Needs referrer approval
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    return { success: true, message: 'Registration successful! Waiting for referrer approval.' };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        signup,
        logout,
        isAuthenticated: !!currentUser,
      }}
    >
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
