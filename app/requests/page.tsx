'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, UserCheck, Mail, Phone, Calendar, CheckCircle, 
  XCircle, Clock, User as UserIcon, AlertCircle
} from 'lucide-react';
import { getDirectReferrals, User } from '@/lib/mockData';

export default function RequestsPage() {
  const router = useRouter();
  const { currentUser, isAuthenticated } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [approving, setApproving] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (currentUser && !currentUser.isApproved) {
      router.push('/queue');
    }
  }, [isAuthenticated, currentUser, router]);

  useEffect(() => {
    if (currentUser) {
      const directReferrals = getDirectReferrals(currentUser.id);
      const pending = directReferrals.filter(user => !user.isApproved);
      setPendingUsers(pending);
    }
  }, [currentUser]);

  if (!currentUser) {
    return null;
  }

  const handleApprove = (userId: string) => {
    setApproving(userId);
    
    // Get users from localStorage
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const updatedUsers = users.map((u: User) => 
        u.id === userId ? { ...u, isApproved: true } : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Update pending users list
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
      
      setTimeout(() => {
        setApproving(null);
      }, 1000);
    }
  };

  const handleReject = (userId: string) => {
    if (confirm('Are you sure you want to reject this user? This action cannot be undone.')) {
      // Get users from localStorage
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const updatedUsers = users.filter((u: User) => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        // Update pending users list
        setPendingUsers(prev => prev.filter(u => u.id !== userId));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
            <div className="h-8 w-px bg-gray-300" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center shadow-lg">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Approval Requests</h1>
                <p className="text-xs text-gray-500">Manage pending referrals</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {pendingUsers.length} Pending {pendingUsers.length === 1 ? 'Request' : 'Requests'}
              </h2>
              <p className="text-orange-100">
                Review and approve new members to your network
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <Clock className="w-12 h-12" />
            </div>
          </div>
        </div>

        {/* Pending Requests List */}
        {pendingUsers.length === 0 ? (
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
            {pendingUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 hover:border-orange-300 transition-all overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Avatar */}
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {user.name.charAt(0)}
                      </div>
                      
                      {/* User Info */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span className="text-sm">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span className="text-sm">{user.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                              Joined: {new Date(user.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
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
                        <p className="text-xs text-gray-500 mb-1">Referral Code</p>
                        <p className="font-mono font-bold text-gray-900">{user.referralCode}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Date of Birth</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(user.dateOfBirth).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
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
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleApprove(user.id)}
                      disabled={approving === user.id}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {approving === user.id ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                      onClick={() => handleReject(user.id)}
                      disabled={approving === user.id}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-red-300 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-400 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
