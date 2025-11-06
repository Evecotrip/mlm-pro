// Mock data structure for the MLM platform

export interface User {
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

export interface Investment {
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
  approvedAt?: string;
  maturityDate?: string;
  approvedBy?: string;
}

// Mock users with hierarchy
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Root User (Admin)',
    email: 'root@example.com',
    phone: '+91 9876543210',
    dateOfBirth: '1985-01-15',
    referralCode: 'ROOT1234',
    referrerId: null,
    isApproved: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-2',
    name: 'User B',
    email: 'userb@example.com',
    phone: '+91 9876543211',
    dateOfBirth: '1990-03-20',
    referralCode: 'USERB567',
    referrerId: 'user-1',
    isApproved: true,
    createdAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 'user-3',
    name: 'User C',
    email: 'userc@example.com',
    phone: '+91 9876543212',
    dateOfBirth: '1992-05-10',
    referralCode: 'USERC890',
    referrerId: 'user-2',
    isApproved: true,
    createdAt: '2024-03-01T00:00:00Z',
  },
  {
    id: 'user-4',
    name: 'User D',
    email: 'userd@example.com',
    phone: '+91 9876543213',
    dateOfBirth: '1988-07-25',
    referralCode: 'USERD123',
    referrerId: 'user-2',
    isApproved: true,
    createdAt: '2024-03-15T00:00:00Z',
  },
  {
    id: 'user-5',
    name: 'User E',
    email: 'usere@example.com',
    phone: '+91 9876543214',
    dateOfBirth: '1995-09-30',
    referralCode: 'USERE456',
    referrerId: 'user-1',
    isApproved: true,
    createdAt: '2024-04-01T00:00:00Z',
  },
  {
    id: 'user-6',
    name: 'User F',
    email: 'userf@example.com',
    phone: '+91 9876543215',
    dateOfBirth: '1993-11-12',
    referralCode: 'USERF789',
    referrerId: 'user-2',
    isApproved: false,
    createdAt: '2024-04-15T00:00:00Z',
  },
  {
    id: 'user-7',
    name: 'User G',
    email: 'userg@example.com',
    phone: '+91 9876543216',
    dateOfBirth: '1991-06-18',
    referralCode: 'USERG321',
    referrerId: 'user-3',
    isApproved: true,
    createdAt: '2024-04-20T00:00:00Z',
  },
  {
    id: 'user-8',
    name: 'User H',
    email: 'userh@example.com',
    phone: '+91 9876543217',
    dateOfBirth: '1994-08-22',
    referralCode: 'USERH654',
    referrerId: 'user-3',
    isApproved: false,
    createdAt: '2024-04-25T00:00:00Z',
  },
  {
    id: 'user-9',
    name: 'User I',
    email: 'useri@example.com',
    phone: '+91 9876543218',
    dateOfBirth: '1989-12-05',
    referralCode: 'USERI987',
    referrerId: 'user-5',
    isApproved: true,
    createdAt: '2024-05-01T00:00:00Z',
  },
  {
    id: 'user-10',
    name: 'User J',
    email: 'userj@example.com',
    phone: '+91 9876543219',
    dateOfBirth: '1996-02-14',
    referralCode: 'USERJ246',
    referrerId: 'user-5',
    isApproved: false,
    createdAt: '2024-05-05T00:00:00Z',
  },
  {
    id: 'user-11',
    name: 'User K',
    email: 'userk@example.com',
    phone: '+91 9876543220',
    dateOfBirth: '1987-04-30',
    referralCode: 'USERK135',
    referrerId: 'user-4',
    isApproved: true,
    createdAt: '2024-05-10T00:00:00Z',
  },
  {
    id: 'user-12',
    name: 'User L',
    email: 'userl@example.com',
    phone: '+91 9876543221',
    dateOfBirth: '1993-07-19',
    referralCode: 'USERL579',
    referrerId: 'user-4',
    isApproved: false,
    createdAt: '2024-05-12T00:00:00Z',
  },
  {
    id: 'user-13',
    name: 'User M',
    email: 'userm@example.com',
    phone: '+91 9876543222',
    dateOfBirth: '1990-10-08',
    referralCode: 'USERM802',
    referrerId: 'user-7',
    isApproved: true,
    createdAt: '2024-05-15T00:00:00Z',
  },
  {
    id: 'user-14',
    name: 'User N',
    email: 'usern@example.com',
    phone: '+91 9876543223',
    dateOfBirth: '1995-03-27',
    referralCode: 'USERN468',
    referrerId: 'user-7',
    isApproved: false,
    createdAt: '2024-05-18T00:00:00Z',
  },
  {
    id: 'user-15',
    name: 'User O',
    email: 'usero@example.com',
    phone: '+91 9876543224',
    dateOfBirth: '1992-11-11',
    referralCode: 'USERO913',
    referrerId: 'user-9',
    isApproved: true,
    createdAt: '2024-05-20T00:00:00Z',
  },
  {
    id: 'user-16',
    name: 'User P',
    email: 'userp@example.com',
    phone: '+91 9876543225',
    dateOfBirth: '1988-05-16',
    referralCode: 'USERP357',
    referrerId: 'user-9',
    isApproved: false,
    createdAt: '2024-05-22T00:00:00Z',
  },
  {
    id: 'user-17',
    name: 'User Q',
    email: 'userq@example.com',
    phone: '+91 9876543226',
    dateOfBirth: '1994-01-09',
    referralCode: 'USERQ159',
    referrerId: 'user-11',
    isApproved: true,
    createdAt: '2024-05-25T00:00:00Z',
  },
  {
    id: 'user-18',
    name: 'User R',
    email: 'userr@example.com',
    phone: '+91 9876543227',
    dateOfBirth: '1991-09-23',
    referralCode: 'USERR753',
    referrerId: 'user-11',
    isApproved: false,
    createdAt: '2024-05-27T00:00:00Z',
  },
  {
    id: 'user-19',
    name: 'User S',
    email: 'users@example.com',
    phone: '+91 9876543228',
    dateOfBirth: '1997-12-31',
    referralCode: 'USERS951',
    referrerId: 'user-1',
    isApproved: false,
    createdAt: '2024-05-28T00:00:00Z',
  },
  {
    id: 'user-20',
    name: 'User T',
    email: 'usert@example.com',
    phone: '+91 9876543229',
    dateOfBirth: '1986-08-07',
    referralCode: 'USERT486',
    referrerId: 'user-13',
    isApproved: true,
    createdAt: '2024-06-01T00:00:00Z',
  },
];

// Mock investments
export const mockInvestments: Investment[] = [
  {
    id: 'inv-1',
    userId: 'user-2',
    amount: 10000,
    riskProfile: 'high',
    lockInMonths: 2,
    baseReturn: 1000,
    lockInBonus: 200,
    totalReturn: 11200,
    status: 'matured',
    createdAt: '2024-02-05T00:00:00Z',
    approvedAt: '2024-02-06T00:00:00Z',
    maturityDate: '2024-04-05T00:00:00Z',
    approvedBy: 'user-1',
  },
  {
    id: 'inv-2',
    userId: 'user-3',
    amount: 5000,
    riskProfile: 'moderate',
    lockInMonths: 1,
    baseReturn: 1000,
    lockInBonus: 50,
    totalReturn: 6050,
    status: 'active',
    createdAt: '2024-03-05T00:00:00Z',
    approvedAt: '2024-03-06T00:00:00Z',
    maturityDate: '2024-04-05T00:00:00Z',
    approvedBy: 'user-2',
  },
  {
    id: 'inv-3',
    userId: 'user-4',
    amount: 15000,
    riskProfile: 'high',
    lockInMonths: 3,
    baseReturn: 1500,
    lockInBonus: 450,
    totalReturn: 16950,
    status: 'active',
    createdAt: '2024-03-20T00:00:00Z',
    approvedAt: '2024-03-21T00:00:00Z',
    maturityDate: '2024-06-20T00:00:00Z',
    approvedBy: 'user-2',
  },
  {
    id: 'inv-4',
    userId: 'user-5',
    amount: 8000,
    riskProfile: 'moderate',
    lockInMonths: 2,
    baseReturn: 1600,
    lockInBonus: 160,
    totalReturn: 9760,
    status: 'active',
    createdAt: '2024-04-05T00:00:00Z',
    approvedAt: '2024-04-06T00:00:00Z',
    maturityDate: '2024-06-05T00:00:00Z',
    approvedBy: 'user-1',
  },
  {
    id: 'inv-5',
    userId: 'user-7',
    amount: 12000,
    riskProfile: 'high',
    lockInMonths: 6,
    baseReturn: 1200,
    lockInBonus: 720,
    totalReturn: 13920,
    status: 'active',
    createdAt: '2024-04-22T00:00:00Z',
    approvedAt: '2024-04-23T00:00:00Z',
    maturityDate: '2024-10-22T00:00:00Z',
    approvedBy: 'user-3',
  },
  {
    id: 'inv-6',
    userId: 'user-9',
    amount: 20000,
    riskProfile: 'high',
    lockInMonths: 12,
    baseReturn: 2000,
    lockInBonus: 2400,
    totalReturn: 24400,
    status: 'active',
    createdAt: '2024-05-02T00:00:00Z',
    approvedAt: '2024-05-03T00:00:00Z',
    maturityDate: '2025-05-02T00:00:00Z',
    approvedBy: 'user-5',
  },
  {
    id: 'inv-7',
    userId: 'user-11',
    amount: 7500,
    riskProfile: 'moderate',
    lockInMonths: 3,
    baseReturn: 1500,
    lockInBonus: 225,
    totalReturn: 9225,
    status: 'active',
    createdAt: '2024-05-11T00:00:00Z',
    approvedAt: '2024-05-12T00:00:00Z',
    maturityDate: '2024-08-11T00:00:00Z',
    approvedBy: 'user-4',
  },
  {
    id: 'inv-8',
    userId: 'user-13',
    amount: 10000,
    riskProfile: 'high',
    lockInMonths: 2,
    baseReturn: 1000,
    lockInBonus: 200,
    totalReturn: 11200,
    status: 'active',
    createdAt: '2024-05-16T00:00:00Z',
    approvedAt: '2024-05-17T00:00:00Z',
    maturityDate: '2024-07-16T00:00:00Z',
    approvedBy: 'user-7',
  },
  {
    id: 'inv-9',
    userId: 'user-15',
    amount: 5000,
    riskProfile: 'moderate',
    lockInMonths: 1,
    baseReturn: 1000,
    lockInBonus: 50,
    totalReturn: 6050,
    status: 'active',
    createdAt: '2024-05-21T00:00:00Z',
    approvedAt: '2024-05-22T00:00:00Z',
    maturityDate: '2024-06-21T00:00:00Z',
    approvedBy: 'user-9',
  },
  {
    id: 'inv-10',
    userId: 'user-17',
    amount: 18000,
    riskProfile: 'high',
    lockInMonths: 6,
    baseReturn: 1800,
    lockInBonus: 1080,
    totalReturn: 20880,
    status: 'active',
    createdAt: '2024-05-26T00:00:00Z',
    approvedAt: '2024-05-27T00:00:00Z',
    maturityDate: '2024-11-26T00:00:00Z',
    approvedBy: 'user-11',
  },
  {
    id: 'inv-11',
    userId: 'user-20',
    amount: 25000,
    riskProfile: 'high',
    lockInMonths: 12,
    baseReturn: 2500,
    lockInBonus: 3000,
    totalReturn: 30500,
    status: 'active',
    createdAt: '2024-06-02T00:00:00Z',
    approvedAt: '2024-06-03T00:00:00Z',
    maturityDate: '2025-06-02T00:00:00Z',
    approvedBy: 'user-13',
  },
  {
    id: 'inv-12',
    userId: 'user-2',
    amount: 8000,
    riskProfile: 'moderate',
    lockInMonths: 3,
    baseReturn: 1600,
    lockInBonus: 240,
    totalReturn: 9840,
    status: 'active',
    createdAt: '2024-05-10T00:00:00Z',
    approvedAt: '2024-05-11T00:00:00Z',
    maturityDate: '2024-08-10T00:00:00Z',
    approvedBy: 'user-1',
  },
  {
    id: 'inv-13',
    userId: 'user-3',
    amount: 3000,
    riskProfile: 'low',
    lockInMonths: 1,
    baseReturn: 150,
    lockInBonus: 30,
    totalReturn: 3180,
    status: 'matured',
    createdAt: '2024-04-01T00:00:00Z',
    approvedAt: '2024-04-02T00:00:00Z',
    maturityDate: '2024-05-01T00:00:00Z',
    approvedBy: 'user-2',
  },
];

// Risk profiles configuration
export const riskProfiles = [
  {
    level: 'low' as const,
    name: 'Low Risk',
    threshold: 500,
    returnRate: 5,
    description: 'Safe and steady returns',
  },
  {
    level: 'moderate' as const,
    name: 'Moderate Risk',
    threshold: 5000,
    returnRate: 20,
    description: 'Balanced risk and reward',
  },
  {
    level: 'high' as const,
    name: 'High Risk',
    threshold: 10000,
    returnRate: 100,
    description: 'Maximum returns with higher risk',
  },
];

// Lock-in periods configuration
export const lockInPeriods = [
  { months: 1, bonusRate: 1 },
  { months: 2, bonusRate: 2 },
  { months: 3, bonusRate: 3 },
  { months: 6, bonusRate: 6 },
  { months: 12, bonusRate: 12 },
];

// Helper functions
export function getUserById(id: string): User | undefined {
  return mockUsers.find(u => u.id === id);
}

export function getUserByReferralCode(code: string): User | undefined {
  return mockUsers.find(u => u.referralCode === code);
}

export function getDirectReferrals(userId: string): User[] {
  return mockUsers.filter(u => u.referrerId === userId);
}

export function getAllDownline(userId: string): User[] {
  const downline: User[] = [];
  const queue = [userId];
  
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const directReferrals = getDirectReferrals(currentId);
    downline.push(...directReferrals);
    queue.push(...directReferrals.map(u => u.id));
  }
  
  return downline;
}

export function getUserInvestments(userId: string): Investment[] {
  return mockInvestments.filter(inv => inv.userId === userId);
}

export function calculateReturn(amount: number, riskProfile: 'low' | 'moderate' | 'high', lockInMonths: number) {
  const risk = riskProfiles.find(r => r.level === riskProfile);
  const lockIn = lockInPeriods.find(l => l.months === lockInMonths);
  
  if (!risk || !lockIn) return { baseReturn: 0, lockInBonus: 0, totalReturn: 0 };
  
  const baseReturn = (amount * risk.returnRate) / 100;
  const lockInBonus = (amount * lockIn.bonusRate) / 100;
  const totalReturn = baseReturn + lockInBonus;
  
  return { baseReturn, lockInBonus, totalReturn };
}

export function getUserStats(userId: string) {
  const investments = getUserInvestments(userId);
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalReturns = investments
    .filter(inv => inv.status === 'active' || inv.status === 'matured')
    .reduce((sum, inv) => sum + inv.totalReturn, 0);
  
  return { totalInvested, totalReturns, investmentCount: investments.length };
}

// Wallet Transaction Interface
export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'credit' | 'debit';
  category: 'deposit' | 'withdrawal' | 'investment' | 'return' | 'referral_bonus' | 'maturity';
  amount: number;
  balance: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
  relatedId?: string; // Investment ID or referral ID
}

// Mock wallet transactions
export const mockWalletTransactions: WalletTransaction[] = [
  {
    id: 'txn-1',
    userId: 'user-2',
    type: 'credit',
    category: 'deposit',
    amount: 50000,
    balance: 50000,
    description: 'Initial deposit',
    status: 'completed',
    createdAt: '2024-02-01T10:00:00Z',
  },
  {
    id: 'txn-2',
    userId: 'user-2',
    type: 'debit',
    category: 'investment',
    amount: 10000,
    balance: 40000,
    description: 'Investment in High Risk plan',
    status: 'completed',
    createdAt: '2024-02-05T00:00:00Z',
    relatedId: 'inv-1',
  },
  {
    id: 'txn-3',
    userId: 'user-2',
    type: 'credit',
    category: 'referral_bonus',
    amount: 500,
    balance: 40500,
    description: 'Referral bonus from User C',
    status: 'completed',
    createdAt: '2024-03-01T12:00:00Z',
    relatedId: 'user-3',
  },
  {
    id: 'txn-4',
    userId: 'user-2',
    type: 'debit',
    category: 'investment',
    amount: 8000,
    balance: 32500,
    description: 'Investment in Moderate Risk plan',
    status: 'completed',
    createdAt: '2024-05-10T00:00:00Z',
    relatedId: 'inv-12',
  },
  {
    id: 'txn-5',
    userId: 'user-2',
    type: 'credit',
    category: 'referral_bonus',
    amount: 500,
    balance: 33000,
    description: 'Referral bonus from User D',
    status: 'completed',
    createdAt: '2024-03-15T14:30:00Z',
    relatedId: 'user-4',
  },
  {
    id: 'txn-6',
    userId: 'user-3',
    type: 'credit',
    category: 'deposit',
    amount: 25000,
    balance: 25000,
    description: 'Initial deposit',
    status: 'completed',
    createdAt: '2024-03-01T09:00:00Z',
  },
  {
    id: 'txn-7',
    userId: 'user-3',
    type: 'debit',
    category: 'investment',
    amount: 5000,
    balance: 20000,
    description: 'Investment in Moderate Risk plan',
    status: 'completed',
    createdAt: '2024-03-05T00:00:00Z',
    relatedId: 'inv-2',
  },
  {
    id: 'txn-8',
    userId: 'user-3',
    type: 'credit',
    category: 'maturity',
    amount: 3180,
    balance: 23180,
    description: 'Investment maturity return',
    status: 'completed',
    createdAt: '2024-05-01T00:00:00Z',
    relatedId: 'inv-13',
  },
  {
    id: 'txn-9',
    userId: 'user-3',
    type: 'debit',
    category: 'investment',
    amount: 3000,
    balance: 20180,
    description: 'Investment in Low Risk plan',
    status: 'completed',
    createdAt: '2024-04-01T00:00:00Z',
    relatedId: 'inv-13',
  },
  {
    id: 'txn-10',
    userId: 'user-3',
    type: 'credit',
    category: 'referral_bonus',
    amount: 500,
    balance: 20680,
    description: 'Referral bonus from User G',
    status: 'completed',
    createdAt: '2024-04-20T11:00:00Z',
    relatedId: 'user-7',
  },
  {
    id: 'txn-11',
    userId: 'user-1',
    type: 'credit',
    category: 'deposit',
    amount: 100000,
    balance: 100000,
    description: 'Initial deposit',
    status: 'completed',
    createdAt: '2024-01-01T08:00:00Z',
  },
  {
    id: 'txn-12',
    userId: 'user-1',
    type: 'credit',
    category: 'referral_bonus',
    amount: 500,
    balance: 100500,
    description: 'Referral bonus from User B',
    status: 'completed',
    createdAt: '2024-02-01T10:00:00Z',
    relatedId: 'user-2',
  },
  {
    id: 'txn-13',
    userId: 'user-1',
    type: 'credit',
    category: 'referral_bonus',
    amount: 500,
    balance: 101000,
    description: 'Referral bonus from User E',
    status: 'completed',
    createdAt: '2024-04-01T10:00:00Z',
    relatedId: 'user-5',
  },
  {
    id: 'txn-14',
    userId: 'user-4',
    type: 'credit',
    category: 'deposit',
    amount: 30000,
    balance: 30000,
    description: 'Initial deposit',
    status: 'completed',
    createdAt: '2024-03-15T10:00:00Z',
  },
  {
    id: 'txn-15',
    userId: 'user-4',
    type: 'debit',
    category: 'investment',
    amount: 15000,
    balance: 15000,
    description: 'Investment in High Risk plan',
    status: 'completed',
    createdAt: '2024-03-20T00:00:00Z',
    relatedId: 'inv-3',
  },
  {
    id: 'txn-16',
    userId: 'user-5',
    type: 'credit',
    category: 'deposit',
    amount: 20000,
    balance: 20000,
    description: 'Initial deposit',
    status: 'completed',
    createdAt: '2024-04-01T09:00:00Z',
  },
  {
    id: 'txn-17',
    userId: 'user-5',
    type: 'debit',
    category: 'investment',
    amount: 8000,
    balance: 12000,
    description: 'Investment in Moderate Risk plan',
    status: 'completed',
    createdAt: '2024-04-05T00:00:00Z',
    relatedId: 'inv-4',
  },
];

// Helper function to get user wallet balance
export function getUserWalletBalance(userId: string): number {
  const transactions = mockWalletTransactions
    .filter(txn => txn.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  return transactions.length > 0 ? transactions[0].balance : 0;
}

// Helper function to get user wallet transactions
export function getUserWalletTransactions(userId: string): WalletTransaction[] {
  return mockWalletTransactions
    .filter(txn => txn.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Withdrawal Request Interface
export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  method: 'online' | 'physical';
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestedAt: string;
  approvedAt?: string;
  approvedBy?: string; // Referrer ID
  bankDetails?: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountType: 'savings' | 'current';
  };
  transactionProof?: string; // URL or base64 of screenshot
  transactionReference?: string; // UTR number
  remarks?: string;
}

// Mock withdrawal requests
export const mockWithdrawalRequests: WithdrawalRequest[] = [
  {
    id: 'wd-1',
    userId: 'user-2',
    amount: 2500,
    method: 'online',
    status: 'approved',
    requestedAt: '2024-10-15T10:30:00Z',
    approvedAt: '2024-10-15T11:15:00Z',
    approvedBy: 'user-1',
    bankDetails: {
      accountHolderName: 'User B',
      bankName: 'HDFC Bank',
      accountNumber: '12345678901234',
      ifscCode: 'HDFC0001234',
      accountType: 'savings',
    },
    transactionReference: 'UTR123456789',
    remarks: 'First withdrawal',
  },
  {
    id: 'wd-2',
    userId: 'user-3',
    amount: 1500,
    method: 'physical',
    status: 'completed',
    requestedAt: '2024-10-20T14:00:00Z',
    approvedAt: '2024-10-20T16:30:00Z',
    approvedBy: 'user-2',
  },
  {
    id: 'wd-3',
    userId: 'user-1',
    amount: 5000,
    method: 'online',
    status: 'pending',
    requestedAt: '2024-11-01T09:00:00Z',
    bankDetails: {
      accountHolderName: 'User A',
      bankName: 'SBI',
      accountNumber: '98765432109876',
      ifscCode: 'SBIN0001234',
      accountType: 'savings',
    },
    remarks: 'Monthly withdrawal',
  },
];

// Transfer Request Interface
export interface TransferRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  type: 'send' | 'receive';
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestedAt: string;
  completedAt?: string;
  notes?: string;
}

// Mock transfer requests
export const mockTransferRequests: TransferRequest[] = [
  {
    id: 'tr-1',
    fromUserId: 'user-3',
    toUserId: 'user-2',
    amount: 1000,
    type: 'send',
    status: 'completed',
    requestedAt: '2024-10-25T14:30:00Z',
    completedAt: '2024-10-25T15:00:00Z',
    notes: 'Payment for services',
  },
  {
    id: 'tr-2',
    fromUserId: 'user-4',
    toUserId: 'user-1',
    amount: 2000,
    type: 'receive',
    status: 'pending',
    requestedAt: '2024-11-02T10:00:00Z',
    notes: 'Loan repayment',
  },
  {
    id: 'tr-3',
    fromUserId: 'user-2',
    toUserId: 'user-1',
    amount: 1500,
    type: 'send',
    status: 'pending',
    requestedAt: '2024-11-03T11:30:00Z',
  },
  {
    id: 'tr-4',
    fromUserId: 'user-1',
    toUserId: 'user-5',
    amount: 3000,
    type: 'receive',
    status: 'approved',
    requestedAt: '2024-10-28T16:00:00Z',
    completedAt: '2024-10-28T17:00:00Z',
    notes: 'Investment return',
  },
];

// Helper function to get user withdrawal requests
export function getUserWithdrawalRequests(userId: string): WithdrawalRequest[] {
  return mockWithdrawalRequests
    .filter(req => req.userId === userId)
    .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
}

// Helper function to get pending withdrawal requests for referrer
export function getPendingWithdrawalsForReferrer(referrerId: string): WithdrawalRequest[] {
  const directReferrals = getDirectReferrals(referrerId);
  const referralIds = directReferrals.map(u => u.id);
  
  return mockWithdrawalRequests
    .filter(req => referralIds.includes(req.userId) && req.status === 'pending')
    .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
}

// Helper function to calculate available balance for withdrawal
export function getAvailableWithdrawalBalance(userId: string): {
  totalReturns: number;
  availableBalance: number;
  withdrawalPercentage: number;
  canWithdraw: boolean;
  message: string;
} {
  const investments = getUserInvestments(userId);
  const user = getUserById(userId);
  
  if (!user) {
    return {
      totalReturns: 0,
      availableBalance: 0,
      withdrawalPercentage: 0,
      canWithdraw: false,
      message: 'User not found',
    };
  }

  // Calculate total returns from matured investments
  const totalReturns = investments
    .filter(inv => inv.status === 'matured')
    .reduce((sum, inv) => sum + inv.totalReturn, 0);

  // Calculate months since user approval
  const approvalDate = new Date(user.createdAt);
  const now = new Date();
  const monthsSinceApproval = (now.getTime() - approvalDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

  let withdrawalPercentage = 0;
  let message = '';
  let canWithdraw = false;

  if (monthsSinceApproval < 3) {
    withdrawalPercentage = 0;
    message = 'Withdrawals available after 3 months from approval';
    canWithdraw = false;
  } else if (monthsSinceApproval < 6) {
    withdrawalPercentage = 50;
    message = 'You can withdraw up to 50% of your returns';
    canWithdraw = true;
  } else {
    withdrawalPercentage = 100;
    message = 'You can withdraw your full balance';
    canWithdraw = true;
  }

  const availableBalance = (totalReturns * withdrawalPercentage) / 100;

  return {
    totalReturns,
    availableBalance,
    withdrawalPercentage,
    canWithdraw,
    message,
  };
}

// Helper function to get user transfer requests (sent and received)
export function getUserTransferRequests(userId: string): TransferRequest[] {
  return mockTransferRequests
    .filter(req => req.fromUserId === userId || req.toUserId === userId)
    .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
}

// Helper function to get pending transfer requests for user
export function getPendingTransferRequests(userId: string): TransferRequest[] {
  return mockTransferRequests
    .filter(req => 
      (req.toUserId === userId || req.fromUserId === userId) && 
      req.status === 'pending'
    )
    .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
}
