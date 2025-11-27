'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import { 
  Wallet, 
  ArrowLeft, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar,
  Filter,
  Download,
  Plus,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  ArrowLeftRight,
  Loader2
} from 'lucide-react';
import TransferForm from '@/components/TransferForm';
import WithdrawalForm from '@/components/WithdrawalForm';
import Navbar from '@/components/Navbar';
import { useWalletStore } from '@/store/useWalletStore';
import { TransactionType, TransactionStatus } from '@/types';

export default function WalletPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  
  // Wallet store
  const balance = useWalletStore(state => state.balance);
  const earnings = useWalletStore(state => state.earnings);
  const statistics = useWalletStore(state => state.statistics);
  const transactions = useWalletStore(state => state.transactions);
  const isLoadingWallet = useWalletStore(state => state.isLoadingWallet);
  const isLoadingTransactions = useWalletStore(state => state.isLoadingTransactions);
  const fetchWallet = useWalletStore(state => state.fetchWallet);
  const fetchTransactions = useWalletStore(state => state.fetchTransactions);
  
  const [filter, setFilter] = useState<string>('all');
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push('/login');
    }
  }, [isLoaded, user, router]);

  // Fetch wallet data
  useEffect(() => {
    if (user?.id) {
      fetchWallet();
      fetchTransactions(1, 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (!isLoaded || isLoadingWallet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading wallet...</p>
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
  const totalEarnings = parseFloat(earnings?.total || '0');
  const totalInvested = parseFloat(statistics?.totalInvested || '0');

  const getTypeIcon = (type: TransactionType) => {
    switch (type) {
      case 'ADD_MONEY':
        return <Plus className="w-4 h-4" />;
      case 'WITHDRAWAL':
        return <ArrowUpRight className="w-4 h-4" />;
      case 'INVESTMENT':
        return <TrendingUp className="w-4 h-4" />;
      case 'MATURITY_PAYOUT':
        return <ArrowDownRight className="w-4 h-4" />;
      case 'REFERRAL_BONUS':
      case 'BONUS':
        return <CreditCard className="w-4 h-4" />;
      case 'COMMISSION':
        return <CreditCard className="w-4 h-4" />;
      case 'TRANSFER_IN':
      case 'TRANSFER_OUT':
        return <ArrowLeftRight className="w-4 h-4" />;
      default:
        return <Wallet className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: TransactionType) => {
    switch (type) {
      case 'ADD_MONEY':
        return 'bg-green-100 text-green-700';
      case 'WITHDRAWAL':
        return 'bg-orange-100 text-orange-700';
      case 'INVESTMENT':
        return 'bg-blue-100 text-blue-700';
      case 'MATURITY_PAYOUT':
        return 'bg-purple-100 text-purple-700';
      case 'REFERRAL_BONUS':
      case 'BONUS':
      case 'COMMISSION':
        return 'bg-pink-100 text-pink-700';
      case 'TRANSFER_IN':
      case 'TRANSFER_OUT':
        return 'bg-indigo-100 text-indigo-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const isCredit = (type: TransactionType) => {
    return ['ADD_MONEY', 'TRANSFER_IN', 'COMMISSION', 'BONUS', 'REFERRAL_BONUS', 'MATURITY_PAYOUT'].includes(type);
  };

  const totalCredit = (transactions || [])
    .filter(t => isCredit(t.type))
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
  const totalDebit = (transactions || [])
    .filter(t => !isCredit(t.type))
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Navbar */}
      <Navbar
        onLogout={handleLogout}
        showWalletButton={false}
      />

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-6 sm:p-8 mb-6 sm:mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-blue-100 text-sm mb-1">Available Balance</p>
                <h2 className="text-3xl sm:text-4xl font-bold">{availableBalance.toLocaleString('en-IN')} USDT</h2>
                <p className="text-blue-200 text-xs mt-1">Total: {parseFloat(balance?.total || '0').toLocaleString('en-IN')} USDT</p>
              </div>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowTransferForm(true)}
                className="flex-1 bg-white text-blue-600 px-4 py-2.5 rounded-xl font-semibold hover:bg-blue-50 transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span>Transfer</span>
              </button>
              <button 
                onClick={() => router.push('/add-money')}
                className="flex-1 bg-white/20 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-white/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span className="hidden sm:inline">Add Money</span>
                <span className="sm:hidden">Add Money</span>
              </button>
              <button 
                onClick={() => setShowWithdrawalForm(true)}
                className="flex-1 bg-white/20 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-white/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span className="hidden sm:inline">Withdraw</span>
                <span className="sm:hidden">Withdraw</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <ArrowDownRight className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-xs text-gray-500">Total Credit</span>
            </div>
            <p className="text-lg sm:text-xl font-bold text-gray-900">
              {totalCredit.toLocaleString('en-IN')} USDT
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-xs text-gray-500">Total Debit</span>
            </div>
            <p className="text-lg sm:text-xl font-bold text-gray-900">
              {totalDebit.toLocaleString('en-IN')} USDT
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500">Transactions</span>
            </div>
            <p className="text-lg sm:text-xl font-bold text-gray-900">{(transactions || []).length}</p>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Transaction History</h3>
              <p className="text-sm text-gray-500">View all your wallet transactions</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex bg-gray-100 rounded-lg p-1 flex-1 sm:flex-none overflow-x-auto">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    filter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('COMMISSION')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    filter === 'COMMISSION' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Commission
                </button>
                <button
                  onClick={() => setFilter('INVESTMENT')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    filter === 'INVESTMENT' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Investment
                </button>
                <button
                  onClick={() => setFilter('WITHDRAWAL')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    filter === 'WITHDRAWAL' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Withdrawal
                </button>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block">
                <Download className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Transactions</h3>
              <p className="text-gray-500">You don't have any transactions yet</p>
            </div>
          ) : (
            filteredTransactions.map((txn) => (
              <div
                key={txn.id}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-5 hover:shadow-xl transition-all hover:scale-[1.01]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getTypeColor(txn.type)}`}>
                      {getTypeIcon(txn.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                          {txn.description || txn.type.replace(/_/g, ' ')}
                        </h4>
                        {getStatusIcon(txn.status)}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500">{formatDate(txn.createdAt)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(txn.type)}`}>
                          {txn.type.replace(/_/g, ' ')}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          txn.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                          txn.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {txn.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-base sm:text-lg font-bold ${isCredit(txn.type) ? 'text-green-600' : 'text-red-600'}`}>
                      {isCredit(txn.type) ? '+' : '-'}{parseFloat(txn.amount).toLocaleString('en-IN')} USDT
                    </p>
                    {txn.fee && parseFloat(txn.fee) > 0 && (
                      <p className="text-xs text-gray-500 mt-1">Fee: {parseFloat(txn.fee).toLocaleString('en-IN')} USDT</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Transfer Form Modal */}
      {showTransferForm && (
        <TransferForm
          onClose={() => setShowTransferForm(false)}
          currentUser={{ id: user.id, name: user.fullName || 'User' } as any}
          currentBalance={availableBalance}
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
