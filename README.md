# MLM Investment Platform (Dummy/Prototype)

A Multi-Level Marketing (MLM) investment platform prototype built with Next.js 16, featuring referral-based hierarchical structures, investment management with risk profiles, and approval workflows.

## 🚀 Features

### User Flow
1. **Landing Page** - Beautiful landing page with investment tiers and features
2. **Login/Signup** - Authentication with referral code validation
3. **Queue Page** - Pending approval status for new users
4. **Dashboard** - Full-featured dashboard with hierarchy view and investments
5. **Investment Form** - Dynamic risk profiles and lock-in periods

### Core Functionality

#### 🔐 Authentication & Registration
- User signup with mandatory referral code
- Referral code validation against existing users
- Approval workflow (users wait for referrer approval)
- Demo accounts for testing

#### 💰 Investment System
- **Risk Profiles:**
  - Low Risk: 5% return (Min: ₹500)
  - Moderate Risk: 20% return (Min: ₹5,000)
  - High Risk: 100% return (Min: ₹10,000)
- **Lock-in Periods:** 1-12 months with bonus returns
- Dynamic risk profile availability based on investment amount
- Real-time return calculation
- Cash-only payment (approved by referrer)

#### 👥 Hierarchical Network
- Tree-based referral structure
- **Downward Visibility:** Users can view all downline members
- **Upward Restriction:** Users cannot view upline referrers
- Visual tree representation with expand/collapse
- Network statistics (direct referrals, total network)

#### 📊 Dashboard Features
- Investment portfolio summary
- Total invested and returns tracking
- Referral code sharing with copy functionality
- Network hierarchy visualization
- Direct referrals list
- Investment status tracking

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **State Management:** React Context API
- **Storage:** LocalStorage (dummy data)

## 📦 Installation

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build

# Start production server
bun start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🎮 Demo Accounts

Use these credentials to test different user roles:

| Email | Role | Referral Code | Description |
|-------|------|---------------|-------------|
| root@example.com | Root User | ROOT1234 | Top-level user with full network |
| userb@example.com | User B | USERB567 | Direct referral of Root |
| userc@example.com | User C | USERC890 | Referral of User B |
| userd@example.com | User D | USERD123 | Referral of User B |
| usere@example.com | User E | USERE456 | Direct referral of Root |

**Password:** Any text (dummy authentication)

## 📁 Project Structure

```
mama-project-protoype/
├── app/
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard with hierarchy & investments
│   ├── login/
│   │   └── page.tsx          # Login page
│   ├── signup/
│   │   └── page.tsx          # Signup with referral code
│   ├── queue/
│   │   └── page.tsx          # Pending approval page
│   ├── layout.tsx            # Root layout with AuthProvider
│   ├── page.tsx              # Landing page
│   └── globals.css           # Global styles
├── components/
│   └── InvestmentForm.tsx    # Investment creation form
├── contexts/
│   └── AuthContext.tsx       # Authentication context
├── lib/
│   └── mockData.ts           # Mock data & helper functions
└── public/                   # Static assets
```

## 🔑 Key Components

### AuthContext
Manages user authentication, signup, and login state using React Context and LocalStorage.

### Mock Data Structure
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  referralCode: string;
  referrerId: string | null;
  isApproved: boolean;
  createdAt: string;
}

interface Investment {
  id: string;
  userId: string;
  amount: number;
  riskProfile: 'low' | 'moderate' | 'high';
  lockInMonths: number;
  baseReturn: number;
  lockInBonus: number;
  totalReturn: number;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'matured';
  createdAt: string;
}
```

## 🎯 User Journey

### New User Registration
1. Visit landing page
2. Click "Sign Up"
3. Enter referral code (e.g., ROOT1234)
4. Fill registration form
5. Submit → Redirected to Queue page
6. Wait for referrer approval

### Approved User
1. Login with credentials
2. View dashboard with stats
3. See network hierarchy
4. Create new investment:
   - Enter amount
   - Select risk profile (based on amount)
   - Choose lock-in period
   - Review returns calculation
   - Submit for approval
5. Share referral code to build network

## 🔒 Visibility Rules

### Downward Visibility (Allowed)
- Users can view all members in their downline
- Example: User A can view B, C, D, E
- Includes investment details and performance

### Upward Visibility (Restricted)
- Users cannot view upline referrers
- Example: User B cannot view User A
- Complete privacy of upline structure

## 💡 Investment Calculation

```
Total Return = (Amount × Base Risk Rate) + (Amount × Lock-in Bonus Rate)
Final Amount = Investment Amount + Total Return

Example:
- Investment: ₹10,000
- Risk: High (100%)
- Lock-in: 2 months (+2%)
- Base Return: ₹10,000 × 100% = ₹10,000
- Lock-in Bonus: ₹10,000 × 2% = ₹200
- Total Return: ₹10,200
- Final Amount: ₹20,200
```

## ⚠️ Important Notes

### This is a DUMMY/PROTOTYPE Application
- **No real database** - Uses LocalStorage
- **No real authentication** - Any password works
- **No real payments** - Cash-only placeholder
- **No backend API** - All data is client-side
- **For demonstration purposes only**

### Compliance Warning
MLM investment schemes are subject to strict regulations:
- SEBI guidelines
- Prevention of Money Laundering Act (PMLA)
- KYC requirements
- Prize Chits and Money Circulation Schemes (Banning) Act, 1978

**This prototype should not be used for real financial transactions without proper legal compliance.**

## 🚧 Future Enhancements (Not Implemented)

- Real database (PostgreSQL/MongoDB)
- Backend API with authentication
- Payment gateway integration
- Email/SMS notifications
- Admin panel for approvals
- Investment maturity tracking
- Withdrawal system
- KYC document upload
- Mobile responsive improvements
- Analytics and reporting

## 📄 License

This is a prototype/demo project for educational purposes.

## 🤝 Contributing

This is a prototype project. For production use, significant security and compliance work would be required.

---

**Built with Next.js 16 + TypeScript + Tailwind CSS**
# mlm-pro
# mlm-pro
