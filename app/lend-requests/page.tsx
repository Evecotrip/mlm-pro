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
  ThumbsUp,
  ThumbsDown,
  Loader2
} from 'lucide-react';
import {
  getReceivedBorrowRequests,
  approveBorrowRequest,
  rejectBorrowRequest,
  BorrowRequest,
  BorrowRequestFilters
} from '@/api/borrow-add-money-api';

export default function LendRequestsPage() {
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED' | 'CANCELLED'>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BorrowRequest | null>(null);
  const [lenderNotes, setLenderNotes] = useState('');

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

      const response = await getReceivedBorrowRequests(filters);

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

  const handleApprove = async () => {
    if (!selectedRequest) return;

    setProcessingId(selectedRequest.id);
    try {
      const response = await approveBorrowRequest(selectedRequest.id, lenderNotes || undefined);
      if (response.success) {
        setShowApproveModal(false);
        setLenderNotes('');
        setSelectedRequest(null);
        fetchRequests();
      } else {
        alert(response.error || 'Failed to approve request');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert('An error occurred while approving');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest || !lenderNotes.trim()) return;

    setProcessingId(selectedRequest.id);
    try {
      const response = await rejectBorrowRequest(selectedRequest.id, lenderNotes);
      if (response.success) {
        setShowRejectModal(false);
        setLenderNotes('');
        setSelectedRequest(null);
        fetchRequests();
      } else {
        alert(response.error || 'Failed to reject request');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('An error occurred while rejecting');
    } finally {
      setProcessingId(null);
    }
  };

  const handleLogout = async () => {
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'PROCESSING': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'PENDING': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'REJECTED': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'CANCELLED': return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
      case 'PROCESSING': return <Clock className="w-4 h-4" />;
      case 'PENDING': return <Clock className="w-4 h-4" />;
      case 'REJECTED':
      case 'CANCELLED': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading lend requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30">
      <Navbar onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <HandCoins className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Lend Requests
                </h1>
                <p className="text-slate-400">Borrow requests from users asking you to lend money</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {['all', 'PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED'].map((status) => {
              const count = status === 'all'
                ? requests.length
                : requests.filter(req => req.status === status).length;

              const isActive = statusFilter === status;

              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as any)}
                  className={`p-4 rounded-xl border transition-all text-left ${isActive
                      ? 'bg-slate-800 border-blue-500/50 shadow-lg shadow-blue-500/10'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                    }`}
                >
                  <p className={`text-2xl font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {count}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 capitalize font-medium">
                    {status === 'all' ? 'Total' : status.toLowerCase()}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div className="flex-1">
                <p className="text-sm text-red-400 font-medium">Error: {error}</p>
              </div>
              <button
                onClick={fetchRequests}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-bold transition-colors"
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
                  className="group bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 hover:border-blue-500/50 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                          <HandCoins className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-2xl font-bold text-white">
                              {request.amount} USDT
                            </h3>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1.5 uppercase tracking-wide ${getStatusColor(request.status)}`}>
                              {getStatusIcon(request.status)}
                              {request.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 font-mono">
                            ID: {request.id.slice(0, 12)}...
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Borrower</p>
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <p className="text-sm font-medium text-slate-200">
                              {request.borrower.firstName} {request.borrower.lastName}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500 mb-1">Payment Method</p>
                          <div className="flex items-center gap-2">
                            {request.paymentMethod === 'ONLINE_TRANSFER' ? (
                              <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                            ) : (
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            )}
                            <p className="text-sm font-medium text-slate-200">
                              {request.paymentMethod === 'ONLINE_TRANSFER' ? 'Online' : 'Physical'}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500 mb-1">Created</p>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <p className="text-sm font-medium text-slate-200">
                              {formatDate(request.createdAt)}
                            </p>
                          </div>
                        </div>

                        {request.completedAt && (
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Completed</p>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                              <p className="text-sm font-medium text-slate-200">
                                {formatDate(request.completedAt)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {request.borrowerNotes && (
                        <div className="mt-4 p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
                          <p className="text-xs text-blue-400 mb-1 font-bold uppercase">Borrower's Notes</p>
                          <p className="text-sm text-blue-200 italic">"{request.borrowerNotes}"</p>
                        </div>
                      )}

                      {/* Contact Details for Physical Cash */}
                      {request.paymentMethod === 'PHYSICAL_CASH' && request.borrowerDetails.contactDetails && (
                        <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-slate-800">
                          <p className="text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">Contact Details</p>
                          <div className="text-sm text-slate-300 space-y-1">
                            <p>📍 {request.borrowerDetails.contactDetails.address}</p>
                            <p>{request.borrowerDetails.contactDetails.city}, {request.borrowerDetails.contactDetails.state}</p>
                            <p>{request.borrowerDetails.contactDetails.country} - {request.borrowerDetails.contactDetails.pinCode}</p>
                            <p>📞 {request.borrowerDetails.contactDetails.phoneNumber1}</p>
                            {request.borrowerDetails.contactDetails.phoneNumber2 && (
                              <p>📞 {request.borrowerDetails.contactDetails.phoneNumber2}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {request.status === 'PENDING' && (
                      <div className="flex lg:flex-col gap-3 w-full lg:w-auto min-w-[140px]">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowApproveModal(true);
                          }}
                          disabled={processingId === request.id}
                          className="flex-1 lg:flex-none px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-emerald-600/20"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowRejectModal(true);
                          }}
                          disabled={processingId === request.id}
                          className="flex-1 lg:flex-none px-4 py-3 bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-500 border border-slate-700 hover:border-red-500/50 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <ThumbsDown className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : !error ? (
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800 p-12 text-center">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <HandCoins className="w-10 h-10 text-slate-600" />
              </div>
              <p className="text-slate-400 font-medium text-lg mb-2">No lend requests found</p>
              <p className="text-slate-500 text-sm">
                {statusFilter !== 'all'
                  ? 'Try changing the status filter'
                  : 'Borrow requests from other users will appear here'}
              </p>
            </div>
          ) : null}
        </div>
      </main>

      {/* Approve Modal */}
      {showApproveModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Approve Borrow Request</h3>
            <p className="text-slate-400 mb-6">
              Approve <span className="text-white font-bold">{selectedRequest.borrower.firstName}</span>'s request for <span className="text-white font-bold">{selectedRequest.amount} USDT</span>?
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={lenderNotes}
                onChange={(e) => setLenderNotes(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                rows={3}
                placeholder="Add any notes for the borrower..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleApprove}
                disabled={processingId === selectedRequest.id}
                className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors disabled:opacity-50"
              >
                {processingId === selectedRequest.id ? 'Approving...' : 'Confirm Approval'}
              </button>
              <button
                onClick={() => {
                  setShowApproveModal(false);
                  setLenderNotes('');
                  setSelectedRequest(null);
                }}
                disabled={processingId === selectedRequest.id}
                className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Reject Borrow Request</h3>
            <p className="text-slate-400 mb-6">
              Reject <span className="text-white font-bold">{selectedRequest.borrower.firstName}</span>'s request for <span className="text-white font-bold">{selectedRequest.amount} USDT</span>?
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Rejection Reason *
              </label>
              <textarea
                value={lenderNotes}
                onChange={(e) => setLenderNotes(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                rows={3}
                placeholder="Explain why you're rejecting this request..."
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReject}
                disabled={processingId === selectedRequest.id || !lenderNotes.trim()}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-colors disabled:opacity-50"
              >
                {processingId === selectedRequest.id ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setLenderNotes('');
                  setSelectedRequest(null);
                }}
                disabled={processingId === selectedRequest.id}
                className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
