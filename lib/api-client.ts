/**
 * Centralized API Client
 * Handles all API requests with proper error handling
 * Hides backend URLs in production
 */

import { getTokenFromCookies } from "@/api/register-user-api";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface ApiOptions extends RequestInit {
  requiresAuth?: boolean;
}

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Centralized API request handler
 * Automatically handles authentication and error logging
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> {
  const { requiresAuth = true, ...fetchOptions } = options;

  try {
    // Build headers
    const headers: Record<string, string> = {
      ...(fetchOptions.headers as Record<string, string>),
    };

    // Add auth token if required
    if (requiresAuth) {
      const token = getTokenFromCookies();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    // Make request
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    // Parse response
    const data = await response.json();

    // Return parsed data
    return data;
  } catch (error) {
    // Log detailed error only in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`API Error [${endpoint}]:`, error);
    } else {
      console.error('API request failed');
    }

    // Return sanitized error
    return {
      success: false,
      error: 'Network error. Please try again.',
    };
  }
}

/**
 * Upload file with FormData
 */
export async function apiUpload<T = any>(
  endpoint: string,
  formData: FormData
): Promise<ApiResponse<T>> {
  try {
    const token = getTokenFromCookies();
    const headers: Record<string, string> = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Upload Error [${endpoint}]:`, error);
    } else {
      console.error('Upload failed');
    }

    return {
      success: false,
      error: 'Upload failed. Please try again.',
    };
  }
}

/**
 * GET request helper
 */
export async function apiGet<T = any>(
  endpoint: string,
  requiresAuth: boolean = true
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'GET',
    requiresAuth,
  });
}

/**
 * POST request helper
 */
export async function apiPost<T = any>(
  endpoint: string,
  body: any,
  requiresAuth: boolean = true
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    requiresAuth,
  });
}

/**
 * PUT request helper
 */
export async function apiPut<T = any>(
  endpoint: string,
  body: any,
  requiresAuth: boolean = true
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    requiresAuth,
  });
}

/**
 * DELETE request helper
 */
export async function apiDelete<T = any>(
  endpoint: string,
  requiresAuth: boolean = true
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'DELETE',
    requiresAuth,
  });
}

/**
 * Safe error handler - never exposes URLs
 */
export function handleApiError(error: unknown, context: string = 'API'): ApiResponse {
  if (process.env.NODE_ENV === 'development') {
    console.error(`${context} Error:`, error);
  } else {
    console.error(`${context} operation failed`);
  }

  return {
    success: false,
    error: 'An error occurred. Please try again.',
  };
}
