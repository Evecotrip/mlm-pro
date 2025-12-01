'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, UserCheck, Wallet, HandCoins, Bell, ChevronDown, Clock, DollarSign, Banknote, Send } from 'lucide-react';
import Logo from './Logo';
import { useUserStore } from '@/store/useUserStore';
import { useWalletStore } from '@/store/useWalletStore';
import { ThemeToggle } from './ThemeToggle';

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
  const hasFetchedData = useRef(false);

  // User store
  const userName = useUserStore((state) => state.userName);
  const pendingRequestsCount = useUserStore((state) => state.pendingRequestsCount);
  const isLoading = useUserStore((state) => state.isLoading);
  const fetchUserData = useUserStore((state) => state.fetchUserData);
  const fetchPendingCount = useUserStore((state) => state.fetchPendingCount);

  // Wallet store
  const balance = useWalletStore((state) => state.balance);
  const fetchWallet = useWalletStore((state) => state.fetchWallet);

  // Fetch data on mount
  useEffect(() => {
    if (!hasFetchedData.current) {
      hasFetchedData.current = true;
      fetchUserData();
      fetchPendingCount();
      fetchWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo with glow effect */}
          <div
            onClick={() => router.push('/dashboard')}
            className="cursor-pointer group relative"
          >
            <div className="absolute -inset-2 bg-blue-500/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Logo size="sm" />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Wallet Button - Premium Pill */}
            {showWalletButton && (
              <button
                onClick={() => router.push('/wallet')}
                className="group relative flex items-center gap-3 pl-4 pr-5 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]"
              >
                <div className="flex flex-col items-end leading-none">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Balance</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {parseFloat(balance?.available || '0').toLocaleString('en-IN')} USDT
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                </div>
              </button>
            )}

            {/* Action Buttons Group */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-full p-1">
              {/* User Requests */}
              {showRequestsButton && pendingRequestsCount > 0 && (
                <button
                  onClick={() => router.push('/requests')}
                  className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 rounded-full transition-all group"
                  title="User Requests"
                >
                  <UserCheck className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-100 dark:border-slate-900 animate-pulse"></span>
                </button>
              )}

              {/* Investment Requests */}
              <button
                onClick={() => router.push('/investment-requests')}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 rounded-full transition-all"
                title="Investment Requests"
              >
                <HandCoins className="w-5 h-5" />
              </button>

              {/* My Add Money Requests */}
              <button
                onClick={() => router.push('/my-add-money-requests')}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 rounded-full transition-all"
                title="My Add Money Requests"
              >
                <DollarSign className="w-5 h-5" />
              </button>

              {/* Lending Requests */}
              <button
                onClick={() => router.push('/lend-requests')}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 rounded-full transition-all"
                title="Lending Requests"
              >
                <Banknote className="w-5 h-5" />
              </button>

              {/* My Borrow Requests */}
              <button
                onClick={() => router.push('/my-borrow-requests')}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 rounded-full transition-all"
                title="My Borrow Requests"
              >
                <Clock className="w-5 h-5" />
              </button>

              {/* Notifications (Placeholder) */}
              <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 rounded-full transition-all">
                <Bell className="w-5 h-5" />
              </button>

            

              {/* Transfer Requests */}
              <button 
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 rounded-full transition-all"
                onClick={() => router.push('/transfers')}
                title="Transfer Money"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile & Logout */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
              <ThemeToggle />

              {!isLoading && userName && (
                <div className="hidden md:block text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{userName}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-wider">Verified User</p>
                </div>
              )}

              <button
                onClick={onLogout}
                className="group p-2 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
