'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import {
  TrendingUp, LogOut, Users, DollarSign, Network,
  Plus, Copy, Check, UserCheck, Activity, Wallet, Sparkles, Loader2,
  ArrowUpRight, ShieldCheck, Clock, ChevronRight, Bell,
  Table, TrendingDown, Award, Target
} from 'lucide-react';
import { mockUsers } from '@/lib/mockData';
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
        console.log('Investments data:', response.data);
        console.log('Investments count:', response.data.data?.length);

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
        return { label: 'Verified', color: 'emerald', badge: 'Verified', icon: ShieldCheck };
      case KYCStatus.PENDING:
        return { label: 'Pending Review', color: 'yellow', badge: 'Pending', icon: Clock };
      case KYCStatus.REJECTED:
        return { label: 'Rejected', color: 'red', badge: 'Rejected', icon: ShieldCheck };
      case KYCStatus.EXPIRED:
        return { label: 'Expired', color: 'orange', badge: 'Expired', icon: Clock };
      case KYCStatus.NOT_SUBMITTED:
      default:
        return { label: 'Not Submitted', color: 'slate', badge: 'Required', icon: ShieldCheck };
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
          <p className="text-slate-400 font-medium tracking-wide">Initializing AurumX...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  
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

  const kycDisplay = getKYCStatusDisplay();
  const KYCIcon = kycDisplay.icon;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-blue-500/30 transition-colors duration-300">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-[4s]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-[6s]"></div>
      </div>

      <Navbar onLogout={handleLogout} />

      <main className="relative z-10 container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent mb-1">
              Welcome back, {user?.firstName || 'Investor'}
            </h1>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">Here's your portfolio overview</p>
          </div>
          <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-full px-4 py-2 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs md:text-sm font-medium text-slate-600 dark:text-slate-300">System Operational</span>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">

          {/* LEFT COLUMN - Balance & Quick Actions (lg:8 cols) */}
          <div className="lg:col-span-8 space-y-4 md:space-y-6">
            
            {/* Main Balance Card */}
            <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-6 md:p-8 shadow-2xl shadow-blue-900/20 group">
              <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-white/10 rounded-full -mr-12 md:-mr-16 -mt-12 md:-mt-16 blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <p className="text-blue-100 font-medium mb-2 text-sm md:text-base">Total Balance</p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3">
                      ₹{totalBalance.toLocaleString('en-IN')}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm">
                      <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <Wallet className="w-3.5 h-3.5 text-blue-200" />
                        <span className="text-blue-200">Available:</span>
                        <span className="font-semibold text-white">₹{availableBalance.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <TrendingUp className="w-3.5 h-3.5 text-blue-200" />
                        <span className="text-blue-200">Invested:</span>
                        <span className="font-semibold text-white">₹{investedAmount.toLocaleString('en-IN')}</span>
                      </div>
                      {lentAmount > 0 && (
                        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                          <ArrowUpRight className="w-3.5 h-3.5 text-blue-200" />
                          <span className="text-blue-200">Lent:</span>
                          <span className="font-semibold text-white">₹{lentAmount.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md p-3 md:p-4 rounded-2xl">
                    <Wallet className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <button
                    onClick={() => router.push('/create-investment')}
                    className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 md:py-3.5 px-4 md:px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden sm:inline">New Investment</span>
                    <span className="sm:hidden">Invest</span>
                  </button>
                  <button
                    onClick={() => router.push('/wallet')}
                    className="bg-blue-800/50 hover:bg-blue-800/70 text-white font-semibold py-3 md:py-3.5 px-4 md:px-6 rounded-xl transition-all border border-blue-400/30 flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
                    Withdraw
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Row - 3 Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Total Earnings */}
              <button 
                onClick={() => router.push("/wallet")} 
                className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all group shadow-sm hover:shadow-md text-left w-full"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 bg-emerald-500/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 dark:text-emerald-500" />
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 text-xs font-bold px-2 py-0.5 rounded-full">+12.5%</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">Total Earnings</p>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">₹{totalEarnings.toLocaleString('en-IN')}</h3>
              </button>

              {/* Active Investments */}
              <button
                onClick={() => router.push('/investment-history')}
                className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all group shadow-sm hover:shadow-md text-left w-full"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 bg-blue-500/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-500" />
                  </div>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">Active Investments</p>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{investments.filter(i => i.status === 'ACTIVE').length}</h3>
              </button>

              {/* Network Size */}
              <button
                onClick={() => router.push('/hierarchy-table')}
                className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all group shadow-sm hover:shadow-md text-left w-full"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 bg-purple-500/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-500" />
                  </div>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">Network Size</p>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{hierarchyStats?.totalDownline ?? 0}</h3>
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  Recent Activity
                </h3>
                <button
                  onClick={() => router.push('/investment-history')}
                  className="text-xs md:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {loadingInvestments ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                  <Loader2 className="w-8 h-8 animate-spin mb-2" />
                  <p className="text-sm">Loading investments...</p>
                </div>
              ) : investments.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/30">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">No active investments found</p>
                  <button
                    onClick={() => router.push('/create-investment')}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium text-sm inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Start Investing Now
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {investments.slice(0, 4).map((inv) => (
                    <div key={inv.id} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 hover:border-blue-500/30 transition-all hover:shadow-md">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          inv.profile === 'DIAMOND' ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-500' :
                          inv.profile === 'GOLD' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500' :
                          inv.profile === 'SILVER' ? 'bg-slate-400/10 text-slate-600 dark:text-slate-400' :
                          'bg-orange-500/10 text-orange-600 dark:text-orange-500'
                        }`}>
                          <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">₹{parseFloat(inv.amount).toLocaleString('en-IN')}</h4>
                          <p className="text-xs text-slate-500 capitalize">{inv.profile.toLowerCase()} Plan • {inv.lockInMonths} Months</p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          inv.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-500/20' :
                          inv.status === 'PENDING_APPROVAL' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20' :
                          'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}>
                          {inv.status.replace('_', ' ')}
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(inv.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - KYC, Referral & Network (lg:4 cols) */}
          <div className="lg:col-span-4 space-y-4 md:space-y-6">
            
            {/* KYC Status Card */}
            <div 
              onClick={() => router.push('/kyc')}
              className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 hover:border-slate-300 dark:hover:border-slate-700 transition-all group shadow-sm hover:shadow-md cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 ${
                  kycStatus === KYCStatus.APPROVED ? 'bg-emerald-500/10' :
                  kycStatus === KYCStatus.PENDING ? 'bg-yellow-500/10' :
                  kycStatus === KYCStatus.REJECTED ? 'bg-red-500/10' :
                  'bg-purple-500/10'
                }`}>
                  <KYCIcon className={`w-6 h-6 ${
                    kycStatus === KYCStatus.APPROVED ? 'text-emerald-600 dark:text-emerald-500' :
                    kycStatus === KYCStatus.PENDING ? 'text-yellow-600 dark:text-yellow-500' :
                    kycStatus === KYCStatus.REJECTED ? 'text-red-600 dark:text-red-500' :
                    'text-purple-600 dark:text-purple-500'
                  }`} />
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  kycStatus === KYCStatus.APPROVED ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500' :
                  kycStatus === KYCStatus.PENDING ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500' :
                  kycStatus === KYCStatus.REJECTED ? 'bg-red-500/10 text-red-600 dark:text-red-500' :
                  'bg-purple-500/10 text-purple-600 dark:text-purple-500'
                }`}>
                  {kycDisplay.badge}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">KYC Status</p>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">{kycDisplay.label}</h3>
              {kycStatus !== KYCStatus.APPROVED && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {kycStatus === KYCStatus.NOT_SUBMITTED && 'Complete KYC to unlock full features'}
                  {kycStatus === KYCStatus.PENDING && 'Your documents are under review'}
                  {kycStatus === KYCStatus.REJECTED && 'Please resubmit your documents'}
                  {kycStatus === KYCStatus.EXPIRED && 'Your KYC has expired, please renew'}
                </p>
              )}
              <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-medium mt-3">
                <span>Manage KYC</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Referral Card */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-900/50 rounded-2xl p-5 md:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Referral Program</span>
                </div>
                <span className="text-xs text-slate-500 bg-white/50 dark:bg-slate-900/50 px-2 py-1 rounded-full">
                  {hierarchyStats?.directReferrals ?? 0} Members
                </span>
              </div>

              <div className="bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm border border-purple-200 dark:border-purple-900/50 rounded-xl p-4 mb-4">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Your Referral Code</p>
                <div className="flex items-center justify-between gap-3">
                  <code className="text-lg md:text-xl font-mono font-bold text-purple-600 dark:text-purple-400 tracking-wider">{referralCode}</code>
                  <button
                    onClick={copyReferralCode}
                    className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors flex-shrink-0"
                  >
                    {copiedCode ? 
                      <Check className="w-5 h-5 text-emerald-500" /> : 
                      <Copy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    }
                  </button>
                </div>
              </div>

              <button
                onClick={() => router.push('/hierarchy-table')}
                className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-purple-500/20"
              >
                <Users className="w-4 h-4" />
                View My Network
              </button>
            </div>

            {/* Network Visualization */}
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
              <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2">Network Tree</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm mb-5">Visualize your downline structure</p>

              <div 
                className="relative h-40 md:h-48 w-full bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-4 flex items-center justify-center group cursor-pointer hover:border-blue-500/50 transition-all" 
                onClick={() => router.push('/hierarchy-flow')}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 dark:from-blue-900/20 to-transparent opacity-50"></div>
                {/* Simulated Tree Nodes */}
                <div className="relative z-10 flex flex-col items-center gap-4 transform group-hover:scale-105 transition-transform duration-500">
                  <div className="w-10 h-10 rounded-full bg-blue-600 border-4 border-white dark:border-slate-950 shadow-xl z-20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex gap-6 md:gap-8">
                    <div className="w-7 h-7 rounded-full bg-slate-400 dark:bg-slate-700 border-4 border-white dark:border-slate-950 z-10"></div>
                    <div className="w-7 h-7 rounded-full bg-slate-400 dark:bg-slate-700 border-4 border-white dark:border-slate-950 z-10"></div>
                    <div className="w-7 h-7 rounded-full bg-slate-400 dark:bg-slate-700 border-4 border-white dark:border-slate-950 z-10"></div>
                  </div>
                  {/* Connecting Lines */}
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 md:w-32 h-8 border-t-2 border-l-2 border-r-2 border-slate-300 dark:border-slate-800 rounded-t-2xl -z-0"></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => router.push('/hierarchy-flow')}
                  className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium py-2.5 px-3 rounded-lg transition-all flex items-center justify-center gap-2 text-xs md:text-sm"
                >
                  <Network className="w-4 h-4" />
                  <span className="hidden sm:inline">Tree View</span>
                  <span className="sm:hidden">Tree</span>
                </button>
                <button
                  onClick={() => router.push('/hierarchy-table')}
                  className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium py-2.5 px-3 rounded-lg transition-all flex items-center justify-center gap-2 text-xs md:text-sm"
                >
                  <Table className="w-4 h-4" />
                  <span className="hidden sm:inline">Table View</span>
                  <span className="sm:hidden">Table</span>
                </button>
              </div>
            </div>
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
            fetchDashboardInvestments();
            fetchWallet();
          }}
        />
      )}
    </div>
  );
}