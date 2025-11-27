import { User, UserStatus, Wallet, UserHierarchyStats, ApiResponse } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ============================================
// TYPE DEFINITIONS
// ============================================

interface ReferrerInfo {
  id: string;
  name: string;
  email: string;
  uniqueCode: string;
  stats?: {
    directReferrals: number;
    totalTeam: number;
  };
}

interface ValidateReferralResponse {
  valid: boolean;
  referrer: ReferrerInfo;
}

interface UserProfile {
  id: string;
  clerkId: string;
  uniqueCode: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  status: UserStatus;
  kycStatus: string;
  referralCode: string;
  wallet: Wallet;
  hierarchyStats: UserHierarchyStats;
  createdAt: string;
  updatedAt?: string;
}

interface RegisterResponse {
  userId: string;
  uniqueCode: string;
  referralCode: string;
  status: string;
  referrer: {
    name: string;
    email: string;
  };
}

interface TokenResponse {
  token: string;
  user: UserProfile;
}

interface CheckUserExistsResponse {
  exists: boolean;
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Validate a referral code
 * @param code - The referral code to validate
 * @returns Promise with validation result and referrer info
 */
export async function validateReferralCode(
  code: string
): Promise<ApiResponse<ValidateReferralResponse>> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/auth/validate-referral?code=${encodeURIComponent(code)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Failed to validate referral code",
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error validating referral code:", error);
    return {
      success: false,
      message: "Network error while validating referral code",
    };
  }
}

/**
 * Register a new user with a referral code
 * @param clerkUserId - The Clerk user ID
 * @param referralCode - The referral code used for registration
 * @returns Promise with registration result
 */
export async function registerUser(
  clerkUserId: string,
  referralCode: string
): Promise<ApiResponse<RegisterResponse>> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clerkUserId,
        referralCode,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Failed to register user",
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error registering user:", error);
    return {
      success: false,
      message: "Network error while registering user",
    };
  }
}

/**
 * Check if a user exists in the database
 * @param clerkUserId - The Clerk user ID to check
 * @returns Promise with existence status
 */
export async function checkUserExists(
  clerkUserId: string
): Promise<ApiResponse<CheckUserExistsResponse>> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/auth/check-user?clerkUserId=${encodeURIComponent(clerkUserId)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Failed to check user existence",
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error checking user existence:", error);
    return {
      success: false,
      message: "Network error while checking user existence",
    };
  }
}

/**
 * Generate authentication token by exchanging Clerk user ID
 * @param clerkUserId - The Clerk user ID
 * @returns Promise with token and user profile
 */
export async function generateToken(
  clerkUserId: string
): Promise<ApiResponse<TokenResponse>> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/exchange`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clerkUserId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Failed to generate token",
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error generating token:", error);
    return {
      success: false,
      message: "Network error while generating token",
    };
  }
}

/**
 * Get user profile using authentication token
 * @param token - The authentication token
 * @returns Promise with user profile
 */
export async function getUserProfile(
  token: string
): Promise<ApiResponse<UserProfile>> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/me`, {
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
        message: errorData.message || "Failed to get user profile",
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting user profile:", error);
    return {
      success: false,
      message: "Network error while getting user profile",
    };
  }
}

/**
 * Store authentication token in cookies
 * @param token - The authentication token to store
 */
export function storeTokenInCookies(token: string): void {
  document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict; Secure`;
}

/**
 * Get authentication token from cookies
 * @returns The authentication token or null if not found
 */
export function getTokenFromCookies(): string | null {
  const cookies = document.cookie.split("; ");
  const tokenCookie = cookies.find((cookie) => cookie.startsWith("auth_token="));
  return tokenCookie ? tokenCookie.split("=")[1] : null;
}

/**
 * Remove authentication token from cookies
 */
export function removeTokenFromCookies(): void {
  document.cookie = "auth_token=; path=/; max-age=0";
}

/**
 * Complete authentication flow: generate token and store in cookies
 * @param clerkUserId - The Clerk user ID
 * @returns Promise with token response
 */
export async function authenticateAndStoreToken(
  clerkUserId: string
): Promise<ApiResponse<TokenResponse>> {
  const tokenResponse = await generateToken(clerkUserId);
  
  if (tokenResponse.success && tokenResponse.data?.token) {
    storeTokenInCookies(tokenResponse.data.token);
  }
  
  return tokenResponse;
}

/**
 * Main registration flow handler
 * Checks user status and returns appropriate redirect path
 * @param clerkUserId - The Clerk user ID
 * @returns Object with redirect path and user data
 */
export async function handleUserRegistrationFlow(clerkUserId: string): Promise<{
  redirectTo: "/dashboard" | "/queue" | "/validate-and-register-user" | "/login";
  userData?: UserProfile;
  message?: string;
}> {
  try {
    // Check if user exists
    const existsResponse = await checkUserExists(clerkUserId);
    
    if (!existsResponse.success || !existsResponse.data?.exists) {
      // User not registered, redirect to validate and register
      return {
        redirectTo: "/validate-and-register-user",
        message: "Please complete registration with a referral code",
      };
    }

    // User exists, generate token
    const tokenResponse = await authenticateAndStoreToken(clerkUserId);
    
    if (!tokenResponse.success || !tokenResponse.data) {
      return {
        redirectTo: "/login",
        message: "Authentication failed. Please login again.",
      };
    }

    const user = tokenResponse.data.user;

    // Check user status and redirect accordingly
    if (user.status === "ACTIVE") {
      return {
        redirectTo: "/dashboard",
        userData: user,
        message: "Welcome back!",
      };
    } else if (user.status === "PENDING_VERIFICATION") {
      return {
        redirectTo: "/queue",
        userData: user,
        message: "Waiting for referrer approval",
      };
    } else {
      return {
        redirectTo: "/validate-and-register-user",
        userData: user,
        message: "Please complete your registration",
      };
    }
  } catch (error) {
    console.error("Error in registration flow:", error);
    return {
      redirectTo: "/login",
      message: "An error occurred. Please try again.",
    };
  }
}