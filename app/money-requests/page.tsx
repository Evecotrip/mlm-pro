'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowLeftRight, ArrowUpRight, ArrowDownLeft, User as UserIcon,
  CheckCircle, Clock, XCircle, Calendar, Filter, Banknote, CreditCard
} from 'lucide-react';
import {
  getUserWithdrawalRequests,
  getUserTransferRequests,
  WithdrawalRequest,
  TransferRequest,
  getUserById,
  getUserWalletBalance,
  getDirectReferrals
} from '@/lib/mockData';
import Navbar from '@/components/Navbar';

export default function MoneyRequestsPage() {
  const router = useRouter();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [transferRequests, setTransferRequests] = useState<TransferRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'withdrawal' | 'transfer'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'completed' | 'rejected'>('all');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (currentUser && !currentUser.isApproved) {
      router.push('/queue');
    } else if (currentUser) {
      setWithdrawalRequests(getUserWithdrawalRequests(currentUser.id));
      setTransferRequests(getUserTransferRequests(currentUser.id));
    }
  }, [isAuthenticated, currentUser, router]);

  if (!currentUser) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const walletBalance = getUserWalletBalance(currentUser.id);
  const directReferrals = getDirectReferrals(currentUser.id);
  const pendingReferrals = directReferrals.filter(user => !user.isApproved);

  // Filter requests
  const filteredWithdrawals = withdrawalRequests.filter(req => {
    if (statusFilter !== 'all' && req.status !== statusFilter) return false;
    return true;
  });

  const filteredTransfers = transferRequests.filter(req => {
    if (statusFilter !== 'all' && req.status !== statusFilter) return false;
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const totalPending = [...filteredWithdrawals, ...filteredTransfers].filter(
    req => req.status === 'pending'
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Navbar */}
      <Navbar
        currentUser={currentUser}
        walletBalance={walletBalance}
        pendingRequestsCount={pendingReferrals.length}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text mb-2">
            Money Requests
          </h1>
          <p className="text-gray-600">Track all your withdrawal and transfer requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Withdrawal Requests</span>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Banknote className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">
              {withdrawalRequests.length}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Transfer Requests</span>
              <div className="p-2 bg-purple-100 rounded-lg">
                <ArrowLeftRight className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-purple-600">
              {transferRequests.length}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Pending</span>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-600">
              {totalPending}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Type Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Type:</span>
              {['all', 'withdrawal', 'transfer'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type as any)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filter === type
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              {['all', 'pending', 'approved', 'completed', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as any)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    statusFilter === status
                      ? 'bg-pink-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Withdrawal Requests */}
        {(filter === 'all' || filter === 'withdrawal') && filteredWithdrawals.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 sm:p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Banknote className="w-6 h-6 text-blue-600" />
              Withdrawal Requests
            </h2>
            <div className="space-y-4">
              {filteredWithdrawals.map((req) => (
                <div
                  key={req.id}
                  className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-all hover:shadow-md bg-gradient-to-br from-white to-blue-50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        {getStatusIcon(req.status)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-gray-900">
                            ₹{req.amount.toLocaleString('en-IN')}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(req.status)}`}>
                            {req.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 capitalize mb-2">
                          {req.method === 'online' ? (
                            <span className="flex items-center gap-1">
                              <CreditCard className="w-4 h-4" />
                              Online Transfer - {req.bankDetails?.bankName}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Banknote className="w-4 h-4" />
                              Physical Cash Pickup
                            </span>
                          )}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {formatDate(req.requestedAt)}
                        </div>
                        {req.remarks && (
                          <p className="text-sm text-gray-600 mt-2 italic">"{req.remarks}"</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transfer Requests */}
        {(filter === 'all' || filter === 'transfer') && filteredTransfers.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 sm:p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ArrowLeftRight className="w-6 h-6 text-purple-600" />
              Transfer Requests
            </h2>
            <div className="space-y-4">
              {filteredTransfers.map((req) => {
                const isReceiver = req.toUserId === currentUser.id;
                const otherUser = getUserById(isReceiver ? req.fromUserId : req.toUserId);
                
                return (
                  <div
                    key={req.id}
                    className="border-2 border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-all hover:shadow-md bg-gradient-to-br from-white to-purple-50"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${isReceiver ? 'bg-green-100' : 'bg-purple-100'}`}>
                          {isReceiver ? (
                            <ArrowDownLeft className="w-5 h-5 text-green-600" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5 text-purple-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold text-gray-900">
                              ₹{req.amount.toLocaleString('en-IN')}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(req.status)}`}>
                              {req.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                            <UserIcon className="w-4 h-4" />
                            {isReceiver ? 'From' : 'To'}: {otherUser?.name || 'Unknown User'}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            {formatDate(req.requestedAt)}
                          </div>
                          {req.notes && (
                            <p className="text-sm text-gray-600 mt-2 italic">"{req.notes}"</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          isReceiver ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {isReceiver ? 'Receiving' : 'Sending'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {((filter === 'withdrawal' && filteredWithdrawals.length === 0) ||
          (filter === 'transfer' && filteredTransfers.length === 0) ||
          (filter === 'all' && filteredWithdrawals.length === 0 && filteredTransfers.length === 0)) && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-12 text-center">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No requests found</p>
            <p className="text-gray-500 text-sm mt-2">
              {statusFilter !== 'all' ? 'Try changing the status filter' : 'Your money requests will appear here'}
            </p>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}
