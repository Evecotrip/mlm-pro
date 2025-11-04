# MLM Network Structure

## Overview
The network now contains **20 users** with a multi-level hierarchy. Several users are in **queue status** (not approved) to demonstrate the approval workflow.

## Network Hierarchy Tree

```
Root User (user-1) ✓
├── User B (user-2) ✓
│   ├── User C (user-3) ✓
│   │   ├── User G (user-7) ✓
│   │   │   ├── User M (user-13) ✓
│   │   │   │   └── User T (user-20) ✓
│   │   │   └── User N (user-14) ⏳ PENDING
│   │   └── User H (user-8) ⏳ PENDING
│   ├── User D (user-4) ✓
│   │   ├── User K (user-11) ✓
│   │   │   ├── User Q (user-17) ✓
│   │   │   └── User R (user-18) ⏳ PENDING
│   │   └── User L (user-12) ⏳ PENDING
│   └── User F (user-6) ⏳ PENDING
├── User E (user-5) ✓
│   ├── User I (user-9) ✓
│   │   ├── User O (user-15) ✓
│   │   └── User P (user-16) ⏳ PENDING
│   └── User J (user-10) ⏳ PENDING
└── User S (user-19) ⏳ PENDING
```

**Legend:**
- ✓ = Approved (can access dashboard)
- ⏳ = Pending approval (in queue)

## User Statistics

### Total Users: 20
- **Approved:** 12 users (60%)
- **Pending:** 8 users (40%)

### Network Levels
- **Level 0:** 1 user (Root)
- **Level 1:** 3 users (B, E, S)
- **Level 2:** 5 users (C, D, F, I, J)
- **Level 3:** 6 users (G, H, K, L, O, P)
- **Level 4:** 4 users (M, N, Q, R)
- **Level 5:** 1 user (T)

**Maximum Depth:** 5 levels

## Approved Users (Can Access Dashboard)

| User ID | Name | Email | Referrer | Direct Refs | Investments |
|---------|------|-------|----------|-------------|-------------|
| user-1 | Root User | root@example.com | - | 3 | 0 |
| user-2 | User B | userb@example.com | Root | 3 | 2 |
| user-3 | User C | userc@example.com | User B | 2 | 2 |
| user-4 | User D | userd@example.com | User B | 2 | 1 |
| user-5 | User E | usere@example.com | Root | 2 | 1 |
| user-7 | User G | userg@example.com | User C | 2 | 1 |
| user-9 | User I | useri@example.com | User E | 2 | 1 |
| user-11 | User K | userk@example.com | User D | 2 | 1 |
| user-13 | User M | userm@example.com | User G | 1 | 1 |
| user-15 | User O | usero@example.com | User I | 0 | 1 |
| user-17 | User Q | userq@example.com | User K | 0 | 1 |
| user-20 | User T | usert@example.com | User M | 0 | 1 |

## Pending Users (In Queue)

| User ID | Name | Email | Referrer | Status |
|---------|------|-------|----------|--------|
| user-6 | User F | userf@example.com | User B | ⏳ Awaiting approval |
| user-8 | User H | userh@example.com | User C | ⏳ Awaiting approval |
| user-10 | User J | userj@example.com | User E | ⏳ Awaiting approval |
| user-12 | User L | userl@example.com | User D | ⏳ Awaiting approval |
| user-14 | User N | usern@example.com | User G | ⏳ Awaiting approval |
| user-16 | User P | userp@example.com | User I | ⏳ Awaiting approval |
| user-18 | User R | userr@example.com | User K | ⏳ Awaiting approval |
| user-19 | User S | users@example.com | Root | ⏳ Awaiting approval |

## Investment Summary

### Total Investments: 13
- **Active:** 12 investments
- **Matured:** 1 investment
- **Total Amount Invested:** ₹141,500
- **Total Expected Returns:** ₹172,685

### Investment Distribution

| User | Investments | Total Invested | Total Returns |
|------|-------------|----------------|---------------|
| User B | 2 | ₹18,000 | ₹21,040 |
| User C | 2 | ₹8,000 | ₹9,230 |
| User D | 1 | ₹15,000 | ₹16,950 |
| User E | 1 | ₹8,000 | ₹9,760 |
| User G | 1 | ₹12,000 | ₹13,920 |
| User I | 1 | ₹20,000 | ₹24,400 |
| User K | 1 | ₹7,500 | ₹9,225 |
| User M | 1 | ₹10,000 | ₹11,200 |
| User O | 1 | ₹5,000 | ₹6,050 |
| User Q | 1 | ₹18,000 | ₹20,880 |
| User T | 1 | ₹25,000 | ₹30,500 |

### Risk Profile Distribution
- **High Risk:** 8 investments (₹118,000)
- **Moderate Risk:** 4 investments (₹20,500)
- **Low Risk:** 1 investment (₹3,000)

### Lock-in Period Distribution
- **1 Month:** 3 investments
- **2 Months:** 3 investments
- **3 Months:** 3 investments
- **6 Months:** 2 investments
- **12 Months:** 2 investments

## Demo Accounts for Testing

### 1. Root User (Full Network Access)
- **Email:** root@example.com
- **Password:** password123
- **Status:** ✓ Approved
- **Can See:** All 19 downline users
- **Features:** Full dashboard, hierarchy view, investment management

### 2. User B (Mid-Level with Large Network)
- **Email:** userb@example.com
- **Password:** password123
- **Status:** ✓ Approved
- **Can See:** 9 downline users (C, D, F, G, H, K, L, M, T)
- **Investments:** 2 active (₹18,000)

### 3. User F (Pending Approval - Queue)
- **Email:** userf@example.com
- **Password:** password123
- **Status:** ⏳ PENDING
- **Experience:** Queue page with waiting message
- **Referrer:** User B (needs to approve)

### 4. User C (Active with Investments)
- **Email:** userc@example.com
- **Password:** password123
- **Status:** ✓ Approved
- **Can See:** 5 downline users (G, H, M, N, T)
- **Investments:** 2 (1 active, 1 matured)

### 5. User H (Pending Approval - Queue)
- **Email:** userh@example.com
- **Password:** password123
- **Status:** ⏳ PENDING
- **Experience:** Queue page
- **Referrer:** User C (needs to approve)

### 6. User S (Pending - Direct Referral of Root)
- **Email:** users@example.com
- **Password:** password123
- **Status:** ⏳ PENDING
- **Experience:** Queue page
- **Referrer:** Root User (needs to approve)

## Testing Scenarios

### Scenario 1: Approved User Experience
1. Login as `root@example.com` or `userb@example.com`
2. Access full dashboard with stats
3. View network hierarchy (tree/grid view)
4. See investment details
5. Create new investments
6. View downline members

### Scenario 2: Pending User Experience (Queue)
1. Login as `userf@example.com`, `userh@example.com`, or `users@example.com`
2. Redirected to queue page
3. See message: "You're in queue. Waiting for your referrer's approval"
4. View referrer information
5. See timeline of signup process
6. Cannot access dashboard until approved

### Scenario 3: Network Hierarchy Exploration
1. Login as `root@example.com`
2. Navigate to Hierarchy Board
3. Switch between view modes (Card/Detailed/Compact)
4. Toggle between Tree and Grid layouts
5. Use zoom controls (50%-200%)
6. Search for specific users
7. Filter active users only
8. Expand/collapse branches
9. Click users to view sidebar details

### Scenario 4: Investment Management
1. Login as any approved user
2. View current investments
3. Create new investment
4. Select risk profile and lock-in period
5. See calculated returns
6. Submit for approval
7. Track investment status

## Network Growth Patterns

### Branch Analysis

**User B's Branch (Largest):**
- Direct: 3 referrals (C, D, F)
- Total Network: 9 users
- Depth: 4 levels
- Active Investments: ₹73,000

**User E's Branch:**
- Direct: 2 referrals (I, J)
- Total Network: 4 users
- Depth: 2 levels
- Active Investments: ₹33,000

**User C's Sub-Branch:**
- Direct: 2 referrals (G, H)
- Total Network: 5 users
- Investments: ₹32,000

## Approval Workflow

### Who Can Approve Whom?

1. **Root User** can approve:
   - User S (user-19) ⏳

2. **User B** can approve:
   - User F (user-6) ⏳

3. **User C** can approve:
   - User H (user-8) ⏳

4. **User D** can approve:
   - User L (user-12) ⏳

5. **User E** can approve:
   - User J (user-10) ⏳

6. **User G** can approve:
   - User N (user-14) ⏳

7. **User I** can approve:
   - User P (user-16) ⏳

8. **User K** can approve:
   - User R (user-18) ⏳

## Key Features Demonstrated

### ✅ Multi-Level Hierarchy
- 5 levels deep
- Complex branching structure
- Parent-child relationships

### ✅ Approval System
- 8 users in pending state
- Queue page for unapproved users
- Referrer-based approval workflow

### ✅ Investment Tracking
- 13 investments across network
- Various risk profiles
- Different lock-in periods
- Active and matured statuses

### ✅ Network Visibility
- Downward visibility only
- No upward or sibling visibility
- Hierarchical access control

### ✅ Rich User Data
- Personal information
- Contact details
- Referral codes
- Creation timestamps

## Data Consistency

All data is consistent with:
- Referrer-referee relationships
- Investment approval chains
- Network hierarchy rules
- Timestamp chronology
- Referral code uniqueness

---

**Last Updated:** June 2024
**Total Network Value:** ₹141,500 invested
**Expected Returns:** ₹172,685
**Network Growth Rate:** 20 users in 5 months
