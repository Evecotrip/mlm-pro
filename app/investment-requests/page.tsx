'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import {
  CheckCircle, Clock, XCircle, Calendar, Filter, TrendingUp, User as UserIcon,
  DollarSign, AlertCircle, ThumbsUp, ThumbsDown, Loader2, Search
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
      //console.log('Fetched investments response:', response);
      if (response.success && response.data) {
        // response.data is already the array of investments
        const investmentsArray = Array.isArray(response.data) ? response.data : (response.data.data || []);
        //console.log('Setting investments:', investmentsArray);
        setInvestments(investmentsArray);
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

    //console.log('Approving investment:', selectedInvestment.id, 'with notes:', adminNotes);
    setProcessingId(selectedInvestment.id);
    try {
      const response = await approveInvestment(selectedInvestment.id, adminNotes);
      //console.log('Approve response:', response);

      if (response.success) {
        //console.log('Investment approved successfully');
        setShowApproveModal(false);
        setAdminNotes('');
        setSelectedInvestment(null);
        fetchPendingApprovals();
      } else {
        console.error('Approval failed:', response.error);
        alert(`Failed to approve: ${response.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error approving investment:', error);
      alert('An error occurred while approving the investment');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!selectedInvestment || !rejectionReason.trim()) return;

    //console.log('Rejecting investment:', selectedInvestment.id, 'with reason:', rejectionReason);
    setProcessingId(selectedInvestment.id);
    try {
      const response = await rejectInvestment(selectedInvestment.id, rejectionReason);
      //console.log('Reject response:', response);

      if (response.success) {
        //console.log('Investment rejected successfully');
        setShowRejectModal(false);
        setRejectionReason('');
        setSelectedInvestment(null);
        fetchPendingApprovals();
      } else {
        console.error('Rejection failed:', response.error);
        alert(`Failed to reject: ${response.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error rejecting investment:', error);
      alert('An error occurred while rejecting the investment');
    } finally {
      setProcessingId(null);
    }
  };

  const getProfileStyles = (profile: string) => {
    switch (profile) {
      case 'BRONZE':
        return { bg: 'bg-amber-100 dark:bg-amber-500/10', text: 'text-amber-700 dark:text-amber-500', border: 'border-amber-200 dark:border-amber-500/20' };
      case 'SILVER':
        return { bg: 'bg-slate-200 dark:bg-slate-400/10', text: 'text-slate-700 dark:text-slate-400', border: 'border-slate-300 dark:border-slate-400/20' };
      case 'GOLD':
        return { bg: 'bg-yellow-100 dark:bg-yellow-500/10', text: 'text-yellow-700 dark:text-yellow-500', border: 'border-yellow-200 dark:border-yellow-500/20' };
      case 'DIAMOND':
        return { bg: 'bg-cyan-100 dark:bg-cyan-500/10', text: 'text-cyan-700 dark:text-cyan-500', border: 'border-cyan-200 dark:border-cyan-500/20' };
      default:
        return { bg: 'bg-slate-100 dark:bg-slate-500/10', text: 'text-slate-700 dark:text-slate-500', border: 'border-slate-200 dark:border-slate-500/20' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 dark:text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading investment requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-purple-500/30 transition-colors duration-300">
      <Navbar onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Investment Requests
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Review and approve pending investment requests from your referrals</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total Pending</span>
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Clock className="w-5 h-5 text-purple-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{investments.length}</p>
          </div>

          {['BRONZE', 'SILVER', 'GOLD'].map((profile) => {
            const count = investments.filter(inv => inv.profile === profile).length;
            const styles = getProfileStyles(profile);
            return (
              <div key={profile} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">{profile}</span>
                  <div className={`p-2 ${styles.bg} rounded-lg`}>
                    <TrendingUp className={`w-5 h-5 ${styles.text}`} />
                  </div>
                </div>
                <p className={`text-3xl font-bold ${styles.text}`}>{count}</p>
              </div>
            );
          })}
        </div>

        {/* Profile Filter */}
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800 p-4 mb-8 shadow-sm dark:shadow-none">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-5 h-5 text-slate-500 dark:text-slate-500" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400 mr-2">Filter by Profile:</span>
            {['all', 'BRONZE', 'SILVER', 'GOLD', 'DIAMOND'].map((profile) => (
              <button
                key={profile}
                onClick={() => setProfileFilter(profile as any)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${profileFilter === profile
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                  : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
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
            {investments.map((investment) => {
              const styles = getProfileStyles(investment.profile);
              return (
                <div
                  key={investment.id}
                  className="group bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:border-purple-500/50 transition-all shadow-sm dark:shadow-none"
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                          <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                              {investment.amount} USDT
                            </h3>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${styles.bg} ${styles.text} ${styles.border}`}>
                              {investment.profile}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-500 font-mono">
                            Ref: {investment.referenceId}
                          </p>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-100 dark:bg-slate-950/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
                        {investment.user && (
                          <div>
                            <p className="text-xs text-slate-500 dark:text-slate-500 mb-1">Investor</p>
                            <div className="flex items-center gap-2">
                              <UserIcon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400" />
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                {investment.user.firstName} {investment.user.lastName}
                              </span>
                            </div>
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-500 mb-1">Expected Return</p>
                          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                            {investment.expectedMinReturn} - {investment.expectedMaxReturn} USDT
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-500 mb-1">Lock-in Period</p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {investment.lockInMonths} months
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-500 mb-1">Created</p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-500" />
                            {formatDate(investment.createdAt)}
                          </p>
                        </div>
                      </div>

                      {investment.notes && (
                        <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-950/30 rounded-lg border border-slate-200 dark:border-slate-800/50">
                          <p className="text-xs text-slate-500 dark:text-slate-500 mb-1">Notes:</p>
                          <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{investment.notes}"</p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex lg:flex-col gap-3 w-full lg:w-auto min-w-[140px]">
                      <button
                        onClick={() => {
                          setSelectedInvestment(investment);
                          setShowApproveModal(true);
                        }}
                        disabled={processingId === investment.id}
                        className="flex-1 lg:flex-none px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-emerald-600/20"
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
                        className="flex-1 lg:flex-none px-4 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-500/20 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-500 border border-slate-300 dark:border-slate-700 hover:border-red-500/50 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <ThumbsDown className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm dark:shadow-none">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-slate-400 dark:text-slate-600" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium text-lg mb-2">No pending investment requests</p>
            <p className="text-slate-500 text-sm">
              {profileFilter !== 'all' ? 'Try changing the profile filter' : 'Investment requests from your referrals will appear here'}
            </p>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </main>

      {/* Approve Modal */}
      {showApproveModal && selectedInvestment && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Approve Investment</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Are you sure you want to approve this <span className="text-slate-900 dark:text-white font-bold">{selectedInvestment.amount} USDT</span> {selectedInvestment.profile} investment?
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Admin Notes (Optional)
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                rows={3}
                placeholder="Add any notes about this approval..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleApprove}
                disabled={processingId === selectedInvestment.id}
                className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors disabled:opacity-50"
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
                className="flex-1 px-4 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedInvestment && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Reject Investment</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Please provide a reason for rejecting this <span className="text-slate-900 dark:text-white font-bold">{selectedInvestment.amount} USDT</span> investment.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Rejection Reason *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                rows={3}
                placeholder="Explain why this investment is being rejected..."
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReject}
                disabled={processingId === selectedInvestment.id || !rejectionReason.trim()}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-colors disabled:opacity-50"
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
                className="flex-1 px-4 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-colors disabled:opacity-50"
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
