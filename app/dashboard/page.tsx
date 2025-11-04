'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  TrendingUp, LogOut, Users, DollarSign, Network, 
  Plus, Copy, Check, UserCheck, Activity 
} from 'lucide-react';
import { 
  mockUsers, mockInvestments, getDirectReferrals, 
  getAllDownline, getUserInvestments, User 
} from '@/lib/mockData';
import InvestmentForm from '@/components/InvestmentForm';

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (currentUser && !currentUser.isApproved) {
      router.push('/queue');
    }
  }, [isAuthenticated, currentUser, router]);

  if (!currentUser) {
    return null;
  }

  const directReferrals = getDirectReferrals(currentUser.id);
  const allDownline = getAllDownline(currentUser.id);
  const myInvestments = getUserInvestments(currentUser.id);
  const totalInvested = myInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalReturns = myInvestments
    .filter(inv => inv.status === 'active' || inv.status === 'matured')
    .reduce((sum, inv) => sum + inv.totalReturn, 0);
  
  // Get pending referrals (users waiting for approval)
  const pendingReferrals = directReferrals.filter(user => !user.isApproved);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(currentUser.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              <span className="text-lg sm:text-2xl font-bold text-gray-900">MLM Investment</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Requests Button */}
              {pendingReferrals.length > 0 && (
                <button
                  onClick={() => router.push('/requests')}
                  className="relative flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors font-semibold border-2 border-orange-200"
                >
                  <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Requests</span>
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shadow-lg">
                    {pendingReferrals.length}
                  </span>
                </button>
              )}
              
              <div className="text-right hidden md:block">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-semibold text-gray-900">{currentUser.name}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-xs sm:text-sm">Total Invested</span>
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">₹{totalInvested.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-xs sm:text-sm">Total Returns</span>
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <p className="text-lg sm:text-2xl font-bold text-green-600">₹{totalReturns.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-xs sm:text-sm">Direct Referrals</span>
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">{directReferrals.length}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-xs sm:text-sm">Total Network</span>
              <Network className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            </div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">{allDownline.length}</p>
          </div>
        </div>

        {/* Referral Code Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 text-white">
          <h3 className="text-base sm:text-lg font-semibold mb-3">Your Referral Code</h3>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2 sm:py-3 font-mono text-lg sm:text-xl font-bold text-center sm:text-left">
              {currentUser.referralCode}
            </div>
            <button
              onClick={copyReferralCode}
              className="bg-white text-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              {copiedCode ? (
                <>
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                  Copy
                </>
              )}
            </button>
          </div>
          <p className="text-sm text-blue-100 mt-3">
            Share this code with others to grow your network and earn together!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Investment Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">My Investments</h2>
              <button
                onClick={() => setShowInvestModal(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm sm:text-base w-full sm:w-auto justify-center"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                New Investment
              </button>
            </div>

            {myInvestments.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No investments yet</p>
                <button
                  onClick={() => setShowInvestModal(true)}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Make your first investment →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myInvestments.map((inv) => (
                  <div key={inv.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">₹{inv.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-600 capitalize">{inv.riskProfile} Risk</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        inv.status === 'active' ? 'bg-green-100 text-green-800' :
                        inv.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        inv.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Lock-in: {inv.lockInMonths} months</p>
                      <p className="text-green-600 font-semibold">Expected Return: ₹{inv.totalReturn.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Network Hierarchy */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">My Network Hierarchy</h2>
            
            {directReferrals.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No referrals yet</p>
                <p className="text-sm text-gray-500">Share your referral code to build your network</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-6">
                  <Network className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    View Your Complete Network Tree
                  </h3>
                  <p className="text-gray-600 mb-1">
                    You have <span className="font-bold text-blue-600">{allDownline.length}</span> members in your network
                  </p>
                  <p className="text-sm text-gray-500">
                    Including <span className="font-semibold">{directReferrals.length}</span> direct referrals
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => router.push('/hierarchy-flow')}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
                  >
                    <Network className="w-5 h-5" />
                    Tree View
                  </button>
                  <button
                    onClick={() => router.push('/hierarchy-flow')}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
                  >
                    <Activity className="w-5 h-5" />
                    Interactive Flow
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Investment Modal */}
      {showInvestModal && (
        <InvestmentModal
          currentUser={currentUser}
          onClose={() => setShowInvestModal(false)}
        />
      )}
    </div>
  );
}

// Investment Modal Component
function InvestmentModal({ currentUser, onClose }: { currentUser: User; onClose: () => void }) {
  const router = useRouter();
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Create New Investment</h2>
          <p className="text-gray-600 mt-1">Choose your investment amount and risk profile</p>
        </div>
        
        <div className="p-6">
          <InvestmentForm currentUser={currentUser} onSuccess={() => {
            onClose();
            router.refresh();
          }} />
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

