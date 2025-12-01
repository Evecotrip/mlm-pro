/**
 * Withdrawal API
 * Handles withdrawal requests and management
 * MLM Investment Platform
 */

import { getTokenFromCookies } from "./register-user-api";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ============================================
// TYPE DEFINITIONS
// ============================================

/**
 * Withdrawal methods
 */
export type WithdrawalMethod = 'BANK_TRANSFER' | 'UPI' | 'CASH';

/**
 * Withdrawal status
 */
export type WithdrawalStatus = 'PENDING' | 'APPROVED' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';

/**
 * Bank details for bank transfer withdrawals
 */
export interface BankDetails {
  accountName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}

/**
 * UPI details for UPI withdrawals
 */
export interface UpiDetails {
  upiId: string;
}

/**
 * Cash details for cash withdrawals
 */
export interface CashDetails {
  address: string;
  phone: string;
  preferredTime?: string;
}

/**
 * Contact details
 */
export interface ContactDetails {
  phone: string;
  email?: string;
  address?: string;
}

/**
 * Withdrawal request data
 */
export interface WithdrawalRequest {
  id: string;
  userId: string;
  investmentId: string;
  amount: string;
  method: WithdrawalMethod;
  status: WithdrawalStatus;
  bankDetails?: BankDetails | null;
  upiDetails?: UpiDetails | null;
  cashDetails?: CashDetails | null;
  contactDetails?: ContactDetails | null;
  paymentProof?: string | null;
  transactionRef?: string | null;
  processedBy?: string | null;
  processedAt?: string | null;
  userNotes?: string | null;
  adminNotes?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create withdrawal request payload - Bank Transfer
 */
export interface CreateWithdrawalBankPayload {
  investmentId: string;
  method: 'BANK_TRANSFER';
  bankDetails: BankDetails;
  userNotes?: string;
}

/**
 * Create withdrawal request payload - UPI
 */
export interface CreateWithdrawalUpiPayload {
  investmentId: string;
  method: 'UPI';
  upiDetails: UpiDetails;
  userNotes?: string;
}

/**
 * Create withdrawal request payload - Cash
 */
export interface CreateWithdrawalCashPayload {
  investmentId: string;
  method: 'CASH';
  cashDetails: CashDetails;
  userNotes?: string;
}

/**
 * Union type for all withdrawal payloads
 */
export type CreateWithdrawalPayload = 
  | CreateWithdrawalBankPayload 
  | CreateWithdrawalUpiPayload 
  | CreateWithdrawalCashPayload;

/**
 * Withdrawal filters
 */
export interface WithdrawalFilters {
  status?: WithdrawalStatus;
  page?: number;
  limit?: number;
}

/**
 * Pagination metadata
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: Pagination;
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Create a new withdrawal request
 * @param payload - Withdrawal request details (bank/UPI/cash)
 * @returns Promise with created withdrawal request
 */
export async function createWithdrawalRequest(
  payload: CreateWithdrawalPayload
): Promise<ApiResponse<WithdrawalRequest>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found. Please login again.",
      };
    }

    const response = await fetch(`${BASE_URL}/api/v1/withdrawals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Failed to create withdrawal request",
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating withdrawal request:", error);
    return {
      success: false,
      message: "Network error while creating withdrawal request",
    };
  }
}

/**
 * Get user's withdrawal requests with optional filters
 * @param filters - Optional filters (status, pagination)
 * @returns Promise with paginated withdrawal requests
 */
export async function getWithdrawalRequests(
  filters?: WithdrawalFilters
): Promise<ApiResponse<WithdrawalRequest[]>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found. Please login again.",
      };
    }

    const queryParams = new URLSearchParams();
    
    if (filters?.status) {
      queryParams.append('status', filters.status);
    }
    if (filters?.page) {
      queryParams.append('page', filters.page.toString());
    }
    if (filters?.limit) {
      queryParams.append('limit', filters.limit.toString());
    }

    const url = `${BASE_URL}/api/v1/withdrawals${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url, {
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
        message: errorData.message || "Failed to fetch withdrawal requests",
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching withdrawal requests:", error);
    return {
      success: false,
      message: "Network error while fetching withdrawal requests",
    };
  }
}

/**
 * Get a specific withdrawal request by ID
 * @param withdrawalId - Withdrawal request ID
 * @returns Promise with withdrawal request details
 */
export async function getWithdrawalById(
  withdrawalId: string
): Promise<ApiResponse<WithdrawalRequest>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found. Please login again.",
      };
    }

    const response = await fetch(`${BASE_URL}/api/v1/withdrawals/${withdrawalId}`, {
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
        message: errorData.message || "Failed to fetch withdrawal request",
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching withdrawal request:", error);
    return {
      success: false,
      message: "Network error while fetching withdrawal request",
    };
  }
}

/**
 * Cancel a pending withdrawal request
 * @param withdrawalId - Withdrawal request ID
 * @returns Promise with cancellation result
 */
export async function cancelWithdrawalRequest(
  withdrawalId: string
): Promise<ApiResponse<WithdrawalRequest>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found. Please login again.",
      };
    }

    const response = await fetch(`${BASE_URL}/api/v1/withdrawals/${withdrawalId}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Failed to cancel withdrawal request",
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error cancelling withdrawal request:", error);
    return {
      success: false,
      message: "Network error while cancelling withdrawal request",
    };
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get withdrawal status color for UI
 */
export function getWithdrawalStatusColor(status: WithdrawalStatus): string {
  switch (status) {
    case 'PENDING':
      return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    case 'APPROVED':
      return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    case 'COMPLETED':
      return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    case 'REJECTED':
      return 'text-red-400 bg-red-400/10 border-red-400/20';
    case 'CANCELLED':
      return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    default:
      return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
  }
}

/**
 * Get withdrawal method display name
 */
export function getWithdrawalMethodName(method: WithdrawalMethod): string {
  switch (method) {
    case 'BANK_TRANSFER':
      return 'Bank Transfer';
    case 'UPI':
      return 'UPI';
    case 'CASH':
      return 'Cash Pickup';
    default:
      return method;
  }
}

/**
 * Format withdrawal details for display
 */
export function formatWithdrawalDetails(withdrawal: WithdrawalRequest): string {
  switch (withdrawal.method) {
    case 'BANK_TRANSFER':
      return withdrawal.bankDetails 
        ? `${withdrawal.bankDetails.bankName} - ${withdrawal.bankDetails.accountNumber.slice(-4)}`
        : 'Bank Transfer';
    case 'UPI':
      return withdrawal.upiDetails?.upiId || 'UPI';
    case 'CASH':
      return withdrawal.cashDetails?.phone || 'Cash Pickup';
    default:
      return withdrawal.method;
  }
}
