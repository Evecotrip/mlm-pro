'use client';

import { useState } from 'react';
import { CreditCard, Banknote, AlertCircle } from 'lucide-react';

export type PaymentMethod = 'soft-cash' | 'hard-cash' | null;

interface BorrowPaymentMethodProps {
  lenderName: string;
  amount: string;
  onContinue: (method: PaymentMethod) => void;
  onBack: () => void;
}

export default function BorrowPaymentMethod({ lenderName, amount, onContinue, onBack }: BorrowPaymentMethodProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [error, setError] = useState('');

  const handleContinue = () => {
    setError('');
    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }
    onContinue(paymentMethod);
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
        <p className="text-sm text-gray-600">Borrowing from</p>
        <p className="font-bold text-gray-900 text-lg">{lenderName}</p>
        <p className="text-2xl font-bold text-purple-600 mt-2">₹{parseFloat(amount).toLocaleString('en-IN')}</p>
      </div>

      {/* Payment Method Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Select Payment Method *
        </label>
        <div className="space-y-3">
          {/* Soft Cash */}
          <button
            onClick={() => setPaymentMethod('soft-cash')}
            className={`w-full p-4 border-2 rounded-xl transition-all text-left ${
              paymentMethod === 'soft-cash'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'soft-cash' ? 'border-purple-600' : 'border-gray-300'
              }`}>
                {paymentMethod === 'soft-cash' && (
                  <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                )}
              </div>
              <CreditCard className="w-6 h-6 text-purple-600" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">○ Soft Cash (Digital Payment)</p>
                <p className="text-sm text-gray-600">Receive money via bank transfer</p>
              </div>
            </div>
          </button>

          {/* Hard Cash */}
          <button
            onClick={() => setPaymentMethod('hard-cash')}
            className={`w-full p-4 border-2 rounded-xl transition-all text-left ${
              paymentMethod === 'hard-cash'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'hard-cash' ? 'border-purple-600' : 'border-gray-300'
              }`}>
                {paymentMethod === 'hard-cash' && (
                  <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                )}
              </div>
              <Banknote className="w-6 h-6 text-green-600" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">○ Hard Cash (Physical Cash)</p>
                <p className="text-sm text-gray-600">Collect cash in person</p>
              </div>
            </div>
          </button>
        </div>
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
