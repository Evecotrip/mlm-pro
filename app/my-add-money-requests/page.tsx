'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import {
  getMyAddMoneyRequests,
  AddMoneyRequest
} from '@/api/direct-add-money-api';
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Calendar,
  Filter,
  ArrowUpDown,
  Wallet,
  Loader2
} from 'lucide-react';

export default function MyAddMoneyRequestsPage() {
  const router = useRouter();
  const { isLoaded, user } = useUser();

  const [requests, setRequests] = useState<AddMoneyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'PENDING' | 'PROCESSING' | 'COMPLETED'>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'amount'>('createdAt');

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push('/login');
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await getMyAddMoneyRequests();
      if (response.success && response.data) {
        // Handle paginated response
        if (Array.isArray(response.data)) {
          setRequests(response.data);
        } else if (response.data.data) {
          setRequests(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-400/10 border-emerald-200 dark:border-emerald-400/20';
      case 'PROCESSING':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-400/10 border-blue-200 dark:border-blue-400/20';
      case 'PENDING':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-400/10 border-yellow-200 dark:border-yellow-400/20';
      case 'REJECTED':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-400/10 border-red-200 dark:border-red-400/20';
      case 'CANCELLED':
        return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-400/10 border-slate-200 dark:border-slate-400/20';
      default:
        return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-400/10 border-slate-200 dark:border-slate-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5" />;
      case 'PROCESSING':
        return <Loader2 className="w-5 h-5 animate-spin" />;
      case 'PENDING':
        return <Clock className="w-5 h-5" />;
      case 'REJECTED':
      case 'CANCELLED':
        return <XCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
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

  // Filter and sort requests
  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (sortBy === 'createdAt') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return parseFloat(b.amount) - parseFloat(a.amount);
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-600 dark:text-emerald-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-emerald-500/30 transition-colors duration-300">
      <Navbar onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.push('/add-money')}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Add Money
          </button>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <Wallet className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  My Add Money Requests
                </h1>
                <p className="text-slate-600 dark:text-slate-400">Track and manage your fund requests</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
              <p className="text-xs text-slate-500 dark:text-slate-500 mb-1 uppercase tracking-wider">Total Requests</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{requests.length}</p>
            </div>
            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
              <p className="text-xs text-slate-500 dark:text-slate-500 mb-1 uppercase tracking-wider">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">
                {requests.filter(r => r.status === 'PENDING').length}
              </p>
            </div>
            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
              <p className="text-xs text-slate-500 dark:text-slate-500 mb-1 uppercase tracking-wider">Processing</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-500">
                {requests.filter(r => r.status === 'PROCESSING').length}
              </p>
            </div>
            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
              <p className="text-xs text-slate-500 dark:text-slate-500 mb-1 uppercase tracking-wider">Completed</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">
                {requests.filter(r => r.status === 'COMPLETED').length}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800 p-4 mb-6 shadow-sm dark:shadow-none">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Status Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Filter:</span>
                {['all', 'PENDING', 'PROCESSING', 'COMPLETED'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status as any)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === status
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                      }`}
                  >
                    {status === 'all' ? 'All' : status}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'amount')}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 focus:border-emerald-500 focus:outline-none transition-colors"
                >
                  <option value="createdAt">Sort by Date</option>
                  <option value="amount">Sort by Amount</option>
                </select>
              </div>
            </div>
          </div>

          {/* Requests List */}
          <div className="space-y-4">
            {sortedRequests.length === 0 ? (
              <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm dark:shadow-none">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Requests Found</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {filter !== 'all' ? 'Try changing the filter' : 'You haven\'t made any add money requests yet'}
                </p>
                <button
                  onClick={() => router.push('/direct-add-money')}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20"
                >
                  Create New Request
                </button>
              </div>
            ) : (
              sortedRequests.map((request) => (
                <div
                  key={request.id}
                  onClick={() => router.push(`/direct-add-money?requestId=${request.id}`)}
                  className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all cursor-pointer group shadow-sm dark:shadow-none"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-xl border ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-bold text-slate-900 dark:text-white text-lg">
                            {request.currencyAmount} {request.currency}
                          </h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wide ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          Total Credit: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{request.usdtAmount} USDT</span>
                        </p>
                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(request.createdAt)}
                          </span>
                          <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {request.method.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Action Hint */}
                    <div className="text-right flex flex-col justify-center">
                      {request.status === 'PENDING' && (
                        <p className="text-sm text-yellow-600 dark:text-yellow-500 font-medium mb-1">
                          ⏳ Waiting for approval
                        </p>
                      )}
                      {request.status === 'PROCESSING' && !request.paymentProof && (
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1 animate-pulse">
                          📤 Upload payment proof
                        </p>
                      )}
                      {request.status === 'PROCESSING' && request.paymentProof && (
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                          ⏳ Verifying payment
                        </p>
                      )}
                      {request.status === 'COMPLETED' && (
                        <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-1">
                          ✓ Completed
                        </p>
                      )}
                      <p className="text-xs text-slate-500 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center justify-end gap-1">
                        View Details <ArrowLeft className="w-3 h-3 rotate-180" />
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* New Request Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/direct-add-money')}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 hover:scale-105"
            >
              + Create New Request
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
