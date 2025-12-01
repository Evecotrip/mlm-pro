# Wallet API Updates - November 29, 2025

## Summary of Changes

This document outlines the updates made to the wallet API types and implementation to match the latest backend API responses.

---

## 1. Updated Wallet Balance Interface

### Added Field: `lent`
The `WalletBalance` interface now includes a `lent` field to track money lent to other users.

```typescript
export interface WalletBalance {
  total: string;
  available: string;
  locked: string;
  invested: string;
  lent: string;  // NEW
}
```

**Example Response:**
```json
{
  "total": "10751.882625",
  "available": "950.882625",
  "locked": "601",
  "invested": "601",
  "lent": "9200"
}
```

---

## 2. New Wallet Breakdown Interface

### Added: `WalletBreakdown`
A new interface to provide a detailed breakdown of where the user's money is allocated.

```typescript
export interface WalletBreakdown {
  inWallet: string;
  inInvestments: string;
  lentOut: string;
  total: string;
}
```

**Example Response:**
```json
{
  "inWallet": "950.882625",
  "inInvestments": "601",
  "lentOut": "9200",
  "total": "10751.882625"
}
```

---

## 3. Updated WalletData Interface

### Added Field: `breakdown`
The main `WalletData` interface now includes the breakdown object.

```typescript
export interface WalletData {
  id: string;
  userId: string;
  balance: WalletBalance;
  earnings: WalletEarnings;
  statistics: WalletStatistics;
  restrictions: WalletRestrictions;
  breakdown: WalletBreakdown;  // NEW
  createdAt: string;
  updatedAt: string;
}
```

---

## 4. Transaction Response Structure

### Updated: Direct Data Array
The transaction API now returns data and pagination at the same level (not nested).

**New Response Interface:**
```typescript
export interface TransactionsApiResponse {
  success: boolean;
  data?: TransactionResponse[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}
```

**Example Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

---

## 5. Balance Logs Updates

### Added Operation Type: `LOCK`
Balance logs now support three operation types: `CREDIT`, `DEBIT`, and `LOCK`.

```typescript
export type BalanceLogOperation = 'CREDIT' | 'DEBIT' | 'LOCK';
```

### Updated Response Structure
Similar to transactions, balance logs now return data and pagination at the same level.

```typescript
export interface BalanceLogsApiResponse {
  success: boolean;
  data?: BalanceLogResponse[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}
```

**LOCK Operation Example:**
```json
{
  "operation": "LOCK",
  "amount": "-120",
  "description": "Investment created: BRONZE - 120.00000000 USDT"
}
```

---

## 6. Transaction Direction Field

### Added: `direction` Field
Transactions now include a `direction` field to clearly indicate if money was sent or received.

```typescript
export interface TransactionResponse {
  // ... other fields
  sender: TransactionUser | null;
  receiver: TransactionUser | null;
  direction: 'SENT' | 'RECEIVED';  // NEW
}
```

**Benefits:**
- More accurate than inferring direction from transaction type
- Handles edge cases like `BORROW_REQUEST` which can be sent or received
- Enables showing sender/receiver information in the UI

---

## 7. Wallet Store Updates

### Added State Fields
```typescript
interface WalletState {
  // ... existing fields
  breakdown: WalletBreakdown | null;  // NEW
}
```

### Updated Fetch Functions
- `fetchTransactions()` now handles direct data array
- `fetchBalanceLogs()` now handles direct data array and LOCK operation
- `fetchWallet()` now stores breakdown data

### New Selector
```typescript
export const selectBreakdown = (state: WalletState) => state.breakdown;
```

---

## 8. UI Enhancements

### Wallet Page - Balance Logs Tab
- Added "Lock" filter button
- Blue color scheme for LOCK operations
- Lock icon for locked amounts
- 🔒 emoji prefix for locked amounts

### Wallet Page - Transactions Tab
- Shows sender name for received transactions
- Shows receiver name for sent transactions
- Uses `direction` field for accurate credit/debit detection

### Wallet Page - Commissions Tab
- Displays commission stats (Total Earned, Pending, Locked, Referral Bonus)
- Filter by commission type (All, Referral, Profit Distribution)
- Shows commission source user and level information

---

## API Endpoints Reference

### Get Wallet
```
GET /api/v1/wallet
Authorization: Bearer {token}
```

### Get Transactions
```
GET /api/v1/wallet/transactions?page=1&limit=20&type=COMMISSION
Authorization: Bearer {token}
```

### Get Balance Logs
```
GET /api/v1/wallet/balance-logs?page=1&limit=20&operation=CREDIT
Authorization: Bearer {token}
```

### Get Wallet Stats
```
GET /api/v1/wallet/stats
Authorization: Bearer {token}
```

---

## Migration Notes

### Breaking Changes
1. **Transaction Response Structure**: Code accessing `response.data.data` must now access `response.data` directly
2. **Balance Logs Response Structure**: Same as transactions
3. **Balance Interface**: Now includes `lent` field
4. **WalletData Interface**: Now includes `breakdown` field

### Non-Breaking Changes
1. Added `direction` field to transactions (existing code will ignore it)
2. Added `LOCK` operation type to balance logs (existing filters still work)
3. Added `breakdown` to wallet data (optional field)

---

## Testing Checklist

- [x] Wallet data fetches correctly with breakdown
- [x] Transactions display with sender/receiver information
- [x] Balance logs show all three operation types (CREDIT, DEBIT, LOCK)
- [x] Commission tab displays commission data
- [x] Filters work correctly on all tabs
- [x] TypeScript types are accurate
- [x] No console errors or warnings

---

**Last Updated:** November 29, 2025
**Updated By:** Cascade AI Assistant
