/**
 * User Store - Zustand
 * Global state management for user profile and pending requests
 */

import { create } from 'zustand';
import { getUserProfile } from '@/api/register-user-api';
import { getPendingApprovalCount } from '@/api/referrer-user-api';
import { getTokenFromCookies } from '@/api/register-user-api';
import { UserStatus, Wallet, UserHierarchyStats } from '@/types';

// UserProfile interface matching the API response
interface UserProfile {
  id: string;
  clerkId: string;
  uniqueCode: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  status: UserStatus;
  kycStatus: string;
  referralCode: string;
  wallet: Wallet;
  hierarchyStats: UserHierarchyStats;
  createdAt: string;
  updatedAt?: string;
}

interface UserState {
  // User data
  userProfile: UserProfile | null;
  userName: string;
  walletBalance: number;
  pendingRequestsCount: number;
  investmentRequestsCount: number;
  kycRequestsCount: number;
  borrowRequestsCount: number;
  lendRequestsCount: number;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchUserData: () => Promise<void>;
  fetchPendingCount: () => Promise<void>;
  fetchApprovalCounts: () => Promise<void>;
  updateWalletBalance: (balance: number) => void;
  updatePendingCount: (count: number) => void;
  clearUserData: () => void;
  reset: () => void;
}

const initialState = {
  userProfile: null,
  userName: '',
  walletBalance: 0,
  pendingRequestsCount: 0,
  investmentRequestsCount: 0,
  kycRequestsCount: 0,
  borrowRequestsCount: 0,
  lendRequestsCount: 0,
  isLoading: false,
  error: null,
};

export const useUserStore = create<UserState>((set, get) => ({
  ...initialState,

  /**
   * Fetch user profile and wallet data
   */
  fetchUserData: async () => {
    const token = getTokenFromCookies();
    
    if (!token) {
      set({ error: 'No authentication token found', isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await getUserProfile(token);
      
      if (response.success && response.data) {
        const userData = response.data;
        set({
          userProfile: userData,
          userName: `${userData.firstName} ${userData.lastName}`,
          walletBalance: parseFloat(userData.wallet?.availableBalance || '0'),
          isLoading: false,
        });
      } else {
        set({ 
          error: response.message || 'Failed to fetch user profile',
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      set({ 
        error: 'Network error while fetching user data',
        isLoading: false 
      });
    }
  },

  /**
   * Fetch pending approval requests count
   */
  fetchPendingCount: async () => {
    try {
      const response = await getPendingApprovalCount('USER_REGISTRATION');
      
      if (response.success && response.data) {
        set({ pendingRequestsCount: response.data.count });
      }
    } catch (error) {
      console.error('Error fetching pending count:', error);
    }
  },

  /**
   * Fetch all approval type counts
   */
  fetchApprovalCounts: async () => {
    try {
      const [userReg, investment, kyc, borrow, lend] = await Promise.all([
        getPendingApprovalCount('USER_REGISTRATION'),
        getPendingApprovalCount('INVESTMENT'),
        getPendingApprovalCount('KYC_VERIFICATION'),
        getPendingApprovalCount('BORROW_REQUEST'),
        getPendingApprovalCount('LEND_REQUEST'),
      ]);

      set({
        pendingRequestsCount: userReg.success && userReg.data ? userReg.data.count : 0,
        investmentRequestsCount: investment.success && investment.data ? investment.data.count : 0,
        kycRequestsCount: kyc.success && kyc.data ? kyc.data.count : 0,
        borrowRequestsCount: borrow.success && borrow.data ? borrow.data.count : 0,
        lendRequestsCount: lend.success && lend.data ? lend.data.count : 0,
      });
    } catch (error) {
      console.error('Error fetching approval counts:', error);
    }
  },

  /**
   * Update wallet balance manually
   */
  updateWalletBalance: (balance: number) => {
    set({ walletBalance: balance });
  },

  /**
   * Update pending requests count manually
   */
  updatePendingCount: (count: number) => {
    set({ pendingRequestsCount: count });
  },

  /**
   * Clear user data (on logout)
   */
  clearUserData: () => {
    set(initialState);
  },

  /**
   * Reset store to initial state
   */
  reset: () => {
    set(initialState);
  },
}));

/**
 * Selectors for optimized re-renders
 */
export const selectUserName = (state: UserState) => state.userName;
export const selectWalletBalance = (state: UserState) => state.walletBalance;
export const selectPendingCount = (state: UserState) => state.pendingRequestsCount;
export const selectUserProfile = (state: UserState) => state.userProfile;
export const selectIsLoading = (state: UserState) => state.isLoading;
