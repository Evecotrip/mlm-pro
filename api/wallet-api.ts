/**
 * Wallet API
 * Handles wallet balance, transactions, and statistics
 * MLM Investment Platform
 */

import { 
  Transaction, 
  BalanceLog, 
  TransactionType, 
  TransactionStatus,
  ApiResponse 
} from "@/types";
import { getTokenFromCookies } from "./register-user-api";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ============================================
// TYPE DEFINITIONS
// ============================================

/**
 * Wallet balance breakdown
 */
export interface WalletBalance {
  total: string;
  available: string;
  locked: string;
  lockedProfit: string;
  invested: string;
  lent: string;
}

/**
 * Wallet earnings breakdown
 */
export interface WalletEarnings {
  total: string;
  commissions: string;
  returns: string;
  bonus: string;
}

/**
 * Wallet statistics
 */
export interface WalletStatistics {
  totalInvested: string;
  totalWithdrawn: string;
  totalTransferred: string;
  totalBorrowed: string;
  totalLent: string;
}

/**
 * Wallet breakdown
 */
export interface WalletBreakdown {
  inWallet: string;
  inInvestments: string;
  lockedProfit: string;
  lentOut: string;
  total: string;
}

/**
 * Wallet restrictions
 */
export interface WalletRestrictions {
  lastWithdrawalAt: string | null;
  withdrawalUnlockedAt: string | null;
  canWithdraw: boolean;
}

/**
 * Complete wallet data
 */
export interface WalletData {
  id: string;
  userId: string;
  balance: WalletBalance;
  earnings: WalletEarnings;
  statistics: WalletStatistics;
  restrictions: WalletRestrictions;
  breakdown: WalletBreakdown;
  createdAt: string;
  updatedAt: string;
}

/**
 * Wallet stats (summary)
 */
export interface WalletStats {
  balance: WalletBalance;
  earnings: WalletEarnings;
  statistics: {
    totalInvested: string;
    totalWithdrawn: string;
    totalTransferred: string;
    activeInvestments: number;
    totalCommissions: number;
    pendingTransactions: number;
  };
  restrictions: WalletRestrictions;
}

/**
 * Transaction User Info
 */
export interface TransactionUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  uniqueCode: string;
}

/**
 * Transaction with pagination
 */
export interface TransactionResponse {
  id: string;
  senderId: string | null;
  receiverId: string | null;
  type: TransactionType;
  amount: string;
  fee: string;
  netAmount: string;
  referenceId: string | null;
  externalRef: string | null;
  status: TransactionStatus;
  paymentMethod: string | null;
  walletId: string | null;
  investmentId: string | null;
  screenshotUrl: string | null;
  screenshotUploadedAt: string | null;
  screenshotVerifiedAt: string | null;
  metadata: any;
  description: string | null;
  notes: string | null;
  processedAt: string | null;
  completedAt: string | null;
  failedAt: string | null;
  reversedAt: string | null;
  createdAt: string;
  updatedAt: string;
  sender: TransactionUser | null;
  receiver: TransactionUser | null;
  direction: 'SENT' | 'RECEIVED';
}

/**
 * Balance log operation types
 */
export type BalanceLogOperation = 'CREDIT' | 'DEBIT' | 'LOCK' | 'COMMISSION';

/**
 * Balance log with pagination
 */
export interface BalanceLogResponse {
  id: string;
  walletId: string;
  transactionId: string | null;
  previousBalance: string;
  amount: string;
  newBalance: string;
  operation: BalanceLogOperation;
  description: string | null;
  createdAt: string;
  transaction: any | null;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Get wallet data
 * @returns Promise with wallet data
 */
export async function getWallet(): Promise<ApiResponse<WalletData>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found. Please login again.",
      };
    }

    const response = await fetch(`${BASE_URL}/api/v1/wallet`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Failed to fetch wallet data",
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching wallet");
    return {
      success: false,
      message: "Network error while fetching wallet data",
    };
  }
}

/**
 * Transactions API Response (data and pagination at same level)
 */
export interface TransactionsApiResponse {
  success: boolean;
  data?: TransactionResponse[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

/**
 * Get wallet transactions
 * @param page - Page number for pagination (default: 1)
 * @param limit - Number of items per page (default: 20)
 * @param type - Optional transaction type filter
 * @returns Promise with paginated transactions
 */
export async function getTransactions(
  page: number = 1,
  limit: number = 20,
  type?: TransactionType
): Promise<TransactionsApiResponse> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found. Please login again.",
      };
    }

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (type) {
      queryParams.append('type', type);
    }

    const response = await fetch(
      `${BASE_URL}/api/v1/wallet/transactions?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Failed to fetch transactions",
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching transactions");
    return {
      success: false,
      message: "Network error while fetching transactions",
    };
  }
}

/**
 * Balance Logs API Response (data and pagination at same level)
 */
export interface BalanceLogsApiResponse {
  success: boolean;
  data?: BalanceLogResponse[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

/**
 * Get balance logs
 * @param page - Page number for pagination (default: 1)
 * @param limit - Number of items per page (default: 20)
 * @param operation - Optional operation filter (CREDIT/DEBIT/LOCK)
 * @returns Promise with paginated balance logs
 */
export async function getBalanceLogs(
  page: number = 1,
  limit: number = 20,
  operation?: BalanceLogOperation
): Promise<BalanceLogsApiResponse> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found. Please login again.",
      };
    }

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (operation) {
      queryParams.append('operation', operation);
    }

    const response = await fetch(
      `${BASE_URL}/api/v1/wallet/balance-logs?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Failed to fetch balance logs",
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching balance logs");
    return {
      success: false,
      message: "Network error while fetching balance logs",
    };
  }
}

/**
 * Get wallet statistics
 * @returns Promise with wallet stats
 */
export async function getWalletStats(): Promise<ApiResponse<WalletStats>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found. Please login again.",
      };
    }

    const response = await fetch(`${BASE_URL}/api/v1/wallet/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Failed to fetch wallet stats",
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching wallet stats");
    return {
      success: false,
      message: "Network error while fetching wallet stats",
    };
  }
}
