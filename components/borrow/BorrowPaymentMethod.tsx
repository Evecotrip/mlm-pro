'use client';

import { useState } from 'react';
import { CreditCard, Banknote, AlertCircle, Check } from 'lucide-react';

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
    <div className="space-y-8">
      {/* Summary */}
      <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-5 flex justify-between items-center">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Borrowing from</p>
          <p className="font-bold text-white text-lg">{lenderName}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Amount</p>
          <p className="text-2xl font-bold text-purple-400">₹{parseFloat(amount).toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-4">
          Select Payment Method *
        </label>
        <div className="space-y-4">
          {/* Soft Cash */}
          <button
            onClick={() => setPaymentMethod('soft-cash')}
            className={`w-full p-5 border rounded-2xl transition-all text-left relative overflow-hidden group ${paymentMethod === 'soft-cash'
                ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/10'
                : 'border-slate-800 bg-slate-950/50 hover:border-purple-500/50 hover:bg-slate-900'
              }`}
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${paymentMethod === 'soft-cash' ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-purple-400'
                }`}>
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className={`font-bold text-lg ${paymentMethod === 'soft-cash' ? 'text-white' : 'text-slate-200'}`}>
                    Soft Cash (Digital)
                  </p>
                  {paymentMethod === 'soft-cash' && <Check className="w-5 h-5 text-purple-500" />}
                </div>
                <p className="text-sm text-slate-400">Receive money via bank transfer or UPI</p>
              </div>
            </div>
          </button>

          {/* Hard Cash */}
          <button
            onClick={() => setPaymentMethod('hard-cash')}
            className={`w-full p-5 border rounded-2xl transition-all text-left relative overflow-hidden group ${paymentMethod === 'hard-cash'
                ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
                : 'border-slate-800 bg-slate-950/50 hover:border-emerald-500/50 hover:bg-slate-900'
              }`}
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${paymentMethod === 'hard-cash' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-emerald-400'
                }`}>
                <Banknote className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className={`font-bold text-lg ${paymentMethod === 'hard-cash' ? 'text-white' : 'text-slate-200'}`}>
                    Hard Cash (Physical)
                  </p>
                  {paymentMethod === 'hard-cash' && <Check className="w-5 h-5 text-emerald-500" />}
                </div>
                <p className="text-sm text-slate-400">Collect cash in person from the lender</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-400 font-medium">{error}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={onBack}
          className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl font-bold transition-colors"
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
