'use client';

import { useState } from 'react';
import { Search, User, AlertCircle, Loader2 } from 'lucide-react';
import { getUserByReferralCode } from '@/lib/mockData';

interface BorrowLenderDetailsProps {
  currentUserId: string;
  onContinue: (lenderUser: any, amount: string) => void;
  onBack: () => void;
}

export default function BorrowLenderDetails({ currentUserId, onContinue, onBack }: BorrowLenderDetailsProps) {
  const [lenderCode, setLenderCode] = useState('');
  const [lenderUser, setLenderUser] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);

  const searchLender = () => {
    setError('');
    if (!lenderCode) {
      setError('Please enter lender unique code');
      return;
    }

    setSearching(true);
    // Simulate API delay
    setTimeout(() => {
      const user = getUserByReferralCode(lenderCode);
      if (!user) {
        setError('Lender not found. Please check the code and try again.');
        setLenderUser(null);
      } else if (user.id === currentUserId) {
        setError('Cannot borrow from yourself');
        setLenderUser(null);
      } else {
        setLenderUser(user);
      }
      setSearching(false);
    }, 500);
  };

  const handleContinue = () => {
    setError('');

    if (!lenderUser) {
      setError('Please search and select a lender');
      return;
    }
    if (!amount || parseFloat(amount) < 500) {
      setError('Minimum borrow amount is ₹500');
      return;
    }

    onContinue(lenderUser, amount);
  };

  return (
    <div className="space-y-8">
      {/* Lender Code Search */}
      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
          Lender's Unique Code *
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={lenderCode}
            onChange={(e) => setLenderCode(e.target.value.toUpperCase())}
            placeholder="Enter unique code"
            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-mono placeholder:font-sans placeholder:text-slate-400 dark:placeholder:text-slate-600"
            maxLength={10}
            onKeyDown={(e) => e.key === 'Enter' && searchLender()}
          />
          <button
            onClick={searchLender}
            disabled={searching || !lenderCode}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-600/20"
          >
            {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            <span className="hidden sm:inline">{searching ? 'Searching...' : 'Search'}</span>
          </button>
        </div>
      </div>

      {/* Lender Info */}
      {lenderUser && (
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
          <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Lender Found
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/20">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-lg">{lenderUser.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{lenderUser.email}</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 font-mono">Code: {lenderUser.referralCode}</p>
            </div>
          </div>
        </div>
      )}

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
          Amount to Borrow * (Minimum ₹500)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-500 text-lg font-bold">
            ₹
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-xl font-bold placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-600"
            min="500"
            step="100"
          />
        </div>
      </div>

      {/* Quick Amount Buttons */}
      <div className="grid grid-cols-4 gap-3">
        {[500, 1000, 2000, 5000].map((quickAmount) => (
          <button
            key={quickAmount}
            type="button"
            onClick={() => setAmount(quickAmount.toString())}
            className={`px-3 py-2 rounded-lg transition-all font-semibold text-sm border ${amount === quickAmount.toString()
              ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/20'
              : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-purple-500/50 hover:text-purple-600 dark:hover:text-purple-400'
              }`}
          >
            ₹{quickAmount}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={onBack}
          className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl font-bold transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
