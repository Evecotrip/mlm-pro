'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import { 
  ArrowLeft, UserCheck, Mail, Phone, Calendar, CheckCircle, 
  XCircle, Clock, User as UserIcon, AlertCircle, Loader2
} from 'lucide-react';
import { getUserWalletBalance } from '@/lib/mockData';
import Navbar from '@/components/Navbar';
import { 
  getPendingApprovals, 
  getPendingApprovalCount, 
  approveUserRegistration, 
  rejectUserRegistration,
  PendingApproval 
} from '@/api/referrer-user-api';
import { getTokenFromCookies } from '@/api/register-user-api';

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
        
        console.log('Pending approvals response:', response);
        
        if (response.success && response.data) {
          // API response structure: { success: true, data: [...], pagination: {...} }
          const approvalsList = Array.isArray(response.data) ? response.data : [];
          const total = response.pagination?.total || approvalsList.length;
          
          console.log('Approvals list:', approvalsList);
          console.log('Total count:', total);
          
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
        // Remove from pending list
        setPendingApprovals(prev => prev.filter(a => a.id !== approvalId));
        const newCount = pendingCount - 1;
        setPendingCount(newCount);
        
        // Update global store
        const { updatePendingCount } = await import('@/store/useUserStore').then(m => m.useUserStore.getState());
        updatePendingCount(newCount);
        
        // Show success message
        alert(`Successfully approved ${userName}!`);
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
          // Remove from pending list
          setPendingApprovals(prev => prev.filter(a => a.id !== approvalId));
          const newCount = pendingCount - 1;
          setPendingCount(newCount);
          
          // Update global store
          const { updatePendingCount } = await import('@/store/useUserStore').then(m => m.useUserStore.getState());
          updatePendingCount(newCount);
          
          alert(`Successfully rejected ${userName}`);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
      {/* Navbar */}
      <Navbar
        onLogout={handleLogout}
        showRequestsButton={false}
      />

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Stats Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">
                {pendingCount} Pending {pendingCount === 1 ? 'Request' : 'Requests'}
              </h2>
              <p className="text-orange-100">
                Review and approve new members to your network
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4">
              <Clock className="w-8 h-8 sm:w-12 sm:h-12" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-semibold mb-1">Error Loading Requests</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Pending Requests List */}
        {pendingApprovals.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
            <p className="text-gray-600 mb-6">
              You have no pending approval requests at the moment.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingApprovals.map((approval) => {
              const userName = `${approval.requester.firstName} ${approval.requester.lastName}`;
              const requestData = approval.requestData as { name?: string; email?: string; referralCode?: string };
              
              return (
              <div
                key={approval.id}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 hover:border-orange-300 transition-all overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1 w-full">
                      {/* Avatar */}
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-lg sm:text-2xl font-bold shadow-lg flex-shrink-0">
                        {approval.requester.firstName.charAt(0)}
                      </div>
                      
                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{userName}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span className="text-sm">{approval.requester.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <UserIcon className="w-4 h-4" />
                            <span className="text-sm">ID: {approval.requester.uniqueCode || 'Pending'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                              Requested: {new Date(approval.requestedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold">
                      <Clock className="w-4 h-4" />
                      Pending
                    </div>
                  </div>

                  {/* Referral Code */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Used Referral Code</p>
                        <p className="font-mono font-bold text-gray-900">{requestData.referralCode || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Request ID</p>
                        <p className="font-mono text-xs text-gray-900">
                          {approval.id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Info Alert */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Review Before Approval</p>
                      <p>
                        This user signed up using your referral code. Once approved, they will gain 
                        access to the dashboard and can start investing.
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-3">
                    <button
                      onClick={() => handleApprove(approval.id, userName)}
                      disabled={approving === approval.id}
                      className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {approving === approval.id ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Approving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Approve User
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleReject(approval.id, userName)}
                      disabled={approving === approval.id}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-red-300 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-400 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject
                    </button>
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
