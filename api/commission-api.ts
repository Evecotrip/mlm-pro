import { getTokenFromCookies } from './register-user-api';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

// ==================== INTERFACES ====================

export type CommissionType = 'REFERRAL_BONUS' | 'PROFIT_DISTRIBUTION';
export type CommissionStatus = 'PENDING' | 'COMPLETED' | 'LOCKED';

export interface Commission {
  id: string;
  userId: string;
  sourceUserId: string;
  sourceInvestmentId: string;
  type: CommissionType;
  level: number;
  amount: string;
  status: CommissionStatus;
  unlocksAt: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    referralCode: string;
  };
  sourceUser: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    referralCode: string;
  };
}

/**
 * Commission Stats Interface
 */
export interface CommissionStats {
  totalEarned: string;
  totalPending: string;
  totalLocked: string;
  referralBonusTotal: string;
  profitDistributionTotal: string;
  byLevel: Array<{
    level: number;
    amount: string;
    count: number;
  }>;
}

/**
 * Pagination Interface
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * API Response Interface
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: Pagination;
}

export interface CommissionFilters {
  page?: number;
  limit?: number;
  type?: CommissionType;
  status?: CommissionStatus;
}

// ==================== API FUNCTIONS ====================

/**
 * Get user's commissions with optional filters
 * @param filters - Optional filters for type, status, and pagination
 * @returns Paginated list of commissions
 */
export async function getMyCommissions(
  filters?: CommissionFilters
): Promise<ApiResponse<Commission[]>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        error: 'Authentication token not found'
      };
    }

    const queryParams = new URLSearchParams();
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());
    if (filters?.type) queryParams.append('type', filters.type);
    if (filters?.status) queryParams.append('status', filters.status);

    const url = `${BASE_URL}/api/v1/commissions${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;

    console.log('Fetching commissions:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    console.log('Commissions response:', result);

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Failed to fetch commissions'
      };
    }

    return result;
  } catch (error) {
    console.error('Error fetching commissions:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Get a specific commission by ID
 * @param commissionId - Commission ID
 * @returns Commission details
 */
export async function getCommissionById(
  commissionId: string
): Promise<ApiResponse<Commission>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        error: 'Authentication token not found'
      };
    }

    const response = await fetch(
      `${BASE_URL}/api/v1/commissions/${commissionId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = await response.json();
    console.log('Commission details response:', result);

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Failed to fetch commission details'
      };
    }

    return result;
  } catch (error) {
    console.error('Error fetching commission details:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Get user's commission statistics
 * @returns Commission stats including totals and breakdown by level
 */
export async function getMyCommissionStats(): Promise<ApiResponse<CommissionStats>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        error: 'Authentication token not found'
      };
    }

    const response = await fetch(
      `${BASE_URL}/api/v1/commissions/stats`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = await response.json();
    console.log('Commission stats response:', result);

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Failed to fetch commission stats'
      };
    }

    return result;
  } catch (error) {
    console.error('Error fetching commission stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Get commissions related to a specific investment
 * @param investmentId - Investment ID
 * @returns List of commissions generated from the investment
 */
export async function getCommissionsByInvestment(
  investmentId: string
): Promise<ApiResponse<Commission[]>> {
  try {
    const token = getTokenFromCookies();
    
    if (!token) {
      return {
        success: false,
        error: 'Authentication token not found'
      };
    }

    const response = await fetch(
      `${BASE_URL}/api/v1/commissions/investment/${investmentId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = await response.json();
    console.log('Investment commissions response:', result);

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Failed to fetch investment commissions'
      };
    }

    return result;
  } catch (error) {
    console.error('Error fetching investment commissions:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}
