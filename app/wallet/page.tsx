'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Calendar,
  Filter,
  Download,
  Plus,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  ArrowLeftRight,
  Loader2,
  Search,
  MoreHorizontal,
  FileText,
  TrendingUp,
  TrendingDown,
  Award,
  Users,
  Lock
} from 'lucide-react';
import TransferForm from '@/components/TransferForm';
import WithdrawalForm from '@/components/WithdrawalForm';
import Navbar from '@/components/Navbar';
import { useWalletStore } from '@/store/useWalletStore';
import { TransactionType } from '@/types';
import { getMyCommissions, getMyCommissionStats, Commission, CommissionStats, CommissionType } from '@/api/commission-api';

export default function WalletPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  // Wallet store
  const balance = useWalletStore(state => state.balance);
  const earnings = useWalletStore(state => state.earnings);
  const statistics = useWalletStore(state => state.statistics);
  const breakdown = useWalletStore(state => state.breakdown);
  const transactions = useWalletStore(state => state.transactions);
  const balanceLogs = useWalletStore(state => state.balanceLogs);
  const isLoadingWallet = useWalletStore(state => state.isLoadingWallet);
  const isLoadingBalanceLogs = useWalletStore(state => state.isLoadingBalanceLogs);
  const fetchWallet = useWalletStore(state => state.fetchWallet);
  const fetchTransactions = useWalletStore(state => state.fetchTransactions);
  const fetchBalanceLogs = useWalletStore(state => state.fetchBalanceLogs);

  const [activeTab, setActiveTab] = useState<'transactions' | 'logs' | 'commissions'>('transactions');
  const [filter, setFilter] = useState<string>('all');
  const [logFilter, setLogFilter] = useState<'all' | 'CREDIT' | 'DEBIT' | 'LOCK'>('all');
  const [commissionFilter, setCommissionFilter] = useState<'all' | CommissionType>('all');
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  
  // Commission state
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [commissionStats, setCommissionStats] = useState<CommissionStats | null>(null);
  const [isLoadingCommissions, setIsLoadingCommissions] = useState(false);
  
  // Ref to track if data has been fetched
  const hasFetchedData = useRef(false);

  // Check authentication
  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push('/login');
    }
  }, [isLoaded, user, router]);

  // Fetch wallet data once on mount
  useEffect(() => {
    if (!user?.id || hasFetchedData.current) return;
    
    hasFetchedData.current = true;
    
    // Fetch wallet data from store
    fetchWallet();
    fetchTransactions(1, 50);
    fetchBalanceLogs(1, 50);
    
    // Fetch commissions
    (async () => {
      setIsLoadingCommissions(true);
      try {
        const [commissionsRes, statsRes] = await Promise.all([
          getMyCommissions({ page: 1, limit: 50 }),
          getMyCommissionStats()
        ]);
        
        if (commissionsRes.success && commissionsRes.data) {
          setCommissions(commissionsRes.data);
        }
        if (statsRes.success && statsRes.data) {
          setCommissionStats(statsRes.data);
        }
      } catch (error) {
        console.error('Error fetching commissions:', error);
      } finally {
        setIsLoadingCommissions(false);
      }
    })();
    
    return () => {
      // Cleanup: reset ref when component unmounts
      hasFetchedData.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (!isLoaded || (isLoadingWallet && !balance)) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading wallet...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const filteredTransactions = (transactions || []).filter(txn => {
    if (filter === 'all') return true;
    return txn.type === filter;
  });

  const availableBalance = parseFloat(balance?.available || '0');
  const totalCredit = (transactions || [])
    .filter(t => t.direction === 'RECEIVED')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalDebit = (transactions || [])
    .filter(t => t.direction === 'SENT')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const getTypeIcon = (type: TransactionType) => {
    switch (type) {
      case 'ADD_MONEY': return <Plus className="w-4 h-4" />;
      case 'WITHDRAWAL': return <ArrowUpRight className="w-4 h-4" />;
      case 'INVESTMENT': return <CreditCard className="w-4 h-4" />;
      case 'MATURITY_PAYOUT': return <ArrowDownRight className="w-4 h-4" />;
      case 'REFERRAL_BONUS':
      case 'BONUS':
      case 'COMMISSION': return <CreditCard className="w-4 h-4" />;
      case 'TRANSFER_IN':
      case 'TRANSFER_OUT': return <ArrowLeftRight className="w-4 h-4" />;
      default: return <Wallet className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'PENDING': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'FAILED': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const handleLogout = async () => {
    const { clearWallet } = await import('@/store/useWalletStore').then(m => m.useWalletStore.getState());
    const { clearUserData } = await import('@/store/useUserStore').then(m => m.useUserStore.getState());
    clearWallet();
    clearUserData();
    await signOut();
    router.push('/');
  };

  const isCredit = (direction: 'SENT' | 'RECEIVED') => {
    return direction === 'RECEIVED';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-blue-500/30 transition-colors duration-300">
      <Navbar onLogout={handleLogout} showWalletButton={false} />

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left Column: Balance Card & Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Balance Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-purple-700 p-8 shadow-2xl border border-white/10 group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-blue-100 text-sm font-medium mb-1">Total Balance</p>
                    <h2 className="text-4xl font-bold text-white tracking-tight">{availableBalance.toLocaleString('en-IN')} <span className="text-lg opacity-70">USDT</span></h2>
                  </div>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="space-y-1 mb-8">
                  <div className="flex justify-between text-sm text-blue-100/80">
                    <span>Total Earnings</span>
                    <span className="font-medium text-white">{parseFloat(earnings?.total || '0').toLocaleString('en-IN')} USDT</span>
                  </div>
                  <div className="flex justify-between text-sm text-blue-100/80">
                    <span>Total Invested</span>
                    <span className="font-medium text-white">{parseFloat(statistics?.totalInvested || '0').toLocaleString('en-IN')} USDT</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => router.push('/add-money')}
                    className="flex-1 bg-white text-blue-600 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg"
                  >
                    Add Money
                  </button>
                  <button
                    onClick={() => router.push('/withdrawals')}
                    className="flex-1 bg-blue-800/50 backdrop-blur-md text-white border border-blue-400/30 py-3 rounded-xl font-bold text-sm hover:bg-blue-800/70 transition-colors"
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-none">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-3">
                  <ArrowDownRight className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">Total Credit</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{totalCredit.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-none">
                <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center mb-3">
                  <ArrowUpRight className="w-5 h-5 text-red-600 dark:text-red-500" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">Total Debit</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{totalDebit.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Wallet Breakdown */}
            {breakdown && (
              <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-none">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Wallet Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-xs text-slate-600 dark:text-slate-400">In Wallet</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{parseFloat(breakdown.inWallet).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <span className="text-xs text-slate-600 dark:text-slate-400">In Investments</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{parseFloat(breakdown.inInvestments).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      <span className="text-xs text-slate-600 dark:text-slate-400">Lent Out</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{parseFloat(breakdown.lentOut).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Total</span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{parseFloat(breakdown.total).toLocaleString('en-IN')} USDT</span>
                  </div>
                </div>
              </div>
            )}

            {/* Transfer Action */}
            <button
              onClick={() => setShowTransferForm(true)}
              className="w-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between group hover:border-blue-500/50 transition-all shadow-sm dark:shadow-none"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <ArrowLeftRight className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900 dark:text-white">Internal Transfer</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Send to another user</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </button>
          </div>

          {/* Right Column: Transactions & Balance Logs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 min-h-[600px] shadow-sm dark:shadow-none">
              {/* Tab Navigation */}
              <div className="flex items-center gap-4 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
                <button
                  onClick={() => setActiveTab('transactions')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'transactions'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Transactions
                </button>
                <button
                  onClick={() => setActiveTab('logs')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'logs'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                  <FileText className="w-4 h-4" />
                  Balance Logs
                </button>
                <button
                  onClick={() => setActiveTab('commissions')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'commissions'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                  <Award className="w-4 h-4" />
                  Commissions
                </button>
              </div>

              {/* Transactions Tab */}
              {activeTab === 'transactions' && (
                <>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Transactions</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Recent activity on your wallet</p>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 rounded-xl p-1 border border-slate-200 dark:border-slate-800">
                      {['all', 'COMMISSION', 'INVESTMENT', 'WITHDRAWAL'].map((f) => (
                        <button
                          key={f}
                          onClick={() => setFilter(f)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f
                            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                          {f === 'all' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {filteredTransactions.length === 0 ? (
                      <div className="text-center py-20">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Search className="w-8 h-8 text-slate-400 dark:text-slate-600" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">No transactions found</p>
                      </div>
                    ) : (
                      filteredTransactions.map((txn) => (
                        <div
                          key={txn.id}
                          className="group flex items-center justify-between p-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isCredit(txn.direction) ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500' : 'bg-red-500/10 text-red-600 dark:text-red-500'
                              }`}>
                              {getTypeIcon(txn.type)}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-0.5">
                                {txn.description || txn.type.replace(/_/g, ' ')}
                              </h4>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-slate-500">{formatDate(txn.createdAt)}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getStatusColor(txn.status)}`}>
                                  {txn.status}
                                </span>
                                {txn.direction === 'SENT' && txn.receiver && (
                                  <span className="text-xs text-slate-500">To: {txn.receiver.firstName} {txn.receiver.lastName}</span>
                                )}
                                {txn.direction === 'RECEIVED' && txn.sender && (
                                  <span className="text-xs text-slate-500">From: {txn.sender.firstName} {txn.sender.lastName}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${isCredit(txn.direction) ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                              {isCredit(txn.direction) ? '+' : '-'}{parseFloat(txn.amount).toLocaleString('en-IN')}
                            </p>
                            <p className="text-xs text-slate-500">USDT</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}

              {/* Balance Logs Tab */}
              {activeTab === 'logs' && (
                <>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Balance Logs</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Detailed balance change history</p>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 rounded-xl p-1 border border-slate-200 dark:border-slate-800">
                      {['all', 'CREDIT', 'DEBIT', 'LOCK'].map((f) => (
                        <button
                          key={f}
                          onClick={() => setLogFilter(f as 'all' | 'CREDIT' | 'DEBIT' | 'LOCK')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${logFilter === f
                            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                          {f.charAt(0) + f.slice(1).toLowerCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {isLoadingBalanceLogs ? (
                      <div className="text-center py-20">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
                        <p className="text-slate-500 dark:text-slate-400">Loading balance logs...</p>
                      </div>
                    ) : (
                      (balanceLogs || []).filter(log => logFilter === 'all' || log.operation === logFilter).length === 0 ? (
                        <div className="text-center py-20">
                          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-slate-400 dark:text-slate-600" />
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 font-medium">No balance logs found</p>
                        </div>
                      ) : (
                        (balanceLogs || []).filter(log => logFilter === 'all' || log.operation === logFilter).map((log) => (
                          <div
                            key={log.id}
                            className="group p-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                  log.operation === 'CREDIT' 
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500' 
                                    : log.operation === 'LOCK'
                                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-500'
                                    : 'bg-red-500/10 text-red-600 dark:text-red-500'
                                  }`}>
                                  {log.operation === 'CREDIT' ? <TrendingUp className="w-5 h-5" /> : log.operation === 'LOCK' ? <Lock className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${log.operation === 'CREDIT'
                                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20'
                                        : log.operation === 'LOCK'
                                        ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20'
                                        : 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/10 border-red-200 dark:border-red-500/20'
                                      }`}>
                                      {log.operation}
                                    </span>
                                    <span className="text-xs text-slate-500">{formatDate(log.createdAt)}</span>
                                  </div>
                                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                                    {log.description || 'Balance adjustment'}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`font-bold text-lg ${
                                  log.operation === 'CREDIT' 
                                    ? 'text-emerald-600 dark:text-emerald-400' 
                                    : log.operation === 'LOCK'
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-red-600 dark:text-red-400'
                                  }`}>
                                  {log.operation === 'CREDIT' ? '+' : log.operation === 'LOCK' ? '🔒 ' : '-'}{Math.abs(parseFloat(log.amount)).toLocaleString('en-IN')}
                                </p>
                                <p className="text-xs text-slate-500">USDT</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
                              <div className="flex items-center gap-4 text-xs">
                                <div>
                                  <span className="text-slate-500">Previous: </span>
                                  <span className="text-slate-700 dark:text-slate-300 font-medium">{parseFloat(log.previousBalance).toLocaleString('en-IN')}</span>
                                </div>
                                <ArrowRight className="w-3 h-3 text-slate-400 dark:text-slate-600" />
                                <div>
                                  <span className="text-slate-500">New: </span>
                                  <span className="text-slate-900 dark:text-white font-bold">{parseFloat(log.newBalance).toLocaleString('en-IN')}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )
                    )}
                  </div>
                </>
              )}

              {/* Commissions Tab */}
              {activeTab === 'commissions' && (
                <>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Commissions</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Your referral and profit commissions</p>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 rounded-xl p-1 border border-slate-200 dark:border-slate-800">
                      {['all', 'REFERRAL_BONUS', 'PROFIT_DISTRIBUTION'].map((f) => (
                        <button
                          key={f}
                          onClick={() => setCommissionFilter(f as any)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${commissionFilter === f
                            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                          {f === 'all' ? 'All' : f === 'REFERRAL_BONUS' ? 'Referral' : 'Profit'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Commission Stats Cards */}
                  {commissionStats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-4">
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Total Earned</p>
                        <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{parseFloat(commissionStats.totalEarned).toLocaleString('en-IN')}</p>
                      </div>
                      <div className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-xl p-4">
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 mb-1">Pending</p>
                        <p className="text-lg font-bold text-yellow-700 dark:text-yellow-400">{parseFloat(commissionStats.totalPending).toLocaleString('en-IN')}</p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4">
                        <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Locked</p>
                        <p className="text-lg font-bold text-blue-700 dark:text-blue-400">{parseFloat(commissionStats.totalLocked).toLocaleString('en-IN')}</p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-xl p-4">
                        <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">Referral Bonus</p>
                        <p className="text-lg font-bold text-purple-700 dark:text-purple-400">{parseFloat(commissionStats.referralBonusTotal).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {isLoadingCommissions ? (
                      <div className="text-center py-20">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
                        <p className="text-slate-500 dark:text-slate-400">Loading commissions...</p>
                      </div>
                    ) : (
                      commissions.filter(comm => commissionFilter === 'all' || comm.type === commissionFilter).length === 0 ? (
                        <div className="text-center py-20">
                          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Award className="w-8 h-8 text-slate-400 dark:text-slate-600" />
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 font-medium">No commissions found</p>
                        </div>
                      ) : (
                        commissions.filter(comm => commissionFilter === 'all' || comm.type === commissionFilter).map((commission) => (
                          <div
                            key={commission.id}
                            className="group p-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${commission.type === 'REFERRAL_BONUS' ? 'bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400' : 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                  }`}>
                                  {commission.type === 'REFERRAL_BONUS' ? <Users className="w-5 h-5" /> : <Award className="w-5 h-5" />}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${commission.type === 'REFERRAL_BONUS'
                                        ? 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20'
                                        : 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20'
                                      }`}>
                                      {commission.type === 'REFERRAL_BONUS' ? 'Referral Bonus' : 'Profit Distribution'}
                                    </span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${commission.status === 'COMPLETED'
                                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20'
                                        : commission.status === 'PENDING'
                                          ? 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20'
                                          : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-500/10 border-slate-200 dark:border-slate-500/20'
                                      }`}>
                                      {commission.status}
                                    </span>
                                    <span className="text-xs text-slate-500">Level {commission.level}</span>
                                  </div>
                                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-1">
                                    From: <span className="font-medium text-slate-900 dark:text-white">{commission.sourceUser.firstName} {commission.sourceUser.lastName}</span>
                                  </p>
                                  <p className="text-xs text-slate-500">{formatDate(commission.createdAt)}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                                  +{parseFloat(commission.amount).toLocaleString('en-IN')}
                                </p>
                                <p className="text-xs text-slate-500">USDT</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Transfer Form Modal */}
      {showTransferForm && (
        <TransferForm
          onClose={() => setShowTransferForm(false)}
          //currentUser={{ id: user.id, name: user.fullName || 'User' } as any}
          //currentBalance={availableBalance}
        />
      )}

      {/* Withdrawal Form Modal */}
      {showWithdrawalForm && (
        <WithdrawalForm
          onClose={() => setShowWithdrawalForm(false)}
          currentUser={{ id: user.id, name: user.fullName || 'User' } as any}
        />
      )}
    </div>
  );
}
