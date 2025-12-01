'use client';

import { useState } from 'react';
import { Banknote, CreditCard, AlertCircle, Info, Check, ArrowRight } from 'lucide-react';

export type DirectPaymentMethod = 'cash' | 'digital' | null;

interface PaymentMethodSelectionProps {
  amount: string;
  bonus: number;
  totalCredit: number;
  currency: string;
  onContinue: (method: DirectPaymentMethod) => void;
  onBack: () => void;
}

export default function PaymentMethodSelection({
  amount,
  bonus,
  totalCredit,
  currency,
  onContinue,
  onBack
}: PaymentMethodSelectionProps) {
  const [paymentMethod, setPaymentMethod] = useState<DirectPaymentMethod>(null);
  const [error, setError] = useState('');

  const amountValue = parseFloat(amount);
  // Cash enabled for amounts >= 1,192.30 USDT (equivalent to ₹1,00,000)
  const isCashEnabled = totalCredit >= 1192.30;

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
      {/* Amount Summary */}
      <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400 text-sm">Amount to Add ({currency})</span>
            <span className="font-bold text-slate-900 dark:text-white text-lg">{amountValue.toLocaleString('en-IN')}</span>
          </div>
          <div className="h-px bg-slate-200 dark:bg-slate-800"></div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-700 dark:text-slate-300">Total Credit (USDT)</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xl">{totalCredit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">
          Choose Payment Method *
        </label>
        <div className="space-y-4">
          {/* Add Cash */}
          <button
            onClick={() => isCashEnabled && setPaymentMethod('cash')}
            disabled={!isCashEnabled}
            className={`w-full p-5 border rounded-2xl transition-all text-left relative overflow-hidden group ${!isCashEnabled
              ? 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 opacity-50 cursor-not-allowed'
              : paymentMethod === 'cash'
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
          >
            {!isCashEnabled && (
              <div className="absolute top-3 right-3 bg-red-500/10 text-red-400 text-[10px] px-2 py-1 rounded-full font-bold border border-red-500/20 tracking-wider">
                DISABLED
              </div>
            )}
            <div className="flex items-center gap-4 relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${paymentMethod === 'cash' && isCashEnabled ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                <Banknote className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className={`font-bold text-lg ${isCashEnabled ? (paymentMethod === 'cash' ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200') : 'text-slate-500 dark:text-slate-500'}`}>
                    Add Cash (Physical)
                  </p>
                  {paymentMethod === 'cash' && isCashEnabled && <Check className="w-5 h-5 text-emerald-500" />}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {isCashEnabled ? 'Our team will collect cash from you' : 'Minimum 1,192.30 USDT required'}
                </p>
              </div>
            </div>
          </button>

          {/* Add Digital Money */}
          <button
            onClick={() => setPaymentMethod('digital')}
            className={`w-full p-5 border rounded-2xl transition-all text-left relative overflow-hidden group ${paymentMethod === 'digital'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 shadow-lg shadow-blue-500/10'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${paymentMethod === 'digital' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:text-blue-400'
                }`}>
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className={`font-bold text-lg ${paymentMethod === 'digital' ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                    Add Digital Money
                  </p>
                  {paymentMethod === 'digital' && <Check className="w-5 h-5 text-blue-500" />}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">UPI / Bank Transfer</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Info Box for Cash Payment */}
      {!isCashEnabled && (
        <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700 dark:text-blue-300/90">
            <strong className="text-blue-800 dark:text-blue-400">Note:</strong> Cash payment is available only for amounts ₹1 Lakh and above.
            For smaller amounts, please use digital payment methods.
          </p>
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
