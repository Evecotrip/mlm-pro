import { getTokenFromCookies } from './register-user-api';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

// ==================== INTERFACES ====================

export interface ContactDetails {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  phoneNumber1: string;
  phoneNumber2?: string;
}

export interface BorrowerDetails {
  paymentMethod: 'ONLINE_TRANSFER' | 'PHYSICAL_CASH';
  lenderReferralCode?: string;
  contactDetails?: ContactDetails;
}

export interface LenderDetails {
  notes?: string;
  paymentMethod: 'ONLINE_TRANSFER' | 'PHYSICAL_CASH';
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  referralCode: string;
}

export interface BorrowRequest {
  id: string;
  borrowerId: string;
  lenderId: string;
  amount: string;
  paymentMethod: 'ONLINE_TRANSFER' | 'PHYSICAL_CASH';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
  borrowerDetails: BorrowerDetails;
  lenderDetails: LenderDetails | null;
  approvedAt: string | null;
  rejectedAt: string | null;
  completedAt: string | null;
  paymentProof: string | null;
  confirmationProof: string | null;
  borrowerNotes: string | null;
  lenderNotes: string | null;
  createdAt: string;
  updatedAt: string;
  borrower: User;
  lender: User;
}

export interface CreateBorrowRequestSoftCash {
  amount: number;
  paymentMethod: 'ONLINE_TRANSFER';
  lenderReferralCode: string;
  borrowerNotes?: string;
}

export interface CreateBorrowRequestHardCash {
  amount: number;
  paymentMethod: 'PHYSICAL_CASH';
  contactDetails: ContactDetails;
  borrowerNotes?: string;
}

export type CreateBorrowRequestPayload = CreateBorrowRequestSoftCash | CreateBorrowRequestHardCash;

export interface PaginatedBorrowRequests {
  data: BorrowRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API actually returns this structure (data is array directly, not nested)
export interface BorrowRequestsApiResponse {
  success: boolean;
  data: BorrowRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BorrowRequestFilters {
  status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// ==================== BORROWER APIS ====================

/**
 * Create a new borrow request (SOFT_CASH or HARD_CASH)
 * @param payload - Borrow request details
 * @returns Created borrow request
 */
export async function createBorrowRequest(
  payload: CreateBorrowRequestPayload
): Promise<ApiResponse<BorrowRequest>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        error: 'Authentication token not found'
      };
    }

    const response = await fetch(`${BASE_URL}/api/v1/borrow`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Failed to create borrow request'
      };
    }

    return result;
  } catch (error) {
    console.error('Error creating borrow request:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Get all sent borrow requests (where current user is borrower)
 * @param filters - Optional filters for status, pagination
 * @returns Paginated list of sent borrow requests
 */
export async function getSentBorrowRequests(
  filters?: BorrowRequestFilters
): Promise<ApiResponse<PaginatedBorrowRequests>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        error: 'Authentication token not found'
      };
    }

    const queryParams = new URLSearchParams();
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());

    const url = `${BASE_URL}/api/v1/borrow/sent${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Failed to fetch sent borrow requests'
      };
    }

    return result;
  } catch (error) {
    console.error('Error fetching sent borrow requests:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Get a specific borrow request by ID
 * @param requestId - Borrow request ID
 * @returns Borrow request details
 */
export async function getBorrowRequestById(
  requestId: string
): Promise<ApiResponse<BorrowRequest>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        error: 'Authentication token not found'
      };
    }

    const response = await fetch(`${BASE_URL}/api/v1/borrow/${requestId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Failed to fetch borrow request'
      };
    }

    return result;
  } catch (error) {
    console.error('Error fetching borrow request:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Cancel a borrow request (borrower only)
 * @param requestId - Borrow request ID to cancel
 * @returns Cancelled borrow request
 */
export async function cancelBorrowRequest(
  requestId: string
): Promise<ApiResponse<BorrowRequest>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        error: 'Authentication token not found'
      };
    }

    const response = await fetch(
      `${BASE_URL}/api/v1/borrow/${requestId}/cancel`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Failed to cancel borrow request'
      };
    }

    return result;
  } catch (error) {
    console.error('Error cancelling borrow request:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

// ==================== LENDER APIS ====================

/**
 * Get all received borrow requests (where current user is lender)
 * @param filters - Optional filters for status, pagination
 * @returns Paginated list of received borrow requests
 */
export async function getReceivedBorrowRequests(
  filters?: BorrowRequestFilters
): Promise<ApiResponse<PaginatedBorrowRequests>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        error: 'Authentication token not found'
      };
    }

    const queryParams = new URLSearchParams();
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());

    const url = `${BASE_URL}/api/v1/borrow/received${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Failed to fetch received borrow requests'
      };
    }

    return result;
  } catch (error) {
    console.error('Error fetching received borrow requests:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Approve a borrow request (lender only)
 * @param requestId - Borrow request ID to approve
 * @param lenderNotes - Optional notes from lender
 * @returns Approved borrow request
 */
export async function approveBorrowRequest(
  requestId: string,
  lenderNotes?: string
): Promise<ApiResponse<BorrowRequest>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        error: 'Authentication token not found'
      };
    }

    const response = await fetch(
      `${BASE_URL}/api/v1/borrow/${requestId}/approve`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lenderNotes }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Failed to approve borrow request'
      };
    }

    return result;
  } catch (error) {
    console.error('Error approving borrow request:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Reject a borrow request (lender only)
 * @param requestId - Borrow request ID to reject
 * @param lenderNotes - Reason for rejection
 * @returns Rejected borrow request
 */
export async function rejectBorrowRequest(
  requestId: string,
  lenderNotes: string
): Promise<ApiResponse<BorrowRequest>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        error: 'Authentication token not found'
      };
    }

    const response = await fetch(
      `${BASE_URL}/api/v1/borrow/${requestId}/reject`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lenderNotes }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Failed to reject borrow request'
      };
    }

    return result;
  } catch (error) {
    console.error('Error rejecting borrow request:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Upload payment proof (lender after approval)
 * @param requestId - Borrow request ID
 * @param file - Payment proof image file (JPG/JPEG only)
 * @returns Updated borrow request
 */
export async function uploadPaymentProof(
  requestId: string,
  file: File
): Promise<ApiResponse<BorrowRequest>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        error: 'Authentication token not found'
      };
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Only JPG/JPEG files are allowed'
      };
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size must be less than 5MB'
      };
    }

    const formData = new FormData();
    formData.append('paymentProof', file);

    const response = await fetch(
      `${BASE_URL}/api/v1/borrow/${requestId}/upload-payment-proof`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Failed to upload payment proof'
      };
    }

    return result;
  } catch (error) {
    console.error('Error uploading payment proof:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Upload confirmation proof (borrower after receiving money)
 * @param requestId - Borrow request ID
 * @param file - Confirmation proof image file (JPG/JPEG only)
 * @returns Updated borrow request
 */
export async function uploadConfirmationProof(
  requestId: string,
  file: File
): Promise<ApiResponse<BorrowRequest>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        error: 'Authentication token not found'
      };
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Only JPG/JPEG files are allowed'
      };
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size must be less than 5MB'
      };
    }

    const formData = new FormData();
    formData.append('confirmationProof', file);

    const response = await fetch(
      `${BASE_URL}/api/v1/borrow/${requestId}/upload-confirmation-proof`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Failed to upload confirmation proof'
      };
    }

    return result;
  } catch (error) {
    console.error('Error uploading confirmation proof:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}
