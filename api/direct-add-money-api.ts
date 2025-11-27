/**
 * Direct Add Money API
 * Handles direct add money requests, exchange rates, and payment processing
 * MLM Investment Platform
 */

import { ApiResponse } from "@/types";
import { getTokenFromCookies } from "./register-user-api";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ============================================
// TYPE DEFINITIONS
// ============================================

/**
 * Payment method types
 */
export type PaymentMethod = 'UPI' | 'BANK_TRANSFER' | 'CARD';

/**
 * Add money request status
 */
export type AddMoneyStatus = 
  | 'PENDING' 
  | 'PROCESSING' 
  | 'COMPLETED' 
  | 'REJECTED' 
  | 'CANCELLED';

/**
 * Exchange rate data
 */
export interface ExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  rate: string;
  source: string;
  timestamp: string;
  validUntil: string;
}

/**
 * Conversion calculation result
 */
export interface ConversionCalculation {
  currency: string;
  currencyAmount: string;
  usdtAmount: string;
  exchangeRate: string;
  exchangeRateSource: string;
  bonusAmount: string;
  totalAmount: string;
  rateTimestamp: string;
}

/**
 * Bank account details
 */
export interface BankAccount {
  upiId?: string;
  branch: string;
  bankName: string;
  ifscCode: string;
  accountName: string;
  accountNumber: string;
}

/**
 * Bank details for currency
 */
export interface CurrencyBankDetails {
  currency: string;
  currencyName: string;
  currencySymbol: string;
  bankAccounts: BankAccount[];
  qrCodeUrl: string;
  qrCodeProvider: string;
  instructions: string;
  minAmount: string;
  maxAmount: string;
  processingTime: string;
}

/**
 * Payment details (flexible structure)
 */
export interface PaymentDetails {
  upiId?: string;
  accountNumber?: string;
  ifscCode?: string;
  cardNumber?: string;
  [key: string]: any;
}

/**
 * Add money request
 */
export interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  ifscCode?: string;
  swiftCode?: string;
  branchAddress?: string;
}

export interface AddMoneyRequest {
  id: string;
  userId: string;
  currency: string;
  currencyAmount: number;
  usdtAmount: string;
  exchangeRate: string;
  exchangeRateSource: string;
  rateTimestamp: string;
  amount: string;
  bonusAmount: string;
  totalAmount: string;
  bankDetailsProvided: CurrencyBankDetails | null;
  bankDetails?: BankDetails | null;
  bankDetailsSentAt: string | null;
  bankDetailsSentBy: string | null;
  method: PaymentMethod;
  status: AddMoneyStatus;
  paymentDetails: PaymentDetails;
  masterNodeId: string | null;
  processedAt: string | null;
  verifiedAt: string | null;
  paymentProof: string | null;
  screenshotUploadedAt: string | null;
  screenshotVerifiedAt: string | null;
  transactionRef: string | null;
  userNotes: string | null;
  adminNotes: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create add money request payload
 */
export interface CreateAddMoneyRequestPayload {
  currency: string;
  currencyAmount: number;
  method: PaymentMethod;
  paymentDetails: PaymentDetails;
  userNotes?: string;
}

/**
 * Upload payment proof payload
 */
export interface UploadPaymentProofPayload {
  screenshot: File;
  transactionRef: string;
  userNotes?: string;
}

/**
 * Paginated add money requests response
 */
export interface PaginatedAddMoneyRequests {
  data: AddMoneyRequest[];
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
 * Get exchange rate for a currency
 * @param currency - Currency code (e.g., 'INR', 'USD')
 * @returns Exchange rate data
 */
export async function getExchangeRate(
  currency: string
): Promise<ApiResponse<ExchangeRate>> {
  const token = getTokenFromCookies();

  if (!token) {
    return {
      success: false,
      message: "Authentication token not found",
    };
  }

  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/add-money/exchange-rate/${currency}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return {
      success: false,
      message: "Failed to fetch exchange rate",
    };
  }
}

/**
 * Calculate conversion preview
 * @param currency - Currency code
 * @param amount - Amount to convert
 * @returns Conversion calculation with bonus
 */
export async function calculateConversion(
  currency: string,
  amount: number
): Promise<ApiResponse<ConversionCalculation>> {
  const token = getTokenFromCookies();

  if (!token) {
    return {
      success: false,
      message: "Authentication token not found",
    };
  }

  try {
    const response = await fetch(`${BASE_URL}/api/v1/add-money/calculate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currency,
        amount,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error calculating conversion:", error);
    return {
      success: false,
      message: "Failed to calculate conversion",
    };
  }
}

/**
 * Create a new add money request
 * @param payload - Add money request details
 * @returns Created add money request
 */
export async function createAddMoneyRequest(
  payload: CreateAddMoneyRequestPayload
): Promise<ApiResponse<AddMoneyRequest>> {
  const token = getTokenFromCookies();

  if (!token) {
    return {
      success: false,
      message: "Authentication token not found",
    };
  }

  try {
    const response = await fetch(`${BASE_URL}/api/v1/add-money/request`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating add money request:", error);
    return {
      success: false,
      message: "Failed to create add money request",
    };
  }
}

/**
 * Get all my add money requests
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 20)
 * @returns Paginated list of add money requests
 */
export async function getMyAddMoneyRequests(
  page: number = 1,
  limit: number = 20
): Promise<ApiResponse<PaginatedAddMoneyRequests>> {
  const token = getTokenFromCookies();

  if (!token) {
    return {
      success: false,
      message: "Authentication token not found",
    };
  }

  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(
      `${BASE_URL}/api/v1/add-money/my-requests?${queryParams}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching add money requests:", error);
    return {
      success: false,
      message: "Failed to fetch add money requests",
    };
  }
}

/**
 * Get bank details for a specific currency
 * @param currency - Currency code (e.g., 'INR')
 * @returns Bank details for the currency
 */
export async function getBankDetailsForCurrency(
  currency: string
): Promise<ApiResponse<CurrencyBankDetails>> {
  const token = getTokenFromCookies();

  if (!token) {
    return {
      success: false,
      message: "Authentication token not found",
    };
  }

  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/add-money/bank-details/${currency}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching bank details:", error);
    return {
      success: false,
      message: "Failed to fetch bank details",
    };
  }
}

/**
 * Get add money request by ID
 * @param requestId - Add money request ID
 * @returns Add money request details
 */
export async function getAddMoneyRequestById(
  requestId: string
): Promise<ApiResponse<AddMoneyRequest>> {
  const token = getTokenFromCookies();

  if (!token) {
    return {
      success: false,
      message: "Authentication token not found",
    };
  }

  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/add-money/${requestId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching add money request:", error);
    return {
      success: false,
      message: "Failed to fetch add money request",
    };
  }
}

/**
 * Upload payment proof for an add money request
 * @param requestId - Add money request ID
 * @param screenshot - Payment screenshot file
 * @returns Updated add money request
 */
export async function uploadPaymentProof(
  requestId: string,
  screenshot: File
): Promise<ApiResponse<AddMoneyRequest>> {
  const token = getTokenFromCookies();

  if (!token) {
    return {
      success: false,
      message: "Authentication token not found",
    };
  }

  try {
    const formData = new FormData();
    formData.append("screenshot", screenshot);

    const response = await fetch(
      `${BASE_URL}/api/v1/add-money/${requestId}/upload-proof`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: formData,
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading payment proof:", error);
    return {
      success: false,
      message: "Failed to upload payment proof",
    };
  }
}
