'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ArrowLeft,
  HandCoins,
  User,
  Filter,
  Calendar,
  CreditCard,
  MapPin,
  Loader2
} from 'lucide-react';
import {
  getSentBorrowRequests,
  BorrowRequest,
  BorrowRequestFilters
} from '@/api/borrow-add-money-api';

export default function MyBorrowRequestsPage() {
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED' | 'CANCELLED'>('all');

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push('/login');
      return;
    }
    fetchRequests();
  }, [isLoaded, user, router, statusFilter]);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: BorrowRequestFilters = {
        page: 1,
        limit: 50
      };
      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }

      const response = await getSentBorrowRequests(filters);

      if (response.success && response.data) {
        const requestsData = Array.isArray(response.data) ? response.data : (response.data.data || []);
        setRequests(requestsData);
      } else {
        setError(response.error || 'Failed to fetch requests');
        setRequests([]);
      }
    } catch (error) {
      console.error('Exception fetching requests:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      setRequests([]);
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
        return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'PROCESSING':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'PENDING':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'REJECTED':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'CANCELLED':
        return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
      default:
        return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading your borrow requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-purple-500/30">
      <Navbar onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.push('/borrow-add-money')}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Borrow Money
          </button>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <HandCoins className="w-8 h-8 text-purple-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  My Borrow Requests
                </h1>
                <p className="text-slate-400">Track your peer-to-peer borrow requests</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {['all', 'PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED'].map((status) => {
              const count = status === 'all'
                ? requests.length
                : requests.filter(req => req.status === status).length;

              const colors = {
                all: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
                PENDING: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
                PROCESSING: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
                COMPLETED: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
                REJECTED: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' }
              };

              const active = statusFilter === status;
              const style = colors[status as keyof typeof colors];

              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as any)}
                  className={`p-4 rounded-xl border transition-all ${active
                      ? `${style.bg} ${style.border} shadow-lg ring-1 ring-inset ring-white/10`
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                    }`}
                >
                  <p className={`text-2xl font-bold mb-1 ${active ? style.text : 'text-white'}`}>
                    {count}
                  </p>
                  <p className={`text-xs uppercase tracking-wider font-bold ${active ? style.text : 'text-slate-500'}`}>
                    {status === 'all' ? 'Total' : status}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-sm text-red-400">
                  <strong>Error:</strong> {error}
                </p>
              </div>
              <button
                onClick={fetchRequests}
                className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-bold transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Requests List */}
          {!error && requests.length > 0 ? (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  onClick={() => router.push(`/borrow-add-money?requestId=${request.id}`)}
                  className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5 transition-all cursor-pointer group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-xl border ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-bold text-white">
                              {request.amount} USDT
                            </h3>
                            <span className={`px-3 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wide ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 font-mono">
                            ID: {request.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Lender</p>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-purple-400" />
                            <p className="text-sm font-bold text-slate-200">
                              {request.lender.firstName} {request.lender.lastName}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Method</p>
                          <div className="flex items-center gap-2">
                            {request.paymentMethod === 'ONLINE_TRANSFER' ? (
                              <CreditCard className="w-4 h-4 text-slate-400" />
                            ) : (
                              <MapPin className="w-4 h-4 text-slate-400" />
                            )}
                            <p className="text-sm font-medium text-slate-300">
                              {request.paymentMethod === 'ONLINE_TRANSFER' ? 'Online' : 'Physical'}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Created</p>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <p className="text-sm font-medium text-slate-300">
                              {formatDate(request.createdAt)}
                            </p>
                          </div>
                        </div>

                        {request.completedAt && (
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Completed</p>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                              <p className="text-sm font-medium text-emerald-400">
                                {formatDate(request.completedAt)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {request.borrowerNotes && (
                        <div className="mt-4 p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                          <p className="text-xs text-slate-500 mb-1 font-bold uppercase">Your Notes:</p>
                          <p className="text-sm text-slate-300 italic line-clamp-1">"{request.borrowerNotes}"</p>
                        </div>
                      )}

                      {request.lenderNotes && (
                        <div className="mt-2 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                          <p className="text-xs text-blue-400 mb-1 font-bold uppercase">Lender's Notes:</p>
                          <p className="text-sm text-blue-200 italic line-clamp-1">"{request.lenderNotes}"</p>
                        </div>
                      )}
                    </div>

                    <div className="flex lg:flex-col gap-2 lg:items-end justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/borrow-add-money?requestId=${request.id}`);
                        }}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 text-sm whitespace-nowrap"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !error ? (
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-12 text-center">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <HandCoins className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Borrow Requests Found</h3>
              <p className="text-slate-400 mb-8">
                {statusFilter !== 'all'
                  ? 'Try changing the status filter'
                  : 'Create your first borrow request to get started'}
              </p>
              <button
                onClick={() => router.push('/borrow-add-money')}
                className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 hover:scale-105"
              >
                Create Borrow Request
              </button>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
