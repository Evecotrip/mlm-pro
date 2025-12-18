'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import {
  TrendingUp, DollarSign, Calendar, Clock, CheckCircle,
  XCircle, AlertCircle, Filter, ArrowUpDown, Search
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
      case 'ACTIVE': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'PENDING_APPROVAL': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'MATURED': return <CheckCircle className="w-5 h-5 text-purple-500" />;
      case 'WITHDRAWN': return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'CANCELLED': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <AlertCircle className="w-5 h-5 text-slate-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
      case 'PENDING_APPROVAL': return 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20';
      case 'MATURED': return 'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20';
      case 'WITHDRAWN': return 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
      case 'CANCELLED': return 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20';
      default: return 'bg-slate-100 dark:bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-500/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const totalInvested = parseFloat(stats?.totalInvested || '0');
  const totalReturns = parseFloat(stats?.totalReturns || '0');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-blue-500/30 transition-colors duration-300">
      <Navbar onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Investment History</h1>
          <p className="text-slate-600 dark:text-slate-400">Track and manage your portfolio performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 dark:border-slate-800 relative overflow-hidden group shadow-sm dark:shadow-none">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-blue-500/10 rounded-xl">
                  <DollarSign className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total Investments</span>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{investments.length}</p>
            </div>
          </div>

          <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 dark:border-slate-800 relative overflow-hidden group shadow-sm dark:shadow-none">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total Invested</span>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalInvested.toLocaleString('en-IN')} INR</p>
            </div>
          </div>

          <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 dark:border-slate-800 relative overflow-hidden group shadow-sm dark:shadow-none">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-purple-500/10 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total Returns</span>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalReturns.toLocaleString('en-IN')} INR</p>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800 p-4 mb-6 shadow-sm dark:shadow-none">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Status Filter */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              <Filter className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <div className="flex bg-slate-100 dark:bg-slate-950 rounded-lg p-1 border border-slate-200 dark:border-slate-800">
                {['all', 'PENDING_APPROVAL', 'ACTIVE', 'MATURED'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status as any)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${filter === status
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                  >
                    {status === 'all' ? 'All' : status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full md:w-48 pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                >
                  <option value="createdAt">Date (Newest)</option>
                  <option value="amount">Amount (High-Low)</option>
                  <option value="maturityDate">Maturity Date</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Investment List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading investments...</p>
            </div>
          ) : investments.length === 0 ? (
            <div className="text-center py-20 bg-slate-100 dark:bg-slate-900/30 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
              <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-500 dark:text-slate-600" />
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium">No investments found</p>
              <p className="text-slate-500 text-sm mt-2">
                {filter !== 'all' ? 'Try changing the filters' : 'Start investing to see your history'}
              </p>
            </div>
          ) : (
            investments.map((inv: Investment) => (
              <div
                key={inv.id}
                className="group bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  {/* Left Section */}
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 ${inv.status === 'ACTIVE' ? 'text-emerald-600 dark:text-emerald-500' :
                      inv.status === 'PENDING_APPROVAL' ? 'text-yellow-600 dark:text-yellow-500' : 'text-slate-500'
                      }`}>
                      {getStatusIcon(inv.status)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {inv.amount} INR
                        </h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(inv.status)}`}>
                          {inv.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                        <span className="text-slate-900 dark:text-white font-medium">{inv.profile} Plan</span> • {inv.lockInMonths} Months Lock-in
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(inv.createdAt)}
                        </span>
                        {inv.maturityDate && (
                          <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                            <Clock className="w-3.5 h-3.5" />
                            Matures: {formatDate(inv.maturityDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Returns */}
                  <div className="w-full md:w-auto pl-4 md:pl-0 border-l md:border-l-0 border-slate-200 dark:border-slate-800 md:text-right">
                    <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Expected Return</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {inv.expectedMinReturn} - {inv.expectedMaxReturn} <span className="text-sm text-emerald-600/70 dark:text-emerald-500/70">INR</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {inv.minReturnRate}% - {inv.maxReturnRate}% ROI
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
