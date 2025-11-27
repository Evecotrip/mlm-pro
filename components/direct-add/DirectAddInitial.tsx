'use client';

import { useState } from 'react';
import { AlertCircle, Sparkles } from 'lucide-react';

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

  /* 
  const calculateBonus = (amt: number): number => {
    // Example: 10% bonus up to ₹1,000
    const bonus = Math.min(amt * 0.1, 1000);
    return bonus;
  };

  const bonus = amount ? calculateBonus(parseFloat(amount)) : 0;
  const totalCredit = amount ? parseFloat(amount) + bonus : 0;
  */

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
    <div className="space-y-6">
      {/* Special Offer Banner */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <p className="font-bold text-yellow-900 mb-2">⭐ SPECIAL OFFER ⭐</p>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Earn up to 10% bonus when you add money</li>
              <li>• Get a bonus of up to ₹1,000</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Currency Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Currency *
        </label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors text-base font-semibold text-gray-900"
        >
          {CURRENCIES.map((curr) => (
            <option key={curr.code} value={curr.code}>
              {curr.symbol} {curr.name} ({curr.code})
            </option>
          ))}
        </select>
      </div>

      {/* Amount Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Enter Amount to Add *
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-semibold">
            {selectedCurrency.symbol}
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors text-xl font-semibold text-gray-900"
            min={selectedCurrency.min}
            step="100"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Minimum: {selectedCurrency.symbol}{selectedCurrency.min}
        </p>
      </div>

      {/* Quick Amount Buttons */}
      {currency === 'INR' && (
        <div className="grid grid-cols-4 gap-2">
          {[500, 1000, 5000, 10000].map((quickAmount) => (
            <button
              key={quickAmount}
              type="button"
              onClick={() => setAmount(quickAmount.toString())}
              className="px-3 py-2 bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-600 rounded-lg transition-colors font-semibold text-sm"
            >
              {quickAmount >= 1000 ? `${quickAmount / 1000}k` : quickAmount}
            </button>
          ))}
        </div>
      )}
      {currency === 'USD' && (
        <div className="grid grid-cols-4 gap-2">
          {[50, 100, 500, 1000].map((quickAmount) => (
            <button
              key={quickAmount}
              type="button"
              onClick={() => setAmount(quickAmount.toString())}
              className="px-3 py-2 bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-600 rounded-lg transition-colors font-semibold text-sm"
            >
              {quickAmount >= 1000 ? `${quickAmount / 1000}k` : quickAmount}
            </button>
          ))}
        </div>
      )}

      {/* Bonus Calculation Display 
      {amount && parseFloat(amount) > 0 && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Amount:</span>
              <span className="font-semibold text-gray-900">₹{parseFloat(amount).toLocaleString('en-IN')}</span>
            </div>
            {bonus > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Bonus (10%):</span>
                <span className="font-semibold text-green-600">+₹{bonus.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t-2 border-green-300">
              <span className="font-bold text-gray-900">Total Credit:</span>
              <span className="font-bold text-green-600 text-lg">₹{totalCredit.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      )}
        */}

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
          className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
