import { getTokenFromCookies } from './register-user-api';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

// ==================== INTERFACES ====================

export interface ExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  rate: string;
  source: string;
  timestamp: string;
  validUntil: string;
}

export interface InvestmentProfile {
  profile: 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND';
  minInvestment: string;
  maxInvestment: string;
  minReturnRate: string;
  maxReturnRate: string;
  lockInMonths: number;
  maxHierarchyDepth: number;
  isActive: boolean;
  priority: number;
  description: string;
  features: string[];
}

export interface ProfileConfig {
  profile: 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND';
  features: string[];
  isActive: boolean;
  priority: number;
  description: string;
  lockInMonths: number;
  maxInvestment: string;
  maxReturnRate: string;
  minInvestment: string;
  minReturnRate: string;
  maxHierarchyDepth: number;
}

export interface Investment {
  id: string;
  userId: string;
  amount: string;
  profile: 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND';
  minReturnRate: string;
  maxReturnRate: string;
  actualReturnRate: string | null;
  lockInMonths: number;
  hierarchyDepth: number;
  expectedMinReturn: string;
  expectedMaxReturn: string;
  actualReturn: string | null;
  maturityAmount: string | null;
  maturityDate: string;
  status: 'PENDING_APPROVAL' | 'ACTIVE' | 'MATURED' | 'WITHDRAWN' | 'CANCELLED';
  approvedBy: string | null;
  approvedAt: string | null;
  activatedAt: string | null;
  maturedAt: string | null;
  withdrawnAt: string | null;
  profileConfig: ProfileConfig;
  referenceId: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  daysUntilMaturity: number;
  isMatured: boolean;
  canWithdraw: boolean;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    referralCode: string;
    status: string;
  };
}

export interface CreateInvestmentPayload {
  profile: 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND';
  amount: number;
  notes?: string;
}

export interface InvestmentFilters {
  status?: 'PENDING_APPROVAL' | 'ACTIVE' | 'MATURED' | 'WITHDRAWN' | 'CANCELLED';
  profile?: 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND';
  page?: number;
  limit?: number;
  sortBy?: 'amount' | 'maturityDate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface InvestmentSummary {
  totalInvested: string;
  totalActive: number;
  totalMatured: number;
  totalExpectedReturns: string;
}

export interface InvestmentListResponse {
  data: Investment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: InvestmentSummary;
}

export interface ProfileStats {
  count: number;
  totalAmount: string;
}

export interface InvestmentStats {
  totalInvestments: number;
  totalInvested: string;
  activeInvestments: number;
  maturedInvestments: number;
  pendingApproval: number;
  totalReturns: string;
  averageROI: string;
  byProfile: {
    BRONZE: ProfileStats;
    SILVER: ProfileStats;
    GOLD: ProfileStats;
    DIAMOND: ProfileStats;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// ==================== API FUNCTIONS ====================

/**
 * Get exchange rate for a currency to USDT
 */
export async function getExchangeRate(
  currency: string
): Promise<ApiResponse<ExchangeRate>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        error: 'Authentication token not found'
      };
    }

    const response = await fetch(
      `${BASE_URL}/api/v1/add-money/exchange-rate/${currency}`,
      {
        method: 'GET',
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
        error: result.message || 'Failed to fetch exchange rate'
      };
    }

    return result;
  } catch (error) {
    console.error('Error fetching exchange rate');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Get all investment profiles (plans)
 */
export async function getInvestmentProfiles(): Promise<ApiResponse<InvestmentProfile[]>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        error: 'Authentication token not found'
      };
    }

    const response = await fetch(
      `${BASE_URL}/api/v1/investments/profiles`,
      {
        method: 'GET',
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
        error: result.message || 'Failed to fetch investment profiles'
      };
    }

    return result;
  } catch (error) {
    console.error('Error fetching investment profiles');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Create a new investment
 */
export async function createInvestment(
  payload: CreateInvestmentPayload
): Promise<ApiResponse<Investment>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        error: 'Authentication token not found'
      };
    }

    const response = await fetch(
      `${BASE_URL}/api/v1/investments`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Failed to create investment'
      };
    }

    return result;
  } catch (error) {
    console.error('Error creating investment');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Get current user's investments with optional filters
 */
export async function getInvestments(
  filters?: InvestmentFilters
): Promise<ApiResponse<InvestmentListResponse>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        error: 'Authentication token not found'
      };
    }

    // Build query string from filters
    const queryParams = new URLSearchParams();
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.profile) queryParams.append('profile', filters.profile);
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());
    if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

    const queryString = queryParams.toString();
    const url = `${BASE_URL}/api/v1/investments${queryString ? `?${queryString}` : ''}`;

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
        error: result.message || 'Failed to fetch investments'
      };
    }

    return {
      success: true,
      data: {
        data: result.data || [],
        pagination: result.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0
        },
        summary: result.summary || {
          totalInvested: '0',
          totalActive: 0,
          totalMatured: 0,
          totalExpectedReturns: '0'
        }
      }
    };
  } catch (error) {
    console.error('Error fetching investments');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Get a specific investment by ID for current user
 */
export async function getInvestmentById(
  investmentId: string
): Promise<ApiResponse<Investment>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        error: 'Authentication token not found'
      };
    }

    const response = await fetch(
      `${BASE_URL}/api/v1/investments/${investmentId}`,
      {
        method: 'GET',
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
        error: result.message || 'Failed to fetch investment'
      };
    }

    return result;
  } catch (error) {
    console.error('Error fetching investment');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Get investment statistics for the current user
 */
export async function getInvestmentStats(): Promise<ApiResponse<InvestmentStats>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        error: 'Authentication token not found'
      };
    }

    const response = await fetch(
      `${BASE_URL}/api/v1/investments/stats`,
      {
        method: 'GET',
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
        error: result.message || 'Failed to fetch investment statistics'
      };
    }

    return result;
  } catch (error) {
    console.error('Error fetching investment statistics');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

// ==================== REFERRER INVESTMENT APPROVAL APIS ====================

export interface PendingApprovalsFilters {
  profile?: 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND';
  page?: number;
  limit?: number;
}

export interface PaginatedInvestments {
  data: Investment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Get pending investment approvals (for referrers)
 * @param filters - Optional filters for profile, pagination
 * @returns Paginated list of pending investments
 */
export async function getPendingApprovals(
  filters?: PendingApprovalsFilters
): Promise<ApiResponse<PaginatedInvestments>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        error: 'Authentication token not found'
      };
    }

    const queryParams = new URLSearchParams();
    if (filters?.profile) queryParams.append('profile', filters.profile);
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());

    const url = `${BASE_URL}/api/v1/investments/pending-approvals${
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

    console.log("URL:", url);

    //console.log('Pending approvals response:', result);
    //console.log('Response status:', response.status);

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Failed to fetch pending approvals'
      };
    }

    return result;
  } catch (error) {
    console.error('Error fetching pending approvals');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Approve an investment (for referrers)
 * @param investmentId - Investment ID to approve
 * @param adminNotes - Optional notes from admin/referrer
 * @returns Approved investment details
 */
export async function approveInvestment(
  investmentId: string,
  adminNotes?: string
): Promise<ApiResponse<Investment>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        error: 'Authentication token not found'
      };
    }

    // Only include adminNotes in body if it has a value
    const body: { adminNotes?: string } = {};
    if (adminNotes && adminNotes.trim()) {
      body.adminNotes = adminNotes.trim();
    }

    //console.log('Approve investment API call:', { investmentId, body });

    const response = await fetch(
      `${BASE_URL}/api/v1/investments/${investmentId}/approve`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    const result = await response.json();
    //console.log('Approve investment API response:', { status: response.status, result });

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Failed to approve investment'
      };
    }

    return result;
  } catch (error) {
    console.error('Error approving investment');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Reject an investment (for referrers)
 * @param investmentId - Investment ID to reject
 * @param rejectionReason - Reason for rejection
 * @returns Rejected investment details
 */
export async function rejectInvestment(
  investmentId: string,
  rejectionReason: string
): Promise<ApiResponse<Investment>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        error: 'Authentication token not found'
      };
    }

    const body = { rejectionReason: rejectionReason.trim() };
    //console.log('Reject investment API call:', { investmentId, body });

    const response = await fetch(
      `${BASE_URL}/api/v1/investments/${investmentId}/reject`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    const result = await response.json();
    //console.log('Reject investment API response:', { status: response.status, result });

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Failed to reject investment'
      };
    }

    return result;
  } catch (error) {
    console.error('Error rejecting investment');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}
