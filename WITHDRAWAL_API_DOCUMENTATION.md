# Withdrawal API Documentation

## Overview
Complete API implementation for managing withdrawal requests in the MLM Investment Platform.

---

## API Endpoints

### 1. Create Withdrawal Request
**POST** `/api/v1/withdrawals`

Creates a new withdrawal request with support for three payment methods.

#### Payment Methods:

##### Bank Transfer
```typescript
{
  investmentId: string;
  method: 'BANK_TRANSFER';
  bankDetails: {
    accountName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
  };
  userNotes?: string;
}
```

##### UPI
```typescript
{
  investmentId: string;
  method: 'UPI';
  upiDetails: {
    upiId: string;
  };
  userNotes?: string;
}
```

##### Cash Pickup
```typescript
{
  investmentId: string;
  method: 'CASH';
  cashDetails: {
    address: string;
    phone: string;
    preferredTime?: string;
  };
  userNotes?: string;
}
```

---

### 2. Get Withdrawal Requests
**GET** `/api/v1/withdrawals`

Retrieves user's withdrawal requests with optional filters.

#### Query Parameters:
- `status` - Filter by status (PENDING, APPROVED, COMPLETED, REJECTED, CANCELLED)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

#### Examples:
```
GET /api/v1/withdrawals
GET /api/v1/withdrawals?status=PENDING
GET /api/v1/withdrawals?page=1&limit=10
```

---

### 3. Get Withdrawal by ID
**GET** `/api/v1/withdrawals/:id`

Retrieves a specific withdrawal request by ID.

---

### 4. Cancel Withdrawal Request
**POST** `/api/v1/withdrawals/:id/cancel`

Cancels a pending withdrawal request.

---

## Type Definitions

### WithdrawalMethod
```typescript
type WithdrawalMethod = 'BANK_TRANSFER' | 'UPI' | 'CASH';
```

### WithdrawalStatus
```typescript
type WithdrawalStatus = 'PENDING' | 'APPROVED' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
```

### WithdrawalRequest
```typescript
interface WithdrawalRequest {
  id: string;
  userId: string;
  investmentId: string;
  amount: string;
  method: WithdrawalMethod;
  status: WithdrawalStatus;
  bankDetails?: BankDetails | null;
  upiDetails?: UpiDetails | null;
  cashDetails?: CashDetails | null;
  contactDetails?: ContactDetails | null;
  paymentProof?: string | null;
  transactionRef?: string | null;
  processedBy?: string | null;
  processedAt?: string | null;
  userNotes?: string | null;
  adminNotes?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
}
```

---

## API Functions

### createWithdrawalRequest()
```typescript
async function createWithdrawalRequest(
  payload: CreateWithdrawalPayload
): Promise<ApiResponse<WithdrawalRequest>>
```

**Usage:**
```typescript
// Bank Transfer
const result = await createWithdrawalRequest({
  investmentId: "investment-id",
  method: "BANK_TRANSFER",
  bankDetails: {
    accountName: "John Doe",
    bankName: "HDFC Bank",
    accountNumber: "12345678901234",
    ifscCode: "HDFC0001234"
  },
  userNotes: "Please process to salary account"
});

// UPI
const result = await createWithdrawalRequest({
  investmentId: "investment-id",
  method: "UPI",
  upiDetails: {
    upiId: "johndoe@paytm"
  }
});

// Cash
const result = await createWithdrawalRequest({
  investmentId: "investment-id",
  method: "CASH",
  cashDetails: {
    address: "123 Main Street, Mumbai",
    phone: "+919876543210",
    preferredTime: "Weekdays 10 AM - 5 PM"
  }
});
```

---

### getWithdrawalRequests()
```typescript
async function getWithdrawalRequests(
  filters?: WithdrawalFilters
): Promise<ApiResponse<WithdrawalRequest[]>>
```

**Usage:**
```typescript
// Get all withdrawals
const all = await getWithdrawalRequests();

// Get pending withdrawals
const pending = await getWithdrawalRequests({ status: 'PENDING' });

// Get with pagination
const paginated = await getWithdrawalRequests({ 
  page: 1, 
  limit: 10 
});
```

---

### getWithdrawalById()
```typescript
async function getWithdrawalById(
  withdrawalId: string
): Promise<ApiResponse<WithdrawalRequest>>
```

**Usage:**
```typescript
const withdrawal = await getWithdrawalById("withdrawal-id");
```

---

### cancelWithdrawalRequest()
```typescript
async function cancelWithdrawalRequest(
  withdrawalId: string
): Promise<ApiResponse<WithdrawalRequest>>
```

**Usage:**
```typescript
const result = await cancelWithdrawalRequest("withdrawal-id");
```

---

## Helper Functions

### getWithdrawalStatusColor()
Returns Tailwind CSS classes for status badges.

```typescript
getWithdrawalStatusColor('PENDING')    // Yellow
getWithdrawalStatusColor('APPROVED')   // Blue
getWithdrawalStatusColor('COMPLETED')  // Green
getWithdrawalStatusColor('REJECTED')   // Red
getWithdrawalStatusColor('CANCELLED')  // Gray
```

---

### getWithdrawalMethodName()
Returns human-readable method names.

```typescript
getWithdrawalMethodName('BANK_TRANSFER')  // "Bank Transfer"
getWithdrawalMethodName('UPI')            // "UPI"
getWithdrawalMethodName('CASH')           // "Cash Pickup"
```

---

### formatWithdrawalDetails()
Formats withdrawal details for display.

```typescript
// Bank Transfer: "HDFC Bank - 1234"
// UPI: "johndoe@paytm"
// Cash: "+919876543210"
```

---

## Response Examples

### Create Withdrawal Success
```json
{
  "success": true,
  "message": "Withdrawal request created successfully. Awaiting admin approval.",
  "data": {
    "id": "2823f8ab-c59e-4ad6-a9b1-b0bc8dd1a3a6",
    "userId": "76f28ae5-ecca-4ea4-84bc-91d01f84a332",
    "investmentId": "692b03e6-ff6f-467d-a5df-5d1d1538e775",
    "amount": "130.68",
    "method": "BANK_TRANSFER",
    "status": "PENDING",
    "bankDetails": {
      "bankName": "HDFC Bank",
      "ifscCode": "HDFC0001234",
      "accountName": "John Doe",
      "accountNumber": "12345678901234"
    },
    "userNotes": "Please process withdrawal to my salary account",
    "createdAt": "2025-12-01T06:54:05.760Z",
    "updatedAt": "2025-12-01T06:54:05.760Z"
  }
}
```

### Get Withdrawals Success
```json
{
  "success": true,
  "data": [
    {
      "id": "2823f8ab-c59e-4ad6-a9b1-b0bc8dd1a3a6",
      "amount": "130.68",
      "method": "BANK_TRANSFER",
      "status": "PENDING",
      "createdAt": "2025-12-01T06:54:05.760Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

---

## Error Handling

All API functions return a consistent error format:

```typescript
{
  success: false,
  message: "Error description"
}
```

Common errors:
- **401 Unauthorized**: Missing or invalid authentication token
- **400 Bad Request**: Invalid payload or missing required fields
- **404 Not Found**: Withdrawal request not found
- **500 Server Error**: Internal server error

---

## Usage in Components

### Example: Create Withdrawal Form
```typescript
import { createWithdrawalRequest } from '@/api/withdrawal-api';

const handleSubmit = async (formData) => {
  const result = await createWithdrawalRequest({
    investmentId: selectedInvestment.id,
    method: 'BANK_TRANSFER',
    bankDetails: formData.bankDetails,
    userNotes: formData.notes
  });
  
  if (result.success) {
    toast.success('Withdrawal request created!');
  } else {
    toast.error(result.message);
  }
};
```

### Example: Display Withdrawals List
```typescript
import { getWithdrawalRequests, getWithdrawalStatusColor } from '@/api/withdrawal-api';

const [withdrawals, setWithdrawals] = useState([]);

useEffect(() => {
  const fetchWithdrawals = async () => {
    const result = await getWithdrawalRequests({ status: 'PENDING' });
    if (result.success && result.data) {
      setWithdrawals(result.data);
    }
  };
  fetchWithdrawals();
}, []);

return (
  <div>
    {withdrawals.map(w => (
      <div key={w.id}>
        <span className={getWithdrawalStatusColor(w.status)}>
          {w.status}
        </span>
      </div>
    ))}
  </div>
);
```

---

## Status Flow

```
PENDING → APPROVED → COMPLETED
   ↓         ↓
REJECTED  CANCELLED
```

- **PENDING**: Initial state, awaiting admin review
- **APPROVED**: Admin approved, processing payment
- **COMPLETED**: Payment processed successfully
- **REJECTED**: Admin rejected the request
- **CANCELLED**: User cancelled the request

---

## Security

- All endpoints require authentication via Bearer token
- Token retrieved from cookies using `getTokenFromCookies()`
- User can only access their own withdrawal requests
- Sensitive data (account numbers) should be masked in UI

---

**Created:** December 1, 2025  
**Version:** 1.0.0  
**Author:** Cascade AI Assistant
