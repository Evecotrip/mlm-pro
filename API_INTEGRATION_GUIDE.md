# API Integration Guide

## Overview
The authentication and registration APIs have been successfully integrated into the application. This document outlines the implementation and usage.

## API Functions (`/api/register-user-api.ts`)

### Core API Functions

1. **`validateReferralCode(code: string)`**
   - Validates a referral code
   - Returns referrer information if valid
   - Endpoint: `GET /api/v1/auth/validate-referral?code={code}`

2. **`registerUser(clerkUserId: string, referralCode: string)`**
   - Registers a new user with a referral code
   - Returns registration status and user info
   - Endpoint: `POST /api/v1/auth/register`

3. **`checkUserExists(clerkUserId: string)`**
   - Checks if a user exists in the database
   - Endpoint: `GET /api/v1/auth/check-user?clerkUserId={clerkUserId}`

4. **`generateToken(clerkUserId: string)`**
   - Generates JWT token by exchanging Clerk user ID
   - Returns token and user profile
   - Endpoint: `POST /api/v1/auth/exchange`

5. **`getUserProfile(token: string)`**
   - Fetches user profile using authentication token
   - Returns complete user profile with wallet and hierarchy stats
   - Endpoint: `GET /api/v1/auth/me`

### Helper Functions

6. **`storeTokenInCookies(token: string)`**
   - Stores authentication token in cookies (7 days expiry)

7. **`getTokenFromCookies()`**
   - Retrieves authentication token from cookies

8. **`removeTokenFromCookies()`**
   - Clears authentication token from cookies

9. **`authenticateAndStoreToken(clerkUserId: string)`**
   - Combined function: generates token and stores in cookies

### Main Flow Handler

10. **`handleUserRegistrationFlow(clerkUserId: string)`**
    - Main registration flow handler
    - Checks user status and returns appropriate redirect path
    - Returns object with:
      - `redirectTo`: One of `/dashboard`, `/queue`, `/validate-and-register-user`, or `/login`
      - `userData`: User profile (if available)
      - `message`: Status message

## User Flow Logic

### Registration Flow
```
1. User signs up with Clerk → /signup
2. After Clerk signup → Check if user exists in DB
3. If NOT exists → Redirect to /validate-and-register-user
4. User enters referral code → Validate code
5. If valid → Register user → Redirect to /queue
6. If already registered with PENDING_VERIFICATION → Stay in /queue
7. If approved (ACTIVE status) → Redirect to /dashboard
```

### Login Flow
```
1. User logs in with Clerk → /login
2. After Clerk login → Check user status
3. If NOT in DB → Redirect to /validate-and-register-user
4. If PENDING_VERIFICATION → Redirect to /queue
5. If ACTIVE → Redirect to /dashboard
```

## Integrated Pages

### 1. `/app/validate-and-register-user/page.tsx`
- **Purpose**: Validate referral code and register new users
- **Features**:
  - Referral code validation with real-time feedback
  - Two-step process: validate then register
  - Automatic status checking on mount
  - Error handling and user feedback
  - Auto-redirect if already registered

### 2. `/app/login/page.tsx`
- **Purpose**: User login with automatic routing
- **Features**:
  - Clerk authentication
  - Automatic status check after login
  - Smart routing based on user status
  - Loading state during status check

### 3. `/app/signup/page.tsx`
- **Purpose**: User signup with automatic routing
- **Features**:
  - Clerk authentication
  - Automatic status check after signup
  - Smart routing to appropriate page
  - Loading state during setup

### 4. `/app/queue/page.tsx`
- **Purpose**: Waiting room for pending verification
- **Features**:
  - Displays user profile from API
  - Shows pending verification status
  - Refresh button to check approval status
  - Auto-redirect to dashboard when approved
  - Real-time status updates

## Environment Configuration

Ensure the following environment variable is set in `.env`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

## User Status Types

- **`PENDING_VERIFICATION`**: User registered, waiting for referrer approval → `/queue`
- **`ACTIVE`**: User approved by referrer → `/dashboard`
- **`SUSPENDED`**: User account suspended → Handle accordingly

## API Response Types

All API responses follow this structure:
```typescript
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}
```

## Error Handling

All API functions include:
- Try-catch blocks for network errors
- Response validation
- User-friendly error messages
- Fallback routing on errors

## Cookie Management

- **Cookie Name**: `auth_token`
- **Expiry**: 7 days
- **Attributes**: `SameSite=Strict; Secure`
- **Path**: `/` (available throughout the app)

## Testing the Flow

1. **New User Registration**:
   - Go to `/signup`
   - Sign up with Clerk
   - Should redirect to `/validate-and-register-user`
   - Enter referral code (e.g., `REF00001AA`)
   - Click "Validate Code"
   - Click "Complete Registration"
   - Should redirect to `/queue`

2. **Pending User Login**:
   - Go to `/login`
   - Login with pending user credentials
   - Should redirect to `/queue`
   - Click "Refresh Status" to check approval

3. **Approved User Login**:
   - Go to `/login`
   - Login with approved user credentials
   - Should redirect to `/dashboard`

## Notes

- The Tailwind CSS warnings (`bg-gradient-to-br` → `bg-linear-to-br`, `flex-shrink-0` → `shrink-0`) are cosmetic and don't affect functionality
- All API calls include proper error handling
- Token is automatically stored and retrieved from cookies
- User status is checked on every page load for security
