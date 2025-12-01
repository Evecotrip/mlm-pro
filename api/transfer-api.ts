/**
 * Transfer API
 * Handles peer-to-peer wallet transfers between users
 * MLM Investment Platform
 */

import { getTokenFromCookies } from "./register-user-api";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ============================================
// TYPE DEFINITIONS
// ============================================

/**
 * Transfer status types
 */
export type TransferStatus = 'PENDING' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';

/**
 * Transfer type filter
 */
export type TransferType = 'sent' | 'received' | 'all';

/**
 * User info in transfer
 */
export interface TransferUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  referralCode: string;
}

/**
 * Transfer record
 */
export interface Transfer {
  id: string;
  senderId: string;
  receiverId: string;
  amount: string;
  status: TransferStatus;
  note: string | null;
  sender: TransferUser;
  receiver: TransferUser;
  createdAt: string;
  respondedAt: string | null;
  completedAt: string | null;
}

/**
 * Create transfer request payload
 */
export interface CreateTransferPayload {
  recipientCode: string;
  amount: number;
  note?: string;
}

/**
 * Transfer filters for queries
 */
export interface TransferFilters {
  type?: TransferType;
  status?: TransferStatus;
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
 * Transfer statistics
 */
export interface TransferStats {
  totalSent: string;
  totalReceived: string;
  pendingSent: string;
  pendingReceived: string;
  completedSent: number;
  completedReceived: number;
  rejectedSent: number;
  rejectedReceived: number;
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
 * Create a new transfer request
 * @param payload - Transfer details (recipient code, amount, note)
 * @returns Promise with created transfer
 */
export async function createTransferRequest(
  payload: CreateTransferPayload
): Promise<ApiResponse<Transfer>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found. Please login again.",
      };
    }

    const response = await fetch(`${BASE_URL}/api/v1/transfers`, {
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
        message: errorData.message || "Failed to create transfer request",
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating transfer request:", error);
    return {
      success: false,
      message: "Network error while creating transfer request",
    };
  }
}

/**
 * Get user's transfers with optional filters
 * @param filters - Optional filters (type, status, pagination)
 * @returns Promise with list of transfers
 */
export async function getTransfers(
  filters?: TransferFilters
): Promise<ApiResponse<Transfer[]>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found. Please login again.",
      };
    }

    // Build query parameters
    const params = new URLSearchParams();
    if (filters?.type && filters.type !== 'all') {
      params.append('type', filters.type);
    }
    if (filters?.status) {
      params.append('status', filters.status);
    }
    params.append('page', String(filters?.page || 1));
    params.append('limit', String(filters?.limit || 20));

    const url = `${BASE_URL}/api/v1/transfers?${params.toString()}`;

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
        message: errorData.message || "Failed to fetch transfers",
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching transfers:", error);
    return {
      success: false,
      message: "Network error while fetching transfers",
    };
  }
}

/**
 * Get sent transfers
 * @param status - Optional status filter
 * @param page - Page number
 * @param limit - Items per page
 * @returns Promise with sent transfers
 */
export async function getSentTransfers(
  status?: TransferStatus,
  page: number = 1,
  limit: number = 20
): Promise<ApiResponse<Transfer[]>> {
  return getTransfers({
    type: 'sent',
    status,
    page,
    limit,
  });
}

/**
 * Get received transfers
 * @param status - Optional status filter
 * @param page - Page number
 * @param limit - Items per page
 * @returns Promise with received transfers
 */
export async function getReceivedTransfers(
  status?: TransferStatus,
  page: number = 1,
  limit: number = 20
): Promise<ApiResponse<Transfer[]>> {
  return getTransfers({
    type: 'received',
    status,
    page,
    limit,
  });
}

/**
 * Accept a pending transfer request
 * @param transferId - ID of the transfer to accept
 * @returns Promise with updated transfer
 */
export async function acceptTransfer(
  transferId: string
): Promise<ApiResponse<Transfer>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found. Please login again.",
      };
    }

    const response = await fetch(`${BASE_URL}/api/v1/transfers/${transferId}/accept`, {
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
        message: errorData.message || "Failed to accept transfer",
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error accepting transfer:", error);
    return {
      success: false,
      message: "Network error while accepting transfer",
    };
  }
}

/**
 * Reject a pending transfer request
 * @param transferId - ID of the transfer to reject
 * @returns Promise with updated transfer
 */
export async function rejectTransfer(
  transferId: string
): Promise<ApiResponse<Transfer>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found. Please login again.",
      };
    }

    const response = await fetch(`${BASE_URL}/api/v1/transfers/${transferId}/reject`, {
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
        message: errorData.message || "Failed to reject transfer",
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error rejecting transfer:", error);
    return {
      success: false,
      message: "Network error while rejecting transfer",
    };
  }
}

/**
 * Get transfer statistics
 * @returns Promise with transfer statistics
 */
export async function getTransferStats(): Promise<ApiResponse<TransferStats>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found. Please login again.",
      };
    }

    const response = await fetch(`${BASE_URL}/api/v1/transfers/stats`, {
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
        message: errorData.message || "Failed to fetch transfer statistics",
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching transfer statistics:", error);
    return {
      success: false,
      message: "Network error while fetching transfer statistics",
    };
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get status color for UI
 */
export function getTransferStatusColor(status: TransferStatus): string {
  switch (status) {
    case 'PENDING':
      return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    case 'COMPLETED':
      return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
    case 'REJECTED':
      return 'text-red-600 bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    case 'CANCELLED':
      return 'text-slate-600 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    default:
      return 'text-slate-600 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
  }
}

/**
 * Get status icon component name
 */
export function getTransferStatusIcon(status: TransferStatus): string {
  switch (status) {
    case 'PENDING':
      return 'Clock';
    case 'COMPLETED':
      return 'CheckCircle2';
    case 'REJECTED':
      return 'XCircle';
    case 'CANCELLED':
      return 'Ban';
    default:
      return 'Circle';
  }
}

/**
 * Format transfer amount
 */
export function formatTransferAmount(amount: string | number): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return numAmount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Get full name from transfer user
 */
export function getTransferUserName(user: TransferUser): string {
  return `${user.firstName} ${user.lastName}`.trim() || 'Unknown User';
}

/**
 * Check if user is sender
 */
export function isSender(transfer: Transfer, userId: string): boolean {
  return transfer.senderId === userId;
}

/**
 * Check if user is receiver
 */
export function isReceiver(transfer: Transfer, userId: string): boolean {
  return transfer.receiverId === userId;
}

/**
 * Get transfer direction for user
 */
export function getTransferDirection(transfer: Transfer, userId: string): 'sent' | 'received' {
  return isSender(transfer, userId) ? 'sent' : 'received';
}

/**
 * Get other party in transfer
 */
export function getOtherParty(transfer: Transfer, userId: string): TransferUser {
  return isSender(transfer, userId) ? transfer.receiver : transfer.sender;
}

/**
 * Check if transfer can be accepted
 */
export function canAcceptTransfer(transfer: Transfer, userId: string): boolean {
  return transfer.status === 'PENDING' && isReceiver(transfer, userId);
}

/**
 * Check if transfer can be rejected
 */
export function canRejectTransfer(transfer: Transfer, userId: string): boolean {
  return transfer.status === 'PENDING' && isReceiver(transfer, userId);
}

/**
 * Format transfer date
 */
export function formatTransferDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get time ago string
 */
export function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return formatTransferDate(dateString);
}

/**
 * Calculate total from transfers
 */
export function calculateTotal(transfers: Transfer[]): number {
  return transfers.reduce((sum, transfer) => {
    return sum + parseFloat(transfer.amount || '0');
  }, 0);
}

/**
 * Group transfers by status
 */
export function groupByStatus(transfers: Transfer[]): Record<TransferStatus, Transfer[]> {
  const groups: Record<TransferStatus, Transfer[]> = {
    PENDING: [],
    COMPLETED: [],
    REJECTED: [],
    CANCELLED: [],
  };

  transfers.forEach(transfer => {
    groups[transfer.status].push(transfer);
  });

  return groups;
}

/**
 * Filter transfers by date range
 */
export function filterByDateRange(
  transfers: Transfer[],
  startDate: Date,
  endDate: Date
): Transfer[] {
  return transfers.filter(transfer => {
    const transferDate = new Date(transfer.createdAt);
    return transferDate >= startDate && transferDate <= endDate;
  });
}

/**
 * Search transfers by query
 */
export function searchTransfers(transfers: Transfer[], query: string): Transfer[] {
  const lowerQuery = query.toLowerCase();
  return transfers.filter(transfer => {
    return (
      transfer.sender.firstName.toLowerCase().includes(lowerQuery) ||
      transfer.sender.lastName.toLowerCase().includes(lowerQuery) ||
      transfer.sender.email.toLowerCase().includes(lowerQuery) ||
      transfer.sender.referralCode.toLowerCase().includes(lowerQuery) ||
      transfer.receiver.firstName.toLowerCase().includes(lowerQuery) ||
      transfer.receiver.lastName.toLowerCase().includes(lowerQuery) ||
      transfer.receiver.email.toLowerCase().includes(lowerQuery) ||
      transfer.receiver.referralCode.toLowerCase().includes(lowerQuery) ||
      transfer.amount.includes(query) ||
      (transfer.note && transfer.note.toLowerCase().includes(lowerQuery))
    );
  });
}

/**
 * Validate transfer amount
 */
export function validateTransferAmount(amount: number, maxAmount: number): {
  valid: boolean;
  error?: string;
} {
  if (amount <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' };
  }
  if (amount > maxAmount) {
    return { valid: false, error: `Amount cannot exceed ${maxAmount}` };
  }
  return { valid: true };
}

/**
 * Validate referral code format
 */
export function validateReferralCode(code: string): {
  valid: boolean;
  error?: string;
} {
  if (!code || code.trim().length === 0) {
    return { valid: false, error: 'Referral code is required' };
  }
  if (!/^REF\d{5}[A-Z]{2}$/.test(code)) {
    return { valid: false, error: 'Invalid referral code format' };
  }
  return { valid: true };
}
