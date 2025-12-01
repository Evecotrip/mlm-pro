'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import {
  ArrowLeft, UserCheck, Mail, Phone, Calendar, CheckCircle,
  XCircle, Clock, User as UserIcon, AlertCircle, Loader2,
  Search, Shield
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import {
  getPendingApprovals,
  approveUserRegistration,
  rejectUserRegistration,
  PendingApproval
} from '@/api/referrer-user-api';

export default function RequestsPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [approving, setApproving] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState(0);

  // Check authentication
  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push('/login');
    }
  }, [isLoaded, user, router]);

  // Fetch pending approvals
  useEffect(() => {
    if (!user) return;

    const fetchPendingApprovals = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getPendingApprovals(1, 50);

        if (response.success && response.data) {
          const approvalsList = Array.isArray(response.data) ? response.data : [];
          const total = response.pagination?.total || approvalsList.length;

          setPendingApprovals(approvalsList);
          setPendingCount(total);
        } else {
          setError(response.message || 'Failed to fetch pending approvals');
          setPendingApprovals([]);
          setPendingCount(0);
        }
      } catch (err) {
        console.error('Error fetching approvals:', err);
        setError('An error occurred while fetching approvals');
        setPendingApprovals([]);
        setPendingCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingApprovals();
  }, [user]);

  const handleApprove = async (approvalId: string, userName: string) => {
    setApproving(approvalId);

    try {
      const response = await approveUserRegistration(
        approvalId,
        `Welcome to AuramX, ${userName}!`
      );

      if (response.success) {
        setPendingApprovals(prev => prev.filter(a => a.id !== approvalId));
        const newCount = pendingCount - 1;
        setPendingCount(newCount);

        const { updatePendingCount } = await import('@/store/useUserStore').then(m => m.useUserStore.getState());
        updatePendingCount(newCount);

        // Optional: Show toast notification instead of alert
      } else {
        alert(response.message || 'Failed to approve user');
      }
    } catch (err) {
      console.error('Error approving user:', err);
      alert('An error occurred while approving the user');
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async (approvalId: string, userName: string) => {
    const reason = prompt(`Please provide a reason for rejecting ${userName}:`);

    if (!reason) return;

    if (confirm(`Are you sure you want to reject ${userName}? This action cannot be undone.`)) {
      setApproving(approvalId);

      try {
        const response = await rejectUserRegistration(approvalId, reason);

        if (response.success) {
          setPendingApprovals(prev => prev.filter(a => a.id !== approvalId));
          const newCount = pendingCount - 1;
          setPendingCount(newCount);

          const { updatePendingCount } = await import('@/store/useUserStore').then(m => m.useUserStore.getState());
          updatePendingCount(newCount);
        } else {
          alert(response.message || 'Failed to reject user');
        }
      } catch (err) {
        console.error('Error rejecting user:', err);
        alert('An error occurred while rejecting the user');
      } finally {
        setApproving(null);
      }
    }
  };

  const handleLogout = async () => {
    const { clearUserData } = await import('@/store/useUserStore').then(m => m.useUserStore.getState());
    clearUserData();
    await signOut();
    router.push('/');
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-blue-500/30 transition-colors duration-300">
      <Navbar onLogout={handleLogout} showRequestsButton={false} />

      <main className="container mx-auto px-4 py-8">
        {/* Stats Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 shadow-2xl mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {pendingCount} Pending {pendingCount === 1 ? 'Request' : 'Requests'}
              </h2>
              <p className="text-blue-100 max-w-xl">
                Review and approve new members to your network. Building a strong team starts with verifying your referrals.
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <UserCheck className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800 dark:text-red-400">
              <p className="font-semibold mb-1">Error Loading Requests</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Pending Requests List */}
        {pendingApprovals.length === 0 ? (
          <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm dark:shadow-none">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">All Caught Up!</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
              You have no pending approval requests at the moment. Share your referral code to grow your network.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all font-semibold shadow-lg shadow-blue-600/20"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {pendingApprovals.map((approval) => {
              const userName = `${approval.requester.firstName} ${approval.requester.lastName}`;
              const requestData = approval.requestData as { name?: string; email?: string; referralCode?: string };

              return (
                <div
                  key={approval.id}
                  className="group bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 p-6 hover:border-blue-500/50 transition-all duration-300 shadow-sm dark:shadow-none"
                >
                  <div className="flex flex-col lg:flex-row items-start gap-6">
                    {/* Avatar & Info */}
                    <div className="flex items-start gap-4 flex-1 w-full">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg flex-shrink-0">
                        {approval.requester.firstName.charAt(0)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{userName}</h3>
                          <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-500/20 rounded-full text-xs font-bold flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            Pending
                          </span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-y-2 gap-x-8 text-sm text-slate-600 dark:text-slate-400 mt-2">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                            <span>{approval.requester.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                            <span>ID: {approval.requester.uniqueCode || 'Pending'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                            <span>
                              {new Date(approval.requestedAt).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Details & Actions */}
                    <div className="w-full lg:w-auto flex flex-col gap-4 min-w-[300px]">
                      <div className="bg-slate-100 dark:bg-slate-950/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500 dark:text-slate-500">Referral Code</span>
                          <span className="font-mono font-bold text-slate-900 dark:text-white">{requestData.referralCode || 'N/A'}</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(approval.id, userName)}
                          disabled={approving === approval.id}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all font-bold shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {approving === approval.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle className="w-5 h-5" />
                              Approve
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleReject(approval.id, userName)}
                          disabled={approving === approval.id}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-500/20 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-500 border border-slate-300 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-500/50 rounded-xl transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <XCircle className="w-5 h-5" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
