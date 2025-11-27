'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, UserCheck, Wallet, HandCoins } from 'lucide-react';
import Logo from './Logo';
import { useUserStore } from '@/store/useUserStore';

interface NavbarProps {
  onLogout: () => void;
  showWalletButton?: boolean;
  showRequestsButton?: boolean;
}

export default function Navbar({ 
  onLogout,
  showWalletButton = true,
  showRequestsButton = true
}: NavbarProps) {
  const router = useRouter();
  
  // Zustand store
  const userName = useUserStore((state) => state.userName);
  const walletBalance = useUserStore((state) => state.walletBalance);
  const pendingRequestsCount = useUserStore((state) => state.pendingRequestsCount);
  const isLoading = useUserStore((state) => state.isLoading);
  const fetchUserData = useUserStore((state) => state.fetchUserData);
  const fetchPendingCount = useUserStore((state) => state.fetchPendingCount);

  // Fetch data on mount
  useEffect(() => {
    fetchUserData();
    fetchPendingCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/30 bg-gradient-to-r from-white/80 via-purple-50/80 to-pink-50/80 backdrop-blur-2xl shadow-xl">
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-purple-500 to-pink-500"></div>
      
      <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          {/* Logo with glow effect */}
          <div 
            onClick={() => router.push('/dashboard')}
            className="cursor-pointer hover:scale-105 transition-all duration-300 relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
            <Logo size="sm" />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wallet Button - Enhanced */}
            {showWalletButton && (
              <button
                onClick={() => router.push('/wallet')}
                className="group relative flex items-center gap-2 px-3 sm:px-5 py-2.5 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-2xl transition-all shadow-lg hover:shadow-emerald-500/50 hover:shadow-2xl hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                <Wallet className="relative w-5 h-5 drop-shadow-lg" />
                <div className="relative flex flex-col items-start">
                  <span className="text-[10px] hidden sm:block opacity-90 font-medium">Wallet</span>
                  <span className="text-sm sm:text-base font-bold tracking-wide">{walletBalance.toLocaleString('en-IN')} USDT</span>
                </div>
                <div className="absolute -right-1 -top-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                <div className="absolute -right-1 -top-1 w-3 h-3 bg-green-400 rounded-full"></div>
              </button>
            )}

            {/* User Requests Button - Enhanced */}
            {showRequestsButton && pendingRequestsCount > 0 && (
              <button
                onClick={() => router.push('/requests')}
                className="relative flex items-center gap-2 px-3 sm:px-5 py-2.5 bg-gradient-to-br from-orange-50 to-red-50 text-orange-600 hover:from-orange-100 hover:to-red-100 rounded-2xl transition-all font-bold border-2 border-orange-300 hover:border-orange-400 hover:scale-105 shadow-lg hover:shadow-orange-500/30"
              >
                <UserCheck className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">User Requests</span>
                <span className="absolute -top-2 -right-2 bg-gradient-to-br from-red-500 via-pink-500 to-rose-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg shadow-red-500/50 animate-bounce border-2 border-white">
                  {pendingRequestsCount}
                </span>
              </button>
            )}

            {/* Investment Requests Button - Enhanced */}
            <button
              onClick={() => router.push('/investment-requests')}
              className="group relative flex items-center gap-2 px-3 sm:px-5 py-2.5 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 text-white rounded-2xl transition-all shadow-lg hover:shadow-purple-500/50 hover:shadow-2xl hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
              <HandCoins className="relative w-5 h-5 drop-shadow-lg animate-bounce" />
              <span className="relative text-sm font-bold hidden sm:inline">Investment Requests</span>
            </button>

            {/* Lend Requests Button - Enhanced */}
            <button
              onClick={() => router.push('/lend-requests')}
              className="group relative flex items-center gap-2 px-3 sm:px-5 py-2.5 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 text-white rounded-2xl transition-all shadow-lg hover:shadow-green-500/50 hover:shadow-2xl hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
              <HandCoins className="relative w-5 h-5 drop-shadow-lg" />
              <span className="relative text-sm font-bold hidden sm:inline">Lend Requests</span>
            </button>
            
            {/* User Info - Enhanced */}
            {!isLoading && userName && (
              <div className="text-right hidden lg:block px-4 py-2 bg-white/60 backdrop-blur-sm rounded-2xl border border-purple-200 shadow-md">
                <p className="text-xs text-gray-500 font-medium">Welcome back,</p>
                <p className="text-sm font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-transparent bg-clip-text">
                  {userName}
                </p>
              </div>
            )}

            {/* Logout Button - Enhanced */}
            <button
              onClick={onLogout}
              className="group relative flex items-center gap-2 px-3 sm:px-4 py-2.5 text-red-600 hover:text-white bg-red-50 hover:bg-gradient-to-br hover:from-red-500 hover:to-rose-600 rounded-2xl transition-all hover:scale-105 border-2 border-red-200 hover:border-red-500 shadow-md hover:shadow-red-500/30"
            >
              <LogOut className="w-5 h-5 transition-transform group-hover:rotate-12" />
              <span className="hidden sm:inline font-semibold text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom decorative glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
    </header>
  );
}
