'use client';

import { useState } from 'react';
import { AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

interface DirectAddInitialProps {
  onContinue: (amount: string, currency: string) => void;
  onBack: () => void;
}

const CURRENCIES = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', min: 100 },
  { code: 'USD', name: 'US Dollar', symbol: '$', min: 10 },
  { code: 'EUR', name: 'Euro', symbol: '€', min: 10 },
  { code: 'GBP', name: 'British Pound', symbol: '£', min: 10 },
];

export default function DirectAddInitial({ onContinue, onBack }: DirectAddInitialProps) {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [error, setError] = useState('');

  const selectedCurrency = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

  const handleContinue = () => {
    setError('');
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (parseFloat(amount) < selectedCurrency.min) {
      setError(`Minimum amount is ${selectedCurrency.symbol}${selectedCurrency.min}`);
      return;
    }
    onContinue(amount, currency);
  };

  return (
    <div className="space-y-8">
      {/* Special Offer Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4 animate-pulse">
        <div className="flex items-start gap-3">
          <Sparkles className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
          <div>
            <p className="font-bold text-amber-400 mb-2">⭐ SPECIAL OFFER ⭐</p>
            <ul className="text-sm text-amber-300/80 space-y-1">
              <li>• Earn up to 10% bonus when you add money</li>
              <li>• Get a bonus of up to ₹1,000</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Currency Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
          Select Currency *
        </label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-base font-semibold appearance-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-700"
        >
          {CURRENCIES.map((curr) => (
            <option key={curr.code} value={curr.code} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
              {curr.symbol} {curr.name} ({curr.code})
            </option>
          ))}
        </select>
      </div>

      {/* Amount Input */}
      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
          Enter Amount to Add *
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-500 text-lg font-bold">
            {selectedCurrency.symbol}
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-xl font-bold placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-600"
            min={selectedCurrency.min}
            step="100"
          />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
          Minimum: {selectedCurrency.symbol}{selectedCurrency.min}
        </p>
      </div>

      {/* Quick Amount Buttons */}
      {currency === 'INR' && (
        <div className="grid grid-cols-4 gap-3">
          {[500, 1000, 5000, 10000].map((quickAmount) => (
            <button
              key={quickAmount}
              type="button"
              onClick={() => setAmount(quickAmount.toString())}
              className={`px-3 py-2 rounded-lg transition-all font-semibold text-sm border ${amount === quickAmount.toString()
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/20'
                : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
            >
              {quickAmount >= 1000 ? `${quickAmount / 1000}k` : quickAmount}
            </button>
          ))}
        </div>
      )}
      {currency === 'USD' && (
        <div className="grid grid-cols-4 gap-3">
          {[50, 100, 500, 1000].map((quickAmount) => (
            <button
              key={quickAmount}
              type="button"
              onClick={() => setAmount(quickAmount.toString())}
              className={`px-3 py-2 rounded-lg transition-all font-semibold text-sm border ${amount === quickAmount.toString()
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/20'
                : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
            >
              {quickAmount >= 1000 ? `${quickAmount / 1000}k` : quickAmount}
            </button>
          ))}
        </div>
      )}

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
          className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 flex items-center justify-center gap-2 group"
        >
          Continue
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
