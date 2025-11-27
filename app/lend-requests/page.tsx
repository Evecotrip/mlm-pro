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
  ThumbsDown
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
        return <Clock className="w-5 h-5 text-blue-600" />;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
        <Navbar onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading lend requests...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <Navbar onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-green-100 rounded-xl">
                <HandCoins className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 text-transparent bg-clip-text">
                  Lend Requests
                </h1>
                <p className="text-gray-600">Borrow requests from users asking you to lend money</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {['all', 'PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED'].map((status) => {
              const count = status === 'all' 
                ? requests.length 
                : requests.filter(req => req.status === status).length;
              
              const colors = {
                all: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
                PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' },
                PROCESSING: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
                COMPLETED: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
                REJECTED: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' }
              };

              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as any)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    statusFilter === status
                      ? `${colors[status as keyof typeof colors].bg} ${colors[status as keyof typeof colors].border} shadow-lg`
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className={`text-2xl font-bold ${statusFilter === status ? colors[status as keyof typeof colors].text : 'text-gray-900'}`}>
                    {count}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 capitalize">
                    {status === 'all' ? 'Total' : status.toLowerCase()}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-800">
                  <strong>Error:</strong> {error}
                </p>
              </div>
              <button
                onClick={fetchRequests}
                className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors"
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
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-green-100 rounded-xl">
                          <HandCoins className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold text-gray-900">
                              {request.amount} USDT
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(request.status)} flex items-center gap-1`}>
                              {getStatusIcon(request.status)}
                              {request.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Request ID: {request.id.slice(0, 12)}...
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Borrower</p>
                          <div className="flex items-center gap-1 mt-1">
                            <User className="w-3 h-3 text-gray-400" />
                            <p className="text-sm font-semibold text-gray-900">
                              {request.borrower.firstName} {request.borrower.lastName}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">Payment Method</p>
                          <div className="flex items-center gap-1 mt-1">
                            {request.paymentMethod === 'ONLINE_TRANSFER' ? (
                              <CreditCard className="w-3 h-3 text-gray-400" />
                            ) : (
                              <MapPin className="w-3 h-3 text-gray-400" />
                            )}
                            <p className="text-sm font-semibold text-gray-900">
                              {request.paymentMethod === 'ONLINE_TRANSFER' ? 'Online' : 'Physical'}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">Created</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <p className="text-sm font-semibold text-gray-900">
                              {formatDate(request.createdAt)}
                            </p>
                          </div>
                        </div>

                        {request.completedAt && (
                          <div>
                            <p className="text-xs text-gray-500">Completed</p>
                            <div className="flex items-center gap-1 mt-1">
                              <CheckCircle className="w-3 h-3 text-green-600" />
                              <p className="text-sm font-semibold text-gray-900">
                                {formatDate(request.completedAt)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {request.borrowerNotes && (
                        <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                          <p className="text-xs text-blue-600 mb-1">Borrower's Notes:</p>
                          <p className="text-sm text-blue-900 italic line-clamp-2">"{request.borrowerNotes}"</p>
                        </div>
                      )}

                      {/* Contact Details for Physical Cash */}
                      {request.paymentMethod === 'PHYSICAL_CASH' && request.borrowerDetails.contactDetails && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600 mb-2 font-semibold">Contact Details:</p>
                          <div className="text-sm text-gray-700 space-y-1">
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
                      <div className="flex lg:flex-col gap-2">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowApproveModal(true);
                          }}
                          disabled={processingId === request.id}
                          className="flex-1 lg:flex-none px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
                          className="flex-1 lg:flex-none px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-12 text-center">
              <HandCoins className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium mb-2">No lend requests found</p>
              <p className="text-gray-500 text-sm">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Approve Borrow Request</h3>
            <p className="text-gray-600 mb-4">
              Approve {selectedRequest.borrower.firstName}'s request for {selectedRequest.amount} USDT?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={lenderNotes}
                onChange={(e) => setLenderNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
                placeholder="Add any notes for the borrower..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleApprove}
                disabled={processingId === selectedRequest.id}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
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
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reject Borrow Request</h3>
            <p className="text-gray-600 mb-4">
              Reject {selectedRequest.borrower.firstName}'s request for {selectedRequest.amount} USDT?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason *
              </label>
              <textarea
                value={lenderNotes}
                onChange={(e) => setLenderNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={3}
                placeholder="Explain why you're rejecting this request..."
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReject}
                disabled={processingId === selectedRequest.id || !lenderNotes.trim()}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
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
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-colors disabled:opacity-50"
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
