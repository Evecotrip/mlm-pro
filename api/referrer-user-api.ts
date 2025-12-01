/**
 * Referrer User API
 * Handles approval requests for user registrations
 * MLM Investment Platform
 */

import { 
  Approval, 
  ApprovalType, 
  ApprovalStatus, 
  User,
  ApiResponse,
  PaginatedResponse 
} from "@/types";
import { getTokenFromCookies } from "./register-user-api";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ============================================
// TYPE DEFINITIONS
// ============================================

/**
 * Requester details in approval response
 */
export interface ApprovalRequester {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  uniqueCode: string;
  createdAt: string;
}

/**
 * Pending approval with requester details
 */
export interface PendingApproval {
  id: string;
  type: ApprovalType;
  status: ApprovalStatus;
  requesterId: string;
  approverId: string;
  entityId: string;
  entityType: string;
  requestData: Record<string, any>;
  responseData?: Record<string, any> | null;
  screenshotUrl?: string | null;
  requestNotes?: string | null;
  approvalNotes?: string | null;
  rejectionReason?: string | null;
  requestedAt: string;
  respondedAt?: string | null;
  expiresAt?: string | null;
  requester: ApprovalRequester;
}

/**
 * Approval count response
 */
export interface ApprovalCountResponse {
  count: number;
}

/**
 * Process approval request body
 */
export interface ProcessApprovalRequest {
  approved: boolean;
  notes?: string;
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Get pending approval requests for the current user (referrer)
 * @param page - Page number for pagination (default: 1)
 * @param limit - Number of items per page (default: 10)
 * @returns Promise with array of pending approvals (pagination in separate field)
 */
export async function getPendingApprovals(
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<PendingApproval[]> & { pagination?: { page: number; limit: number; total: number; totalPages: number } }> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found. Please login again.",
      };
    }

    const response = await fetch(
      `${BASE_URL}/api/v1/approvals/pending?page=${page}&limit=${limit}`,
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
        message: errorData.message || "Failed to fetch pending approvals",
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching pending approvals");
    return {
      success: false,
      message: "Network error while fetching pending approvals",
    };
  }
}

/**
 * Get count of pending approval requests for the current user (referrer)
 * @returns Promise with count of pending approvals
 */
export async function getPendingApprovalCount(): Promise<
  ApiResponse<ApprovalCountResponse>
> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found. Please login again.",
      };
    }

    const response = await fetch(
      `${BASE_URL}/api/v1/approvals/pending/count`,
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
        message: errorData.message || "Failed to fetch pending approval count",
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching pending approval count");
    return {
      success: false,
      message: "Network error while fetching pending approval count",
    };
  }
}

/**
 * Process (approve or reject) a user registration approval request
 * @param approvalId - The ID of the approval request
 * @param approved - Whether to approve (true) or reject (false)
 * @param notes - Optional notes for the approval/rejection
 * @returns Promise with processed approval details
 */
export async function processApproval(
  approvalId: string,
  approved: boolean,
  notes?: string
): Promise<ApiResponse<Approval>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found. Please login again.",
      };
    }

    const response = await fetch(
      `${BASE_URL}/api/v1/approvals/${approvalId}/process`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          approved,
          notes,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || `Failed to ${approved ? 'approve' : 'reject'} request`,
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error processing approval");
    return {
      success: false,
      message: "Network error while processing approval",
    };
  }
}

/**
 * Approve a user registration request
 * @param approvalId - The ID of the approval request
 * @param notes - Optional approval notes
 * @returns Promise with approved request details
 */
export async function approveUserRegistration(
  approvalId: string,
  notes?: string
): Promise<ApiResponse<Approval>> {
  return processApproval(approvalId, true, notes);
}

/**
 * Reject a user registration request
 * @param approvalId - The ID of the approval request
 * @param reason - Rejection reason
 * @returns Promise with rejected request details
 */
export async function rejectUserRegistration(
  approvalId: string,
  reason: string
): Promise<ApiResponse<Approval>> {
  return processApproval(approvalId, false, reason);
}

/**
 * Get all approvals (pending, approved, rejected) with pagination
 * @param page - Page number for pagination (default: 1)
 * @param limit - Number of items per page (default: 10)
 * @param status - Optional filter by approval status
 * @returns Promise with paginated approvals
 */
export async function getAllApprovals(
  page: number = 1,
  limit: number = 10,
  status?: ApprovalStatus
): Promise<ApiResponse<PaginatedResponse<PendingApproval>>> {
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

    if (status) {
      queryParams.append('status', status);
    }

    const response = await fetch(
      `${BASE_URL}/api/v1/approvals?${queryParams.toString()}`,
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
        message: errorData.message || "Failed to fetch approvals",
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching approvals");
    return {
      success: false,
      message: "Network error while fetching approvals",
    };
  }
}

/**
 * Get approval details by ID
 * @param approvalId - The ID of the approval request
 * @returns Promise with approval details
 */
export async function getApprovalById(
  approvalId: string
): Promise<ApiResponse<PendingApproval>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found. Please login again.",
      };
    }

    const response = await fetch(
      `${BASE_URL}/api/v1/approvals/${approvalId}`,
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
        message: errorData.message || "Failed to fetch approval details",
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching approval details");
    return {
      success: false,
      message: "Network error while fetching approval details",
    };
  }
}