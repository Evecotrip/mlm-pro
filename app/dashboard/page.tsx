'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  TrendingUp, LogOut, Users, DollarSign, Network, 
  Plus, Copy, Check, UserCheck, Activity, Wallet, Sparkles 
} from 'lucide-react';
import { 
  mockUsers, mockInvestments, getDirectReferrals, 
  getAllDownline, getUserInvestments, User, getUserWalletBalance 
} from '@/lib/mockData';
import InvestmentModal from '@/components/InvestmentModal';
import Navbar from '@/components/Navbar';

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
  
  const pendingReferrals = directReferrals.filter(user => !user.isApproved);
  const walletBalance = getUserWalletBalance(currentUser.id);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navbar */}
      <Navbar
        currentUser={currentUser}
        walletBalance={walletBalance}
        pendingRequestsCount={pendingReferrals.length}
        onLogout={handleLogout}
      />

      <main className="relative container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-3 sm:p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center justify-between mb-2">
              <span className="text-gray-600 text-xs sm:text-sm font-medium">Total Invested</span>
              <div className="p-2 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
            </div>
            <p className="relative text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
              ₹{totalInvested.toLocaleString()}
            </p>
          </div>

          <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-3 sm:p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center justify-between mb-2">
              <span className="text-gray-600 text-xs sm:text-sm font-medium">Total Returns</span>
              <div className="p-2 bg-green-100 rounded-lg group-hover:scale-110 transition-transform">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
            </div>
            <p className="relative text-lg sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 text-transparent bg-clip-text">
              ₹{totalReturns.toLocaleString()}
            </p>
          </div>

          <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-3 sm:p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center justify-between mb-2">
              <span className="text-gray-600 text-xs sm:text-sm font-medium">Direct Referrals</span>
              <div className="p-2 bg-purple-100 rounded-lg group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
            </div>
            <p className="relative text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              {directReferrals.length}
            </p>
          </div>

          <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-3 sm:p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center justify-between mb-2">
              <span className="text-gray-600 text-xs sm:text-sm font-medium">Total Network</span>
              <div className="p-2 bg-orange-100 rounded-lg group-hover:scale-110 transition-transform">
                <Network className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              </div>
            </div>
            <p className="relative text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 text-transparent bg-clip-text">
              {allDownline.length}
            </p>
          </div>
        </div>

        {/* Enhanced Referral Code Section */}
        <div className="relative group bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-4 sm:p-6 mb-6 sm:mb-8 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          
          <div className="relative">
            <h3 className="text-base sm:text-lg font-semibold mb-3 flex items-center gap-2">
              Your Referral Code
              <Sparkles className="w-4 h-4 animate-pulse" />
            </h3>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2 sm:py-3 font-mono text-lg sm:text-xl font-bold text-center sm:text-left border-2 border-white/30 shadow-inner">
                {currentUser.referralCode}
              </div>
              <button
                onClick={copyReferralCode}
                className="bg-white text-purple-600 px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-blue-50 transition-all font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                    Copy Code
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-white/90 mt-3 flex items-center gap-2">
              <span>✨</span>
              Share this code with others to grow your network and earn together!
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Enhanced Investment Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                My Investments
              </h2>
              <button
                onClick={() => setShowInvestModal(true)}
                className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 sm:px-4 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold text-sm sm:text-base w-full sm:w-auto justify-center shadow-lg hover:shadow-2xl hover:scale-105"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform" />
                New Investment
              </button>
            </div>

            {myInvestments.length === 0 ? (
              <div className="text-center py-12">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-50"></div>
                  <DollarSign className="relative w-16 h-16 text-gray-400 mx-auto" />
                </div>
                <p className="text-gray-600 mb-4 font-medium">No investments yet</p>
                <button
                  onClick={() => setShowInvestModal(true)}
                  className="text-blue-600 hover:text-purple-600 font-semibold transition-colors"
                >
                  Make your first investment →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myInvestments.map((inv) => (
                  <div key={inv.id} className="group relative border-2 border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-all hover:shadow-lg bg-gradient-to-br from-white to-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-gray-900 text-lg">₹{inv.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-600 capitalize flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          {inv.riskProfile} Risk
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                        inv.status === 'active' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' :
                        inv.status === 'pending' ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200' :
                        inv.status === 'approved' ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200' :
                        'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <span className="font-medium">Lock-in:</span>
                        <span>{inv.lockInMonths} months</span>
                      </p>
                      <p className="flex items-center gap-2 text-green-600 font-semibold mt-1">
                        <TrendingUp className="w-4 h-4" />
                        Expected Return: ₹{inv.totalReturn.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Investment History Button */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => router.push('/investment-history')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-50 hover:to-purple-50 text-gray-700 hover:text-blue-600 rounded-xl transition-all font-semibold shadow-sm hover:shadow-md"
              >
                <Activity className="w-5 h-5" />
                View Investment History
              </button>
            </div>
          </div>

          {/* Enhanced Network Hierarchy */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text mb-4 sm:mb-6">
              My Network Hierarchy
            </h2>
            
            {directReferrals.length === 0 ? (
              <div className="text-center py-12">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-50"></div>
                  <Users className="relative w-16 h-16 text-gray-400 mx-auto" />
                </div>
                <p className="text-gray-600 mb-2 font-medium">No referrals yet</p>
                <p className="text-sm text-gray-500">Share your referral code to build your network</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-6">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <Network className="relative w-16 h-16 text-blue-600 mx-auto mb-4" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    View Your Complete Network Tree
                  </h3>
                  <p className="text-gray-600 mb-1">
                    You have <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">{allDownline.length}</span> members in your network
                  </p>
                  <p className="text-sm text-gray-500">
                    Including <span className="font-semibold">{directReferrals.length}</span> direct referrals
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => router.push('/hierarchy-flow')}
                    className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all font-semibold shadow-lg hover:shadow-2xl hover:scale-105"
                  >
                    <Network className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Tree View
                  </button>
                  
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Enhanced Investment Modal */}
      {showInvestModal && (
        <InvestmentModal
          currentUser={currentUser}
          onClose={() => setShowInvestModal(false)}
          onSuccess={() => {
            setShowInvestModal(false);
            router.refresh();
          }}
        />
      )}

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}