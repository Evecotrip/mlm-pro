'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import {
  TrendingUp, LogOut, Users, DollarSign, Network,
  Plus, Copy, Check, UserCheck, Activity, Wallet, Sparkles, Loader2,
  ArrowUpRight, ShieldCheck, Clock, ChevronRight, Bell,
  Table
} from 'lucide-react';
import {
  mockUsers, mockInvestments, getDirectReferrals,
  getAllDownline, getUserInvestments, User, getUserWalletBalance
} from '@/lib/mockData';
import InvestmentModal from '@/components/InvestmentModal';
import Navbar from '@/components/Navbar';
import { useUserStore } from '@/store/useUserStore';
import { useWalletStore } from '@/store/useWalletStore';
import { getInvestments, Investment } from '@/api/investment-api';
import { getHierarchyStats, HierarchyStats } from '@/api/hierarchy-api';
import { getKYCStatus, KYCStatus, KYCResponse } from '@/api/kyc-api';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loadingInvestments, setLoadingInvestments] = useState(false);
  const [hierarchyStats, setHierarchyStats] = useState<HierarchyStats | null>(null);
  const [kycStatus, setKycStatus] = useState<KYCStatus | null>(null);

  // User store
  const userProfile = useUserStore(state => state.userProfile);
  const userName = useUserStore(state => state.userName);
  const pendingRequestsCount = useUserStore(state => state.pendingRequestsCount);

  // Wallet store
  const balance = useWalletStore(state => state.balance);
  const earnings = useWalletStore(state => state.earnings);
  const statistics = useWalletStore(state => state.statistics);
  const breakdown = useWalletStore(state => state.breakdown);
  const fetchWallet = useWalletStore(state => state.fetchWallet);

  // Mock current user for now - will be replaced with real API call
  const currentUser = mockUsers[0]; // Using mock data temporarily

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push('/login');
    } else {
      setIsCheckingAuth(false);
      // Fetch wallet data if not already loaded
      if (!balance) {
        fetchWallet();
      }
      // Fetch investments
      fetchDashboardInvestments();
      // Fetch hierarchy stats
      fetchHierarchyStats();
      // Fetch KYC status
      fetchKYCStatus();
    }
  }, [isLoaded, user, router]);

  const fetchDashboardInvestments = async () => {
    setLoadingInvestments(true);
    try {
      const response = await getInvestments({
        page: 1,
        limit: 5,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      if (response.success && response.data) {
        setInvestments(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching investments:', error);
    } finally {
      setLoadingInvestments(false);
    }
  };

  const fetchHierarchyStats = async () => {
    try {
      const response = await getHierarchyStats();
      if (response.success && response.data) {
        setHierarchyStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching hierarchy stats:', error);
    }
  };

  const fetchKYCStatus = async () => {
    try {
      const response = await getKYCStatus();
      if (response.success && response.data) {
        setKycStatus(response.data.status);
      }
    } catch (error) {
      console.error('Error fetching KYC status:', error);
    }
  };

  const getKYCStatusDisplay = () => {
    switch (kycStatus) {
      case KYCStatus.APPROVED:
        return { label: 'Verified', color: 'emerald', badge: 'Verified' };
      case KYCStatus.PENDING:
        return { label: 'Pending Review', color: 'yellow', badge: 'Pending' };
      case KYCStatus.REJECTED:
        return { label: 'Rejected', color: 'red', badge: 'Rejected' };
      case KYCStatus.EXPIRED:
        return { label: 'Expired', color: 'orange', badge: 'Expired' };
      case KYCStatus.NOT_SUBMITTED:
      default:
        return { label: 'Not Submitted', color: 'slate', badge: 'Required' };
    }
  };

  if (!isLoaded || isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin relative z-10" />
          </div>
          <p className="text-slate-400 font-medium tracking-wide">Initializing AuramX...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  const directReferrals = getDirectReferrals(currentUser.id);
  const allDownline = getAllDownline(currentUser.id);
  const myInvestments = getUserInvestments(currentUser.id);

  const handleLogout = async () => {
    const { clearUserData } = await import('@/store/useUserStore').then(m => m.useUserStore.getState());
    const { clearWallet } = await import('@/store/useWalletStore').then(m => m.useWalletStore.getState());
    clearUserData();
    clearWallet();
    await signOut();
    router.push('/');
  };

  const copyReferralCode = () => {
    const referralCode = userProfile?.referralCode || currentUser.referralCode;
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Calculate stats from real data
  const availableBalance = parseFloat(balance?.available || '0');
  const totalBalance = parseFloat(balance?.total || '0');
  const investedAmount = parseFloat(balance?.invested || '0');
  const lentAmount = parseFloat(balance?.lent || '0');
  const totalEarnings = parseFloat(earnings?.total || '0');
  const totalInvested = parseFloat(statistics?.totalInvested || '0');
  const referralCode = userProfile?.referralCode || currentUser.referralCode;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-blue-500/30 transition-colors duration-300">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-[4s]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-[6s]"></div>
      </div>

      <Navbar onLogout={handleLogout} />

      <main className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent mb-2">
              Welcome back, {user?.firstName || 'Investor'}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">Here's what's happening with your portfolio today.</p>
          </div>
          <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-full px-4 py-2 shadow-sm dark:shadow-none">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">System Operational</span>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Main Balance Card - Spans 8 cols */}
          <div className="md:col-span-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 shadow-2xl shadow-blue-900/20 group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-blue-100 font-medium mb-1">Total Balance</p>
                  <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                    {totalBalance.toLocaleString('en-IN')} <span className="text-2xl opacity-80">USDT</span>
                  </h2>
                  <div className="flex items-center gap-4 mt-3 text-sm flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="text-blue-200">Available:</span>
                      <span className="font-semibold text-white">{availableBalance.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-blue-200">Invested:</span>
                      <span className="font-semibold text-white">{investedAmount.toLocaleString('en-IN')}</span>
                    </div>
                    {lentAmount > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-blue-200">Lent:</span>
                        <span className="font-semibold text-white">{lentAmount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => router.push('/create-investment')}
                  className="flex-1 bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  New Investment
                </button>
                <button
                  onClick={() => router.push('/wallet')}
                  className="flex-1 bg-blue-800/50 hover:bg-blue-800/70 text-white font-semibold py-3 px-6 rounded-xl transition-all border border-blue-400/30 flex items-center justify-center gap-2"
                >
                  <ArrowUpRight className="w-5 h-5" />
                  Withdraw
                </button>
              </div>
            </div>
          </div>

          {/* Referral Card - Spans 4 cols */}
          <div className="md:col-span-4 relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 shadow-lg dark:shadow-none">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 dark:from-purple-500/10 dark:to-pink-500/10"></div>
            <div className="relative h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-[20px] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-medium mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Referral Program</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Grow your network, multiply your returns.</h3>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-4">
                <p className="text-xs text-slate-500 mb-1">YOUR EXCLUSIVE CODE</p>
                <div className="flex items-center justify-between">
                  <code className="text-xl font-mono font-bold text-purple-600 dark:text-purple-400 tracking-wider">{referralCode}</code>
                  <button
                    onClick={copyReferralCode}
                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    {copiedCode ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Direct Referrals</span>
                <span className="font-bold text-slate-900 dark:text-white">{directReferrals.length} Members</span>
              </div>
            </div>
          </div>

          {/* Stats Row - Spans 12 cols (3x4) */}
          
          <div className="md:col-span-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:border-slate-300 dark:hover:border-slate-700 transition-colors group shadow-sm dark:shadow-none">
          <button onClick={() => router.push("/wallet")}>
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
              </div>
              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 text-xs font-bold px-2 py-1 rounded-full">+12.5%</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Total Earnings</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{totalEarnings.toLocaleString('en-IN')} USDT</h3>
            </button>
          </div>
          

          <div className="md:col-span-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:border-slate-300 dark:hover:border-slate-700 transition-colors group shadow-sm dark:shadow-none">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-orange-500/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Network className="w-6 h-6 text-orange-600 dark:text-orange-500" />
              </div>
              <span className="bg-orange-500/10 text-orange-600 dark:text-orange-500 text-xs font-bold px-2 py-1 rounded-full">Level</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Downline Network Size</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{hierarchyStats?.totalDownline ?? 0} Members</h3>
          </div>

          <div 
            onClick={() => router.push('/kyc')}
            className="md:col-span-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:border-slate-300 dark:hover:border-slate-700 transition-colors group shadow-sm dark:shadow-none cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300 ${
                kycStatus === KYCStatus.APPROVED ? 'bg-emerald-500/10' :
                kycStatus === KYCStatus.PENDING ? 'bg-yellow-500/10' :
                kycStatus === KYCStatus.REJECTED ? 'bg-red-500/10' :
                'bg-purple-500/10'
              }`}>
                <ShieldCheck className={`w-6 h-6 ${
                  kycStatus === KYCStatus.APPROVED ? 'text-emerald-600 dark:text-emerald-500' :
                  kycStatus === KYCStatus.PENDING ? 'text-yellow-600 dark:text-yellow-500' :
                  kycStatus === KYCStatus.REJECTED ? 'text-red-600 dark:text-red-500' :
                  'text-purple-600 dark:text-purple-500'
                }`} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                kycStatus === KYCStatus.APPROVED ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500' :
                kycStatus === KYCStatus.PENDING ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500' :
                kycStatus === KYCStatus.REJECTED ? 'bg-red-500/10 text-red-600 dark:text-red-500' :
                'bg-purple-500/10 text-purple-600 dark:text-purple-500'
              }`}>{getKYCStatusDisplay().badge}</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">KYC Status</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{getKYCStatusDisplay().label}</h3>
          </div>

          {/* Recent Investments List - Spans 8 cols */}
          <div className="md:col-span-8 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Recent Activity
              </h3>
              <button
                onClick={() => router.push('/investment-history')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
              >
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {loadingInvestments ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p>Loading investments...</p>
              </div>
            ) : investments.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/30">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 mb-4">No active investments found</p>
                <button
                  onClick={() => setShowInvestModal(true)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium text-sm"
                >
                  Start Investing Now
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {investments.slice(0, 4).map((inv) => (
                  <div key={inv.id} className="group flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500/30 transition-all hover:shadow-lg hover:shadow-blue-900/5 dark:hover:shadow-blue-900/10">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${inv.profile === 'DIAMOND' ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-500' :
                        inv.profile === 'GOLD' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500' :
                          inv.profile === 'SILVER' ? 'bg-slate-400/10 text-slate-600 dark:text-slate-400' :
                            'bg-orange-500/10 text-orange-600 dark:text-orange-500'
                        }`}>
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{inv.amount} USDT</h4>
                        <p className="text-xs text-slate-500 capitalize">{inv.profile.toLowerCase()} Plan • {inv.lockInMonths} Months</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${inv.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-500/20' :
                        inv.status === 'PENDING_APPROVAL' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20' :
                          'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}>
                        {inv.status.replace('_', ' ')}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(inv.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Network Tree Preview - Spans 4 cols */}
          <div className="md:col-span-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-sm dark:shadow-none">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Network Tree</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">Visualize your downline structure and performance.</p>

              <div className="relative h-48 w-full bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-6 flex items-center justify-center group cursor-pointer" onClick={() => router.push('/hierarchy-flow')}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 dark:from-blue-900/20 to-transparent opacity-50"></div>
                {/* Simulated Tree Nodes */}
                <div className="relative z-10 flex flex-col items-center gap-4 transform group-hover:scale-105 transition-transform duration-500">
                  <div className="w-10 h-10 rounded-full bg-blue-600 border-4 border-white dark:border-slate-950 shadow-xl z-20"></div>
                  <div className="flex gap-8">
                    <div className="w-8 h-8 rounded-full bg-slate-400 dark:bg-slate-700 border-4 border-white dark:border-slate-950 z-10"></div>
                    <div className="w-8 h-8 rounded-full bg-slate-400 dark:bg-slate-700 border-4 border-white dark:border-slate-950 z-10"></div>
                    <div className="w-8 h-8 rounded-full bg-slate-400 dark:bg-slate-700 border-4 border-white dark:border-slate-950 z-10"></div>
                  </div>
                  {/* Connecting Lines (Simulated) */}
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 w-32 h-8 border-t-2 border-l-2 border-r-2 border-slate-300 dark:border-slate-800 rounded-t-2xl -z-0"></div>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push('/hierarchy-flow')}
              className="w-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Network className="w-5 h-5" />
              Explore Network Tree
            </button>
            <button
              onClick={() => router.push('/hierarchy-table')}
              className="w-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Table className="w-5 h-5" />
              View Network Table
            </button>
          </div>

        </div>
      </main>

      {/* Enhanced Investment Modal */}
      {showInvestModal && (
        <InvestmentModal
          currentUser={currentUser}
          onClose={() => setShowInvestModal(false)}
          onSuccess={() => {
            setShowInvestModal(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}