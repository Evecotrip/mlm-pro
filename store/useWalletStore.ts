/**
 * Wallet Store - Zustand
 * Global state management for wallet data, transactions, and statistics
 */

import { create } from 'zustand';
import { 
  getWallet, 
  getTransactions, 
  getBalanceLogs, 
  getWalletStats,
  WalletData,
  WalletStats,
  TransactionResponse,
  BalanceLogResponse,
  WalletBalance,
  WalletEarnings,
  WalletStatistics,
  WalletRestrictions
} from '@/api/wallet-api';
import { TransactionType } from '@/types';

interface WalletState {
  // Wallet data
  walletData: WalletData | null;
  balance: WalletBalance | null;
  earnings: WalletEarnings | null;
  statistics: WalletStatistics | null;
  restrictions: WalletRestrictions | null;
  
  // Transactions
  transactions: TransactionResponse[];
  transactionsPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  
  // Balance logs
  balanceLogs: BalanceLogResponse[];
  balanceLogsPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  
  // Stats
  stats: WalletStats | null;
  
  // Loading states
  isLoadingWallet: boolean;
  isLoadingTransactions: boolean;
  isLoadingBalanceLogs: boolean;
  isLoadingStats: boolean;
  
  // Error states
  walletError: string | null;
  transactionsError: string | null;
  balanceLogsError: string | null;
  statsError: string | null;
  
  // Actions
  fetchWallet: () => Promise<void>;
  fetchTransactions: (page?: number, limit?: number, type?: TransactionType) => Promise<void>;
  fetchBalanceLogs: (page?: number, limit?: number, operation?: 'CREDIT' | 'DEBIT') => Promise<void>;
  fetchStats: () => Promise<void>;
  refreshAll: () => Promise<void>;
  clearWallet: () => void;
  reset: () => void;
}

const initialState = {
  walletData: null,
  balance: null,
  earnings: null,
  statistics: null,
  restrictions: null,
  transactions: [],
  transactionsPagination: null,
  balanceLogs: [],
  balanceLogsPagination: null,
  stats: null,
  isLoadingWallet: false,
  isLoadingTransactions: false,
  isLoadingBalanceLogs: false,
  isLoadingStats: false,
  walletError: null,
  transactionsError: null,
  balanceLogsError: null,
  statsError: null,
};

export const useWalletStore = create<WalletState>((set, get) => ({
  ...initialState,

  /**
   * Fetch wallet data
   */
  fetchWallet: async () => {
    set({ isLoadingWallet: true, walletError: null });

    try {
      const response = await getWallet();
      
      if (response.success && response.data) {
        const data = response.data;
        set({
          walletData: data,
          balance: data.balance,
          earnings: data.earnings,
          statistics: data.statistics,
          restrictions: data.restrictions,
          isLoadingWallet: false,
        });
      } else {
        set({ 
          walletError: response.message || 'Failed to fetch wallet data',
          isLoadingWallet: false 
        });
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
      set({ 
        walletError: 'Network error while fetching wallet data',
        isLoadingWallet: false 
      });
    }
  },

  /**
   * Fetch transactions with pagination and optional type filter
   */
  fetchTransactions: async (page = 1, limit = 20, type?: TransactionType) => {
    set({ isLoadingTransactions: true, transactionsError: null });

    try {
      const response = await getTransactions(page, limit, type);
      
      if (response.success && response.data) {
        set({
          transactions: response.data.data || [],
          transactionsPagination: response.data.pagination,
          isLoadingTransactions: false,
        });
      } else {
        set({ 
          transactions: [],
          transactionsError: response.message || 'Failed to fetch transactions',
          isLoadingTransactions: false 
        });
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      set({ 
        transactions: [],
        transactionsError: 'Network error while fetching transactions',
        isLoadingTransactions: false 
      });
    }
  },

  /**
   * Fetch balance logs with pagination and optional operation filter
   */
  fetchBalanceLogs: async (page = 1, limit = 20, operation?: 'CREDIT' | 'DEBIT') => {
    set({ isLoadingBalanceLogs: true, balanceLogsError: null });

    try {
      const response = await getBalanceLogs(page, limit, operation);
      
      if (response.success && response.data) {
        // Check if response.data is an array (direct) or has a data property (paginated)
        const logsArray = Array.isArray(response.data) ? response.data : (response.data.data || []);
        const pagination = Array.isArray(response.data) ? undefined : response.data.pagination;
        
        set({
          balanceLogs: logsArray,
          balanceLogsPagination: pagination,
          isLoadingBalanceLogs: false,
        });
      } else {
        set({ 
          balanceLogs: [],
          balanceLogsError: response.message || 'Failed to fetch balance logs',
          isLoadingBalanceLogs: false 
        });
      }
    } catch (error) {
      console.error('Error fetching balance logs:', error);
      set({ 
        balanceLogs: [],
        balanceLogsError: 'Network error while fetching balance logs',
        isLoadingBalanceLogs: false 
      });
    }
  },

  /**
   * Fetch wallet statistics
   */
  fetchStats: async () => {
    set({ isLoadingStats: true, statsError: null });

    try {
      const response = await getWalletStats();
      
      if (response.success && response.data) {
        set({
          stats: response.data,
          isLoadingStats: false,
        });
      } else {
        set({ 
          statsError: response.message || 'Failed to fetch wallet stats',
          isLoadingStats: false 
        });
      }
    } catch (error) {
      console.error('Error fetching wallet stats:', error);
      set({ 
        statsError: 'Network error while fetching wallet stats',
        isLoadingStats: false 
      });
    }
  },

  /**
   * Refresh all wallet data
   */
  refreshAll: async () => {
    const { fetchWallet, fetchTransactions, fetchBalanceLogs, fetchStats } = get();
    await Promise.all([
      fetchWallet(),
      fetchTransactions(),
      fetchBalanceLogs(),
      fetchStats(),
    ]);
  },

  /**
   * Clear wallet data (on logout)
   */
  clearWallet: () => {
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
export const selectBalance = (state: WalletState) => state.balance;
export const selectEarnings = (state: WalletState) => state.earnings;
export const selectStatistics = (state: WalletState) => state.statistics;
export const selectRestrictions = (state: WalletState) => state.restrictions;
export const selectTransactions = (state: WalletState) => state.transactions;
export const selectBalanceLogs = (state: WalletState) => state.balanceLogs;
export const selectStats = (state: WalletState) => state.stats;
export const selectIsLoadingWallet = (state: WalletState) => state.isLoadingWallet;
