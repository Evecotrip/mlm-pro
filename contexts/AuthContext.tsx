'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
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
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();

  // Map Clerk user -> existing mock user (by email) so the rest of the
  // app that still relies on mockData continues to work.
  useEffect(() => {
    if (!isSignedIn || !user) {
      setCurrentUser(null);
      return;
    }

    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) {
      setCurrentUser(null);
      return;
    }

    const matchedUser = mockUsers.find((u) => u.email === email) || null;
    setCurrentUser(matchedUser);
  }, [isSignedIn, user]);

  // Legacy helpers kept only so existing pages compile.
  // Auth is now fully handled by Clerk.
  const login = (): boolean => {
    if (typeof window !== 'undefined') {
      window.location.href = '/sign-in';
    }
    return false;
  };

  const signup = (): { success: boolean; message: string } => {
    if (typeof window !== 'undefined') {
      window.location.href = '/sign-up';
    }
    return {
      success: false,
      message: 'Signup is handled by Clerk. Redirecting to Sign Up…',
    };
  };

  const logout = () => {
    signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        signup,
        logout,
        isAuthenticated: !!currentUser && !!isSignedIn,
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
