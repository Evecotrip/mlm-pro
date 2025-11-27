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
  ArrowUpDown
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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'PROCESSING':
        return <Clock className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'REJECTED':
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
        <Navbar onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading requests...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      <Navbar onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.push('/add-money')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Add Money
          </button>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 text-transparent bg-clip-text mb-2">
              My Add Money Requests
            </h1>
            <p className="text-gray-600">View and manage all your add money requests</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
              <p className="text-xs text-gray-600 mb-1">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
              <p className="text-xs text-gray-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {requests.filter(r => r.status === 'PENDING').length}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
              <p className="text-xs text-gray-600 mb-1">Processing</p>
              <p className="text-2xl font-bold text-blue-600">
                {requests.filter(r => r.status === 'PROCESSING').length}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
              <p className="text-xs text-gray-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {requests.filter(r => r.status === 'COMPLETED').length}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Status Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Filter:</span>
                {['all', 'PENDING', 'PROCESSING', 'COMPLETED'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status as any)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      filter === status
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'all' ? 'All' : status}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-5 h-5 text-gray-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'amount')}
                  className="px-3 py-1.5 border-2 border-gray-200 rounded-lg text-sm font-medium focus:border-green-500 focus:outline-none"
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
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Requests Found</h3>
                <p className="text-gray-500 mb-6">
                  {filter !== 'all' ? 'Try changing the filter' : 'You haven\'t made any add money requests yet'}
                </p>
                <button
                  onClick={() => router.push('/direct-add-money')}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors"
                >
                  Create New Request
                </button>
              </div>
            ) : (
              sortedRequests.map((request) => (
                <div
                  key={request.id}
                  onClick={() => router.push(`/direct-add-money?requestId=${request.id}`)}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-green-100 rounded-xl">
                        {getStatusIcon(request.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900 text-lg">
                            {request.currencyAmount} {request.currency}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Total Credit: {request.usdtAmount} USDT
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(request.createdAt)}
                          </span>
                          <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                            {request.method}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Action Hint */}
                    <div className="text-right">
                      {request.status === 'PENDING' && (
                        <p className="text-sm text-yellow-600 font-medium">
                          ⏳ Waiting for approval
                        </p>
                      )}
                      {request.status === 'PROCESSING' && !request.paymentProof && (
                        <p className="text-sm text-blue-600 font-medium">
                          📤 Upload payment proof
                        </p>
                      )}
                      {request.status === 'PROCESSING' && request.paymentProof && (
                        <p className="text-sm text-blue-600 font-medium">
                          ⏳ Verifying payment
                        </p>
                      )}
                      {request.status === 'COMPLETED' && (
                        <p className="text-sm text-green-600 font-medium">
                          ✓ Completed
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Click to view details →
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* New Request Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/direct-add-money')}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              + Create New Request
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
