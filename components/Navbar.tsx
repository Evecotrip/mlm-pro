'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LogOut, UserCheck, Wallet, Sparkles, HandCoins } from 'lucide-react';
import { User } from '@/lib/mockData';

interface NavbarProps {
  currentUser: User;
  walletBalance: number;
  pendingRequestsCount?: number;
  onLogout: () => void;
  showWalletButton?: boolean;
  showRequestsButton?: boolean;
}

export default function Navbar({ 
  currentUser, 
  walletBalance, 
  pendingRequestsCount = 0,
  onLogout,
  showWalletButton = true,
  showRequestsButton = true
}: NavbarProps) {
  const router = useRouter();

  return (
    <header className="relative border-b border-white/20 bg-white/70 backdrop-blur-xl shadow-lg">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 group"
          >
            <div className="relative w-8 h-8 sm:w-12 sm:h-12">
              <Image
                src="/14386.gif"
                alt="AuramX Logo"
                width={48}
                height={48}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
              AuramX
            </span>
            <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
          </button>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Wallet Button */}
            {showWalletButton && (
              <button
                onClick={() => router.push('/wallet')}
                className="group relative flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-xl transition-all shadow-lg hover:shadow-2xl hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Wallet className="relative w-4 h-4 sm:w-5 sm:h-5" />
                <div className="relative flex flex-col items-start">
                  <span className="text-xs hidden sm:block opacity-90">Wallet</span>
                  <span className="text-xs sm:text-sm font-bold">₹{walletBalance.toLocaleString('en-IN')}</span>
                </div>
              </button>
            )}

            {/* Requests Button */}
            {showRequestsButton && pendingRequestsCount > 0 && (
              <button
                onClick={() => router.push('/requests')}
                className="relative flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-600 hover:from-orange-200 hover:to-red-200 rounded-xl transition-all font-semibold border-2 border-orange-300 hover:scale-105 shadow-md"
              >
                <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">User Requests</span>
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shadow-lg animate-pulse">
                  {pendingRequestsCount}
                </span>
              </button>
            )}

            {/* Money Request Button */}
            <button
              onClick={() => router.push('/money-requests')}
              className="group relative flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl transition-all shadow-lg hover:shadow-2xl hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <HandCoins className="relative w-4 h-4 sm:w-5 sm:h-5" />
              <span className="relative text-xs sm:text-sm font-bold hidden sm:inline">Money Requests</span>
            </button>
            
            {/* User Info */}
            <div className="text-right hidden md:block">
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                {currentUser.name}
              </p>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all hover:scale-105"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
