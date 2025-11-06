'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  TrendingUp, DollarSign, Calendar, Clock, CheckCircle,
  XCircle, AlertCircle, Filter, Download, ArrowUpDown
} from 'lucide-react';
import { getUserInvestments, Investment, getUserWalletBalance, getDirectReferrals } from '@/lib/mockData';
import Navbar from '@/components/Navbar';

export default function InvestmentHistoryPage() {
  const router = useRouter();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'active' | 'matured'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (currentUser && !currentUser.isApproved) {
      router.push('/queue');
    } else if (currentUser) {
      setInvestments(getUserInvestments(currentUser.id));
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

  // Filter investments
  const filteredInvestments = investments.filter(inv => {
    if (filter === 'all') return true;
    return inv.status === filter;
  });

  // Sort investments
  const sortedInvestments = [...filteredInvestments].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return b.amount - a.amount;
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'matured':
        return <CheckCircle className="w-5 h-5 text-purple-600" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'matured':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalReturns = investments
    .filter(inv => inv.status === 'active' || inv.status === 'matured')
    .reduce((sum, inv) => sum + inv.totalReturn, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
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
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mb-2">
            Investment History
          </h1>
          <p className="text-gray-600">Track all your investments and returns</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Investments</span>
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">
              {investments.length}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Invested</span>
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">
              ₹{totalInvested.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Returns</span>
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-purple-600">
              ₹{totalReturns.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Status Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              {['all', 'pending', 'approved', 'active', 'matured'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status as any)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filter === status
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5 text-gray-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
                className="px-3 py-1.5 border-2 border-gray-200 rounded-lg text-sm font-medium focus:border-blue-500 focus:outline-none"
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Investment List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 sm:p-6">
          {sortedInvestments.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No investments found</p>
              <p className="text-gray-500 text-sm mt-2">
                {filter !== 'all' ? 'Try changing the filter' : 'Start investing to see your history'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedInvestments.map((inv) => (
                <div
                  key={inv.id}
                  className="border-2 border-gray-200 rounded-xl p-4 sm:p-5 hover:border-blue-300 transition-all hover:shadow-md bg-gradient-to-br from-white to-gray-50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        {getStatusIcon(inv.status)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-gray-900">
                            ₹{inv.amount.toLocaleString('en-IN')}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(inv.status)}`}>
                            {inv.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 capitalize mb-2">
                          {inv.riskProfile} Risk • {inv.lockInMonths} months lock-in
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(inv.createdAt)}
                          </span>
                          {inv.maturityDate && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Matures: {formatDate(inv.maturityDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Returns */}
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Expected Return</p>
                      <p className="text-2xl font-bold text-green-600">
                        ₹{inv.totalReturn.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Base: ₹{inv.baseReturn.toLocaleString('en-IN')} + Bonus: ₹{inv.lockInBonus.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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
