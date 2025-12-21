'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  Users,
  Clock,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye,
  X,
  ExternalLink,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import {
  getMyReferralsPendingKYC,
  reviewKYC,
  getKYCDetailsByUserId,
  PendingKYCItem,
  KYCDetailsByUserId,
  formatKYCDate,
} from '@/api/kyc-api';

export default function KYCRequestsPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const [kycRequests, setKycRequests] = useState<PendingKYCItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  // Rejection modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectUserId, setRejectUserId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  
  // Details modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedKYCDetails, setSelectedKYCDetails] = useState<KYCDetailsByUserId | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const hasFetchedData = useRef(false);

  // Check authentication
  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push('/login');
    }
  }, [isLoaded, user, router]);

  // Fetch KYC requests on mount
  useEffect(() => {
    if (!user?.id || hasFetchedData.current) return;
    hasFetchedData.current = true;
    fetchKYCRequests();
  }, [user?.id]);

  const fetchKYCRequests = async (pageNum: number = 1) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await getMyReferralsPendingKYC(pageNum, 10);

      if (response.success && response.data) {
        setKycRequests(response.data.kycs);
        setPage(response.data.pagination.page);
        setTotalPages(response.data.pagination.totalPages);
        setTotal(response.data.pagination.total);
      } else {
        setError(response.message || 'Failed to load KYC requests');
      }
    } catch (error) {
      console.error('Error fetching KYC requests:', error);
      setError('Failed to load KYC requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    setProcessingId(userId);
    setError('');
    setSuccess('');

    try {
      const response = await reviewKYC(userId, 'APPROVE');

      if (response.success) {
        setSuccess('KYC approved successfully!');
        // Remove from list
        setKycRequests(prev => prev.filter(item => item.userId !== userId));
        setTotal(prev => prev - 1);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Failed to approve KYC');
      }
    } catch (error) {
      console.error('Error approving KYC:', error);
      setError('Failed to approve KYC');
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectModal = (userId: string) => {
    setRejectUserId(userId);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectUserId) return;
    
    setProcessingId(rejectUserId);
    setError('');
    setSuccess('');
    setShowRejectModal(false);

    try {
      const response = await reviewKYC(rejectUserId, 'REJECT', rejectionReason || undefined);

      if (response.success) {
        setSuccess('KYC rejected successfully');
        // Remove from list
        setKycRequests(prev => prev.filter(item => item.userId !== rejectUserId));
        setTotal(prev => prev - 1);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Failed to reject KYC');
      }
    } catch (error) {
      console.error('Error rejecting KYC:', error);
      setError('Failed to reject KYC');
    } finally {
      setProcessingId(null);
      setRejectUserId(null);
      setRejectionReason('');
    }
  };

  const viewKYCDetails = async (userId: string) => {
    setLoadingDetails(true);
    setShowDetailsModal(true);
    setSelectedKYCDetails(null);
    setError('');

    try {
      const response = await getKYCDetailsByUserId(userId);

      if (response.success && response.data) {
        setSelectedKYCDetails(response.data);
      } else {
        setError(response.message || 'Failed to load KYC details');
        setShowDetailsModal(false);
      }
    } catch (error) {
      console.error('Error fetching KYC details:', error);
      setError('Failed to load KYC details');
      setShowDetailsModal(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedKYCDetails(null);
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading KYC requests...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-500" />
                KYC Requests
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Review and approve KYC submissions from your referrals
              </p>
            </div>

            <button
              onClick={() => fetchKYCRequests(page)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Pending Requests</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{total}</p>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 mb-6 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">{success}</p>
          </div>
        )}

        {/* KYC Requests List */}
        {kycRequests.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
            <FileCheck className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No Pending Requests
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              There are no KYC submissions from your referrals waiting for review.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {kycRequests.map((request) => (
              <div
                key={request.userId}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {request.userName}
                      </h3>
                      {request.allDocumentsUploaded && (
                        <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-full">
                          All Docs Uploaded
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <p className="text-slate-600 dark:text-slate-400">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Email:</span>{' '}
                        {request.email}
                      </p>
                      <p className="text-slate-600 dark:text-slate-400">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Phone:</span>{' '}
                        {request.phone.startsWith('PENDING_') ? 'Not verified' : request.phone}
                      </p>
                      <p className="text-slate-600 dark:text-slate-400">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Referral Code:</span>{' '}
                        {request.referralCode}
                      </p>
                      <p className="text-slate-600 dark:text-slate-400">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Documents:</span>{' '}
                        {request.documentsCount} uploaded
                      </p>
                      <p className="text-slate-600 dark:text-slate-400 sm:col-span-2">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Submitted:</span>{' '}
                        {formatKYCDate(request.submittedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => viewKYCDetails(request.userId)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button
                      onClick={() => handleApprove(request.userId)}
                      disabled={processingId === request.userId}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                    >
                      {processingId === request.userId ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => openRejectModal(request.userId)}
                      disabled={processingId === request.userId}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => fetchKYCRequests(page - 1)}
                  disabled={page <= 1}
                  className="flex items-center gap-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => fetchKYCRequests(page + 1)}
                  disabled={page >= totalPages}
                  className="flex items-center gap-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* KYC Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                KYC Details
              </h3>
              <button
                onClick={closeDetailsModal}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {loadingDetails ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
            ) : selectedKYCDetails ? (
              <>
                <div className="overflow-y-auto p-6 space-y-6">
                  {/* User Information */}
                  <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3">User Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">Name:</span>
                        <span className="ml-2 text-slate-900 dark:text-white font-medium">{selectedKYCDetails.userName}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">Email:</span>
                        <span className="ml-2 text-slate-900 dark:text-white font-medium">{selectedKYCDetails.email}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">Phone:</span>
                        <span className="ml-2 text-slate-900 dark:text-white font-medium">
                          {selectedKYCDetails.phone.startsWith('PENDING_') ? 'Not verified' : selectedKYCDetails.phone}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">Referral Code:</span>
                        <span className="ml-2 text-slate-900 dark:text-white font-medium">{selectedKYCDetails.referralCode}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">Hierarchy Level:</span>
                        <span className="ml-2 text-slate-900 dark:text-white font-medium">{selectedKYCDetails.hierarchyLevel}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">Registered:</span>
                        <span className="ml-2 text-slate-900 dark:text-white font-medium">{formatKYCDate(selectedKYCDetails.registeredAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Aadhaar Details */}
                  {selectedKYCDetails.documents.aadhaar && (
                    <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Aadhaar Details</h4>
                      <div className="mb-3">
                        <span className="text-slate-600 dark:text-slate-400 text-sm">Aadhaar Number:</span>
                        <span className="ml-2 text-slate-900 dark:text-white font-medium">{selectedKYCDetails.documents.aadhaar.number}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedKYCDetails.documents.aadhaar.frontImage && (
                          <div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Front Image</p>
                            <a
                              href={selectedKYCDetails.documents.aadhaar.frontImage.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block relative group"
                            >
                              <img
                                src={selectedKYCDetails.documents.aadhaar.frontImage.url}
                                alt="Aadhaar Front"
                                className="w-full h-48 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                <ExternalLink className="w-6 h-6 text-white" />
                              </div>
                            </a>
                          </div>
                        )}
                        {selectedKYCDetails.documents.aadhaar.backImage && (
                          <div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Back Image</p>
                            <a
                              href={selectedKYCDetails.documents.aadhaar.backImage.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block relative group"
                            >
                              <img
                                src={selectedKYCDetails.documents.aadhaar.backImage.url}
                                alt="Aadhaar Back"
                                className="w-full h-48 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                <ExternalLink className="w-6 h-6 text-white" />
                              </div>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Selfie */}
                  {selectedKYCDetails.documents.selfie && (
                    <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Selfie</h4>
                      <a
                        href={selectedKYCDetails.documents.selfie.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block relative group w-full md:w-64"
                      >
                        <img
                          src={selectedKYCDetails.documents.selfie.url}
                          alt="Selfie"
                          className="w-full h-64 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <ExternalLink className="w-6 h-6 text-white" />
                        </div>
                      </a>
                    </div>
                  )}

                  {/* Bank Details */}
                  {selectedKYCDetails.documents.bankDetails && (
                    <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Bank Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-slate-600 dark:text-slate-400">Account Number:</span>
                          <span className="ml-2 text-slate-900 dark:text-white font-medium">{selectedKYCDetails.documents.bankDetails.accountNumber}</span>
                        </div>
                        <div>
                          <span className="text-slate-600 dark:text-slate-400">IFSC Code:</span>
                          <span className="ml-2 text-slate-900 dark:text-white font-medium">{selectedKYCDetails.documents.bankDetails.ifscCode}</span>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-slate-600 dark:text-slate-400">Account Holder:</span>
                          <span className="ml-2 text-slate-900 dark:text-white font-medium">{selectedKYCDetails.documents.bankDetails.accountHolderName}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons - Fixed at bottom */}
                <div className="flex gap-3 p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <button
                    onClick={() => {
                      closeDetailsModal();
                      handleApprove(selectedKYCDetails.userId);
                    }}
                    disabled={processingId === selectedKYCDetails.userId}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-400 text-white rounded-xl font-medium transition-colors disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Approve KYC
                  </button>
                  <button
                    onClick={() => {
                      closeDetailsModal();
                      openRejectModal(selectedKYCDetails.userId);
                    }}
                    disabled={processingId === selectedKYCDetails.userId}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-500 disabled:bg-red-400 text-white rounded-xl font-medium transition-colors disabled:cursor-not-allowed"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject KYC
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                No details available
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Reject KYC Submission
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Please provide a reason for rejection (optional):
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectUserId(null);
                  setRejectionReason('');
                }}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium transition-colors"
              >
                Reject KYC
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}