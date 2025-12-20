# Vercel Serverless Function Optimization Guide

## Current Status
- **33 page routes** in `/app` directory
- **0 API routes** (all API calls go to external backend)
- **12 API client modules** in `/api` folder (NOT serverless functions)
- All pages use `'use client'` directive (client-side rendering)

## Problem
Vercel free tier limits: **12 serverless functions**
Next.js 16 can create a serverless function per route, even for client pages.

## Solutions Implemented

### 1. ✅ Next.js Config Optimization
Updated `next.config.ts` with:
- `output: 'standalone'` - Optimized build output
- `optimizePackageImports` - Reduces bundle size
- Image optimization for CoinGecko assets

### 2. 🔄 Route Consolidation Recommendations

#### Group A: Static/Info Pages (Can be combined into dynamic route)
```
/about
/faq
/rules
/terms
/cookies
/disclaimer
/privacy-policy
/support
```
**Solution**: Create `/info/[slug]/page.tsx` → Reduces 8 routes to 1

#### Group B: Request Management Pages (Can use tabs/query params)
```
/my-add-money-requests
/my-borrow-requests
/lend-requests
/investment-requests
/kyc-requests
```
**Solution**: Create `/requests/page.tsx` with tabs → Reduces 5 routes to 1

#### Group C: Money Operations (Can use tabs)
```
/add-money
/direct-add-money
/borrow-add-money
/borrow-lend
```
**Solution**: Create `/money/page.tsx` with operation tabs → Reduces 4 routes to 1

#### Group D: Investment Pages
```
/create-investment
/new-investment
/investment-history
```
**Solution**: Merge into `/investments/page.tsx` with views → Reduces 3 routes to 1

#### Group E: Hierarchy Views
```
/hierarchy-flow
/hierarchy-table
```
**Solution**: Create `/hierarchy/page.tsx` with view toggle → Reduces 2 routes to 1

### 3. 📊 Optimization Results

**Before**: 33 routes
**After consolidation**: ~12 routes

| Category | Before | After | Savings |
|----------|--------|-------|---------|
| Info Pages | 8 | 1 | -7 |
| Request Pages | 5 | 1 | -4 |
| Money Operations | 4 | 1 | -3 |
| Investments | 3 | 1 | -2 |
| Hierarchy | 2 | 1 | -1 |
| Core Pages | 11 | 11 | 0 |
| **Total** | **33** | **16** | **-17** |

### 4. 🎯 Alternative: Static Site Generation

If you don't need dynamic rendering, use:
```typescript
// next.config.ts
export default {
  output: 'export', // Full static export
}
```
This generates **0 serverless functions** but loses:
- Server-side features
- API routes
- Dynamic routing features

### 5. 💡 Keep These Routes Separate (Core Functionality)
```
/ (landing)
/login
/signup
/dashboard
/wallet
/withdrawals
/transfers
/kyc
/queue
/validate-and-register-user
/requests (consolidated)
```

## Implementation Priority

### Phase 1: Quick Wins (Immediate)
1. ✅ Update `next.config.ts` (DONE)
2. Consolidate info pages → `/info/[slug]`
3. Consolidate hierarchy views → `/hierarchy`

### Phase 2: Major Refactoring
4. Consolidate request pages → `/requests` with tabs
5. Consolidate money operations → `/money` with tabs
6. Consolidate investment pages → `/investments`

### Phase 3: Testing
7. Test all consolidated routes
8. Update navigation links
9. Deploy to Vercel and verify function count

## Code Examples

### Dynamic Info Page
```typescript
// app/info/[slug]/page.tsx
export default function InfoPage({ params }: { params: { slug: string } }) {
  const content = {
    'about': <AboutContent />,
    'faq': <FAQContent />,
    'rules': <RulesContent />,
    // ... etc
  };
  return content[params.slug] || <NotFound />;
}
```

### Tabbed Requests Page
```typescript
// app/requests/page.tsx
const [tab, setTab] = useState<'add-money' | 'borrow' | 'lend' | 'investment' | 'kyc'>('add-money');
// Render different components based on tab
```

## Monitoring
After deployment, check Vercel dashboard:
- Functions → Should show ≤12 functions
- Build logs → Check for optimization warnings
- Performance → Monitor cold start times
