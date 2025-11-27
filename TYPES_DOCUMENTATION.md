# Types and Interfaces Documentation

## Overview

Comprehensive TypeScript types and interfaces have been created for the MLM Investment Platform based on the Prisma schema. This ensures type safety across the entire application.

## Files Created

### 1. `/types/database.types.ts` (1,100+ lines)
Complete database type definitions including:

#### Enums (14 total)
- `UserRole` - USER, ADMIN, MASTER_NODE, SUPPORT
- `UserStatus` - PENDING_VERIFICATION, ACTIVE, SUSPENDED, BLOCKED, DELETED
- `KYCStatus` - NOT_SUBMITTED, PENDING, APPROVED, REJECTED, EXPIRED
- `InvestmentProfile` - BRONZE, SILVER, GOLD, DIAMOND
- `BonusType` - REFERRAL_INSTANT, REFERRAL_DELAYED, PROFIT_DISTRIBUTION, etc.
- `CommissionStatus` - PENDING, SCHEDULED, PROCESSING, PAID, FAILED, CANCELLED
- `InvestmentStatus` - PENDING_APPROVAL, APPROVED, ACTIVE, MATURED, WITHDRAWN, etc.
- `TransactionType` - INVESTMENT, WITHDRAWAL, TRANSFER_IN, COMMISSION, BONUS, etc.
- `TransactionStatus` - PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED, REVERSED
- `PaymentMethod` - ONLINE_TRANSFER, PHYSICAL_CASH, UPI, BANK_TRANSFER, etc.
- `ApprovalType` - INVESTMENT, WITHDRAWAL, BORROW, TRANSFER, ADD_MONEY, USER_REGISTRATION
- `ApprovalStatus` - PENDING, APPROVED, REJECTED, EXPIRED
- `NotificationType` - EMAIL, SMS, WHATSAPP, IN_APP, PUSH
- `MoneyRequestStatus` - PENDING, APPROVED, REJECTED, PROCESSING, COMPLETED, CANCELLED

#### Core Interfaces (40+ models)
- **User Management**: `User`, `Session`, `ActivityLog`
- **Financial**: `Wallet`, `Investment`, `Transaction`, `BalanceLog`
- **Requests**: `WithdrawalRequest`, `BorrowRequest`, `TransferRequest`, `AddMoneyRequest`
- **Hierarchy**: `UserHierarchy`, `UserHierarchyStats`, `CommissionRate`, `RankAchievement`
- **Commission**: `InvestmentCommission`, `CommissionPaymentBatch`, `ReferralBonusConfig`, `ProfitDistributionConfig`
- **Configuration**: `ProfileConfiguration`, `SystemConfig`, `GlobalConfig`, `CurrencyBankAccount`
- **Notifications**: `Notification`, `Approval`
- **Utilities**: `Screenshot`, `ExchangeRateLog`

#### Utility Types
- `CreateUserInput`, `UpdateUserInput`
- `CreateInvestmentInput`, `UpdateInvestmentInput`
- `CreateTransactionInput`, `UpdateTransactionInput`
- `ApiResponse<T>`, `PaginationParams`, `PaginatedResponse<T>`

### 2. `/types/constants.ts` (500+ lines)
Application constants and configurations:

#### Enum Labels
Human-readable labels for all enums:
```typescript
USER_ROLE_LABELS
USER_STATUS_LABELS
KYC_STATUS_LABELS
INVESTMENT_PROFILE_LABELS
TRANSACTION_TYPE_LABELS
PAYMENT_METHOD_LABELS
// ... and more
```

#### Investment Profile Details
Complete configuration for each investment tier:
```typescript
INVESTMENT_PROFILE_DETAILS = {
  BRONZE: { minReturn: 5, maxReturn: 8, lockInMonths: 12, ... },
  SILVER: { minReturn: 7, maxReturn: 12, lockInMonths: 9, ... },
  GOLD: { minReturn: 10, maxReturn: 15, lockInMonths: 6, ... },
  DIAMOND: { minReturn: 15, maxReturn: 20, lockInMonths: 3, ... }
}
```

#### Status Colors
Color mappings for UI components:
```typescript
USER_STATUS_COLORS
KYC_STATUS_COLORS
INVESTMENT_STATUS_COLORS
TRANSACTION_STATUS_COLORS
MONEY_REQUEST_STATUS_COLORS
```

#### Validation Constants
```typescript
VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MIN_INVESTMENT_AMOUNT: 10000,
  PHONE_REGEX: /^[6-9]\d{9}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  REFERRAL_CODE_REGEX: /^[A-Z]{3}\d{5}[A-Z]{2}$/,
  // ... and more
}
```

#### Routes and API Endpoints
```typescript
ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  INVESTMENTS: "/investments",
  WALLET: "/wallet",
  // ... and more
}

API_ENDPOINTS = {
  LOGIN: "/api/v1/auth/login",
  REGISTER: "/api/v1/auth/register",
  VALIDATE_REFERRAL: "/api/v1/auth/validate-referral",
  // ... and more
}
```

### 3. `/types/utils.types.ts` (600+ lines)
Utility types and helper functions:

#### Type Guards
```typescript
isUserActive(user: User): boolean
isUserPendingVerification(user: User): boolean
isKYCApproved(user: User): boolean
isInvestmentActive(investment: Investment): boolean
isTransactionCompleted(transaction: Transaction): boolean
hasSufficientBalance(wallet: Wallet, amount: string): boolean
canUserWithdraw(user: User, wallet: Wallet): boolean
canUserInvest(user: User): boolean
```

#### Generic Utility Types
```typescript
RequireFields<T, K>
OptionalFields<T, K>
DeepPartial<T>
Nullable<T>
Maybe<T>
KeysOfType<T, U>
OmitByType<T, U>
PickByType<T, U>
```

#### Form Types
```typescript
FormFieldError
FormValidationResult
FormState<T>
```

#### API Types
```typescript
ApiError
ApiSuccessResponse<T>
ApiErrorResponse
ApiResult<T>
```

#### Dashboard & UI Types
```typescript
DashboardStats
ChartDataPoint
TimeSeriesData
ToastNotification
TableColumn<T>
TableAction<T>
HierarchyTreeNode
LevelStats
```

#### Helper Functions
```typescript
formatCurrency(amount, currency)
formatUSDT(amount)
formatPercentage(value)
formatDate(date, format)
calculatePercentage(value, total)
calculateReturnAmount(principal, rate)
calculateMaturityAmount(principal, rate)
getDaysUntil(date)
isDatePast(date)
truncateText(text, maxLength)
generateReferenceId(prefix)
```

### 4. `/types/index.ts`
Central export file for convenient imports

### 5. `/types/README.md`
Comprehensive documentation with usage examples

## Integration

### Updated Files
- `/api/register-user-api.ts` - Now uses centralized types

### Usage in Components

```typescript
// Import types
import { User, UserStatus, Wallet, Investment } from "@/types";
import { USER_STATUS_LABELS, ROUTES } from "@/types/constants";
import { isUserActive, formatCurrency } from "@/types/utils.types";

// Use in component
function UserCard({ user }: { user: User }) {
  const statusLabel = USER_STATUS_LABELS[user.status];
  const isActive = isUserActive(user);
  
  return (
    <div>
      <h2>{user.firstName} {user.lastName}</h2>
      <p>Status: {statusLabel}</p>
      {isActive && <p>User is active!</p>}
    </div>
  );
}
```

## Benefits

1. **Type Safety**: Full TypeScript coverage for all database models
2. **Consistency**: Centralized type definitions prevent duplication
3. **Developer Experience**: Autocomplete and IntelliSense support
4. **Maintainability**: Single source of truth for types
5. **Validation**: Built-in validation constants and regex patterns
6. **Helper Functions**: Reusable utility functions for common operations
7. **Documentation**: Comprehensive examples and usage guides

## Type Coverage

- ✅ **40+ Database Models** - All Prisma models typed
- ✅ **14 Enums** - All enum types with labels and colors
- ✅ **100+ Constants** - Validation rules, routes, endpoints
- ✅ **20+ Type Guards** - Runtime type checking functions
- ✅ **15+ Helper Functions** - Formatting and calculation utilities
- ✅ **UI Types** - Table, form, chart, and dashboard types
- ✅ **API Types** - Request/response types with error handling

## Next Steps

1. **Update existing components** to use the new types
2. **Create API client** using the typed endpoints
3. **Build form components** with typed form state
4. **Implement validation** using the validation constants
5. **Create UI components** using the table and chart types

## Notes

- All monetary values are typed as `string` to preserve precision
- Dates can be `Date` objects or ISO strings
- Use type guards for runtime checks instead of direct comparisons
- Import from `@/types` for convenience (re-exports everything)
- Refer to `/types/README.md` for detailed usage examples
