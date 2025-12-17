'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, UserCheck, Wallet, HandCoins, Send, Menu, X, HelpCircle, Users } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Floating Pill Navbar */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
        <nav className="flex items-center justify-between px-4 py-2.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-full shadow-lg shadow-slate-900/5 dark:shadow-black/20">
          {/* Logo */}
          <div
            onClick={() => router.push('/dashboard')}
            className="cursor-pointer group relative"
          >
            <div className="absolute -inset-2 bg-blue-500/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Logo size="sm" />
          </div>

          {/* Desktop Center/Right Section */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Wallet Button */}
            {showWalletButton && (
              <button
                onClick={() => router.push('/wallet')}
                className="group flex items-center gap-2 px-3 py-1.5 hover:bg-emerald-500/10 rounded-full transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <Wallet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" />
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {parseFloat(balance?.available || '0').toLocaleString('en-IN')} USDT
                </span>
              </button>
            )}

            {/* Divider */}
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

            {/* User Requests */}
            {showRequestsButton && pendingRequestsCount > 0 && (
              <button
                onClick={() => router.push('/requests')}
                className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
                title="User Requests"
              >
                <UserCheck className="w-5 h-5" />
                <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
            )}

            {/* Investment Requests */}
            <button
              onClick={() => router.push('/investment-requests')}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
              title="Investment Requests"
            >
              <HandCoins className="w-5 h-5" />
            </button>

            {/* Borrow & Lend */}
            <button
              onClick={() => router.push('/borrow-lend')}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
              title="Borrow & Lend"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </button>

            {/* Transfers */}
            <button 
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
              onClick={() => router.push('/transfers')}
              title="Transfers"
            >
              <Send className="w-5 h-5" />
            </button>

            {/* KYC Requests */}
            <button
              onClick={() => router.push('/kyc-requests')}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
              title="KYC Requests"
            >
              <Users className="w-5 h-5" />
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Name */}
            {!isLoading && userName && (
              <div className="hidden xl:block text-right px-2">
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{userName}</p>
              </div>
            )}

            {/* Support */}
            <button
              onClick={() => router.push('/support')}
              className="group p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
              title="Support"
            >
              <HelpCircle className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="group p-2 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Mobile Right Section */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Mobile Wallet Balance */}
            {showWalletButton && (
              <button
                onClick={() => router.push('/wallet')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-500/10 rounded-full"
              >
                <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  {parseFloat(balance?.available || '0').toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Spacer for fixed navbar */}
      <div className="h-20"></div>

    {/* Mobile Menu Overlay */}
    {isMobileMenuOpen && (
      <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
        <div 
          className="absolute right-0 top-[73px] bottom-0 w-80 max-w-[85vw] bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 space-y-2">
            {/* User Info */}
            {!isLoading && userName && (
              <div className="pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
                <p className="text-base font-bold text-slate-900 dark:text-white">{userName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Verified User</p>
              </div>
            )}

            {/* Mobile Menu Items */}
            {showRequestsButton && pendingRequestsCount > 0 && (
              <button
                onClick={() => handleNavigation('/requests')}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                <div className="relative">
                  <UserCheck className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </div>
                <span className="font-medium">User Requests</span>
              </button>
            )}

            <button
              onClick={() => handleNavigation('/investment-requests')}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              <HandCoins className="w-5 h-5" />
              <span className="font-medium">Investment Requests</span>
            </button>

            <button
              onClick={() => handleNavigation('/borrow-lend')}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <span className="font-medium">Borrow & Lend</span>
            </button>

            <button
              onClick={() => handleNavigation('/transfers')}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              <Send className="w-5 h-5" />
              <span className="font-medium">Transfers</span>
            </button>

            {/* Logout Button */}
            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
