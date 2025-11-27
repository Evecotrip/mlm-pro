'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import {
  TrendingUp, DollarSign, Calendar, Clock, CheckCircle,
  XCircle, AlertCircle, Filter, Download, ArrowUpDown, Plus
} from 'lucide-react';
import { 
  getInvestments, 
  getInvestmentStats,
  Investment,
  InvestmentStats,
  InvestmentFilters
} from '@/api/investment-api';
import Navbar from '@/components/Navbar';

export default function InvestmentHistoryPage() {
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [stats, setStats] = useState<InvestmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'PENDING_APPROVAL' | 'ACTIVE' | 'MATURED'>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'amount' | 'maturityDate'>('createdAt');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push('/login');
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    if (user) {
      fetchInvestments();
      fetchStats();
    }
  }, [user, filter, sortBy, page]);

  const fetchInvestments = async () => {
    setLoading(true);
    try {
      const filters: InvestmentFilters = {
        page,
        limit: 10,
        sortBy: sortBy as any,
        sortOrder: 'desc'
      };

      if (filter !== 'all') {
        filters.status = filter as any;
      }

      const response = await getInvestments(filters);
      if (response.success && response.data) {
        setInvestments(response.data.data || []);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching investments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getInvestmentStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = async () => {
    router.push('/');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'PENDING_APPROVAL':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'MATURED':
        return <CheckCircle className="w-5 h-5 text-purple-600" />;
      case 'WITHDRAWN':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING_APPROVAL':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'MATURED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'WITHDRAWN':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CANCELLED':
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
      year: 'numeric'
    });
  };

  const totalInvested = parseFloat(stats?.totalInvested || '0');
  const totalReturns = parseFloat(stats?.totalReturns || '0');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Navbar */}
      <Navbar
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
              {totalInvested.toLocaleString('en-IN')} USDT
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
              {totalReturns.toLocaleString('en-IN')} USDT
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
              {['all', 'PENDING_APPROVAL', 'ACTIVE', 'MATURED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status as any)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filter === status
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'All' : status.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5 text-gray-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'amount' | 'maturityDate')}
                className="px-3 py-1.5 border-2 border-gray-200 rounded-lg text-sm font-medium focus:border-blue-500 focus:outline-none"
              >
                <option value="createdAt">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
                <option value="maturityDate">Sort by Maturity</option>
              </select>
            </div>
          </div>
        </div>

        {/* Investment List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 sm:p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading investments...</p>
            </div>
          ) : investments.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No investments found</p>
              <p className="text-gray-500 text-sm mt-2">
                {filter !== 'all' ? 'Try changing the filter' : 'Start investing to see your history'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {investments.map((inv: Investment) => (
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
                            {inv.amount} USDT
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(inv.status)}`}>
                            {inv.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 capitalize mb-2">
                          {inv.profile} • {inv.lockInMonths} months lock-in
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
                        {inv.expectedMinReturn} - {inv.expectedMaxReturn} USDT
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {inv.minReturnRate}% - {inv.maxReturnRate}% return rate
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
