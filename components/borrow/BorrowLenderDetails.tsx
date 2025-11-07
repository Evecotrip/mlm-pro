'use client';

import { useState } from 'react';
import { Search, User, AlertCircle } from 'lucide-react';
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

  const searchLender = () => {
    setError('');
    if (!lenderCode) {
      setError('Please enter lender unique code');
      return;
    }
    
    const user = getUserByReferralCode(lenderCode);
    if (!user) {
      setError('Lender not found. Please check the code and try again.');
      setLenderUser(null);
      return;
    }
    
    if (user.id === currentUserId) {
      setError('Cannot borrow from yourself');
      setLenderUser(null);
      return;
    }
    
    setLenderUser(user);
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
    <div className="space-y-6">
      {/* Lender Code Search */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Lender's Unique Code *
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={lenderCode}
            onChange={(e) => setLenderCode(e.target.value.toUpperCase())}
            placeholder="Enter unique code"
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900 font-mono"
            maxLength={10}
          />
          <button
            onClick={searchLender}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors font-semibold flex items-center gap-2"
          >
            <Search className="w-5 h-5" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </div>

      {/* Lender Info */}
      {lenderUser && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
          <p className="text-sm text-green-700 font-semibold mb-3">✓ Lender Found</p>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">{lenderUser.name}</p>
              <p className="text-sm text-gray-600">{lenderUser.email}</p>
              <p className="text-xs text-gray-500 mt-1">Code: {lenderUser.referralCode}</p>
            </div>
          </div>
        </div>
      )}

      {/* Amount */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Amount to Borrow * (Minimum ₹500)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-semibold">
            ₹
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-xl font-semibold text-gray-900"
            min="500"
            step="100"
          />
        </div>
      </div>

      {/* Quick Amount Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {[500, 1000, 2000, 5000].map((quickAmount) => (
          <button
            key={quickAmount}
            type="button"
            onClick={() => setAmount(quickAmount.toString())}
            className="px-3 py-2 bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-600 rounded-lg transition-colors font-semibold text-sm"
          >
            ₹{quickAmount}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold transition-all shadow-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
