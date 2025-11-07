'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
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
  ArrowLeftRight
} from 'lucide-react';
import { getUserWalletBalance, getUserWalletTransactions, WalletTransaction, getDirectReferrals } from '@/lib/mockData';
import TransferForm from '@/components/TransferForm';
import WithdrawalForm from '@/components/WithdrawalForm';
import Navbar from '@/components/Navbar';

export default function WalletPage() {
  const router = useRouter();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (currentUser && !currentUser.isApproved) {
      router.push('/queue');
    } else if (currentUser) {
      setBalance(getUserWalletBalance(currentUser.id));
      setTransactions(getUserWalletTransactions(currentUser.id));
    }
  }, [isAuthenticated, currentUser, router]);

  if (!currentUser) {
    return null;
  }

  const filteredTransactions = transactions.filter(txn => {
    if (filter === 'all') return true;
    return txn.type === filter;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'deposit':
        return <Plus className="w-4 h-4" />;
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4" />;
      case 'investment':
        return <TrendingUp className="w-4 h-4" />;
      case 'return':
      case 'maturity':
        return <ArrowDownRight className="w-4 h-4" />;
      case 'referral_bonus':
        return <CreditCard className="w-4 h-4" />;
      default:
        return <Wallet className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'deposit':
        return 'bg-green-100 text-green-700';
      case 'withdrawal':
        return 'bg-orange-100 text-orange-700';
      case 'investment':
        return 'bg-blue-100 text-blue-700';
      case 'return':
      case 'maturity':
        return 'bg-purple-100 text-purple-700';
      case 'referral_bonus':
        return 'bg-pink-100 text-pink-700';
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

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const directReferrals = getDirectReferrals(currentUser.id);
  const pendingReferrals = directReferrals.filter(user => !user.isApproved);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Navbar */}
      <Navbar
        currentUser={currentUser}
        walletBalance={balance}
        pendingRequestsCount={pendingReferrals.length}
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
                <h2 className="text-3xl sm:text-4xl font-bold">₹{balance.toLocaleString('en-IN')}</h2>
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
              ₹{transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0).toLocaleString('en-IN')}
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
              ₹{transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0).toLocaleString('en-IN')}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500">Transactions</span>
            </div>
            <p className="text-lg sm:text-xl font-bold text-gray-900">{transactions.length}</p>
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
              <div className="flex bg-gray-100 rounded-lg p-1 flex-1 sm:flex-none">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    filter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('credit')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    filter === 'credit' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Credit
                </button>
                <button
                  onClick={() => setFilter('debit')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    filter === 'debit' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Debit
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
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getCategoryColor(txn.category)}`}>
                      {getCategoryIcon(txn.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{txn.description}</h4>
                        {getStatusIcon(txn.status)}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500">{formatDate(txn.createdAt)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(txn.category)}`}>
                          {txn.category.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-base sm:text-lg font-bold ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Balance: ₹{txn.balance.toLocaleString('en-IN')}</p>
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
          currentUser={currentUser}
          currentBalance={balance}
        />
      )}

      {/* Withdrawal Form Modal */}
      {showWithdrawalForm && (
        <WithdrawalForm
          onClose={() => setShowWithdrawalForm(false)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
