'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import {
  CheckCircle, Clock, XCircle, Calendar, Filter, TrendingUp, User as UserIcon,
  DollarSign, AlertCircle, ThumbsUp, ThumbsDown
} from 'lucide-react';
import {
  getPendingApprovals,
  approveInvestment,
  rejectInvestment,
  Investment,
  PendingApprovalsFilters
} from '@/api/investment-api';
import Navbar from '@/components/Navbar';

export default function InvestmentRequestsPage() {
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileFilter, setProfileFilter] = useState<'all' | 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND'>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push('/login');
      return;
    }
    fetchPendingApprovals();
  }, [isLoaded, user, router, profileFilter]);

  const fetchPendingApprovals = async () => {
    setLoading(true);
    try {
      const filters: PendingApprovalsFilters = {
        page: 1,
        limit: 50
      };
      if (profileFilter !== 'all') {
        filters.profile = profileFilter;
      }
      const response = await getPendingApprovals(filters);
      if (response.success && response.data) {
        setInvestments(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    router.push('/');
  };

  const handleApprove = async () => {
    if (!selectedInvestment) return;
    
    setProcessingId(selectedInvestment.id);
    try {
      const response = await approveInvestment(selectedInvestment.id, adminNotes);
      if (response.success) {
        setShowApproveModal(false);
        setAdminNotes('');
        setSelectedInvestment(null);
        fetchPendingApprovals();
      }
    } catch (error) {
      console.error('Error approving investment:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!selectedInvestment || !rejectionReason.trim()) return;
    
    setProcessingId(selectedInvestment.id);
    try {
      const response = await rejectInvestment(selectedInvestment.id, rejectionReason);
      if (response.success) {
        setShowRejectModal(false);
        setRejectionReason('');
        setSelectedInvestment(null);
        fetchPendingApprovals();
      }
    } catch (error) {
      console.error('Error rejecting investment:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const getProfileColor = (profile: string) => {
    switch (profile) {
      case 'BRONZE':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'SILVER':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'GOLD':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'DIAMOND':
        return 'bg-blue-100 text-blue-800 border-blue-200';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading investment requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <Navbar onLogout={handleLogout} />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text mb-2">
            Investment Requests
          </h1>
          <p className="text-gray-600">Review and approve pending investment requests from your referrals</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Pending</span>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-purple-600">
              {investments.length}
            </p>
          </div>

          {['BRONZE', 'SILVER', 'GOLD'].map((profile) => {
            const count = investments.filter(inv => inv.profile === profile).length;
            const colors = {
              BRONZE: { bg: 'bg-orange-100', text: 'text-orange-600' },
              SILVER: { bg: 'bg-gray-100', text: 'text-gray-600' },
              GOLD: { bg: 'bg-yellow-100', text: 'text-yellow-600' }
            };
            return (
              <div key={profile} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm font-medium">{profile}</span>
                  <div className={`p-2 ${colors[profile as keyof typeof colors].bg} rounded-lg`}>
                    <TrendingUp className={`w-5 h-5 ${colors[profile as keyof typeof colors].text}`} />
                  </div>
                </div>
                <p className={`text-2xl sm:text-3xl font-bold ${colors[profile as keyof typeof colors].text}`}>
                  {count}
                </p>
              </div>
            );
          })}
        </div>

        {/* Profile Filter */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filter by Profile:</span>
            {['all', 'BRONZE', 'SILVER', 'GOLD', 'DIAMOND'].map((profile) => (
              <button
                key={profile}
                onClick={() => setProfileFilter(profile as any)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  profileFilter === profile
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {profile.charAt(0) + profile.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Investment Requests List */}
        {investments.length > 0 ? (
          <div className="space-y-4">
            {investments.map((investment) => (
              <div
                key={investment.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 sm:p-6 hover:shadow-xl transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 bg-purple-100 rounded-xl">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-gray-900">
                            {investment.amount} USDT
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getProfileColor(investment.profile)}`}>
                            {investment.profile}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Reference: {investment.referenceId}
                        </p>
                      </div>
                    </div>

                    {investment.user && (
                      <div className="flex items-center gap-2 mb-2">
                        <UserIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {investment.user.firstName} {investment.user.lastName}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({investment.user.email})
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-xs text-gray-500">Expected Return</p>
                        <p className="text-sm font-semibold text-green-600">
                          {investment.expectedMinReturn} - {investment.expectedMaxReturn} USDT
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Lock-in Period</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {investment.lockInMonths} months
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Created</p>
                        <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(investment.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Maturity Date</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatDate(investment.maturityDate)}
                        </p>
                      </div>
                    </div>

                    {investment.notes && (
                      <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Notes:</p>
                        <p className="text-sm text-gray-700 italic">"{investment.notes}"</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex lg:flex-col gap-2">
                    <button
                      onClick={() => {
                        setSelectedInvestment(investment);
                        setShowApproveModal(true);
                      }}
                      disabled={processingId === investment.id}
                      className="flex-1 lg:flex-none px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setSelectedInvestment(investment);
                        setShowRejectModal(true);
                      }}
                      disabled={processingId === investment.id}
                      className="flex-1 lg:flex-none px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-12 text-center">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No pending investment requests</p>
            <p className="text-gray-500 text-sm mt-2">
              {profileFilter !== 'all' ? 'Try changing the profile filter' : 'Investment requests from your referrals will appear here'}
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

      {/* Approve Modal */}
      {showApproveModal && selectedInvestment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Approve Investment</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to approve this {selectedInvestment.amount} USDT {selectedInvestment.profile} investment?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Notes (Optional)
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
                placeholder="Add any notes about this approval..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleApprove}
                disabled={processingId === selectedInvestment.id}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                {processingId === selectedInvestment.id ? 'Approving...' : 'Confirm Approval'}
              </button>
              <button
                onClick={() => {
                  setShowApproveModal(false);
                  setAdminNotes('');
                  setSelectedInvestment(null);
                }}
                disabled={processingId === selectedInvestment.id}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedInvestment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reject Investment</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this {selectedInvestment.amount} USDT {selectedInvestment.profile} investment.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={3}
                placeholder="Explain why this investment is being rejected..."
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReject}
                disabled={processingId === selectedInvestment.id || !rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                {processingId === selectedInvestment.id ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                  setSelectedInvestment(null);
                }}
                disabled={processingId === selectedInvestment.id}
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
