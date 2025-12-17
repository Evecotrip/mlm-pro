'use client';

import { useState } from 'react';
import { QrCode, Building2, AlertCircle, Check, ArrowRight } from 'lucide-react';

export type DigitalOption = 'qr-code' | 'bank-details' | null;

interface DigitalPaymentOptionsProps {
  amount: string;
  bonus: number;
  totalCredit: number;
  currency: string;
  onContinue: (option: DigitalOption) => void;
  onBack: () => void;
}

export default function DigitalPaymentOptions({
  amount,
  bonus,
  totalCredit,
  currency,
  onContinue,
  onBack
}: DigitalPaymentOptionsProps) {
  const [selectedOption, setSelectedOption] = useState<DigitalOption>(null);
  const [error, setError] = useState('');

  const handleContinue = () => {
    setError('');
    if (!selectedOption) {
      setError('Please select a payment option');
      return;
    }
    onContinue(selectedOption);
  };

  return (
    <div className="space-y-8">
      {/* Amount Summary */}
      <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
        <div className="flex justify-between items-center">
          <span className="text-slate-500 dark:text-slate-400 text-sm">Amount to Add</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xl">₹{parseFloat(amount).toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Digital Payment Options */}
      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">
          Select Payment Method *
        </label>
        <div className="space-y-4">
          {/* Request for QR Code */}
          <button
            onClick={() => setSelectedOption('qr-code')}
            className={`w-full p-5 border rounded-2xl transition-all text-left relative overflow-hidden group ${selectedOption === 'qr-code'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 shadow-lg shadow-blue-500/10'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${selectedOption === 'qr-code' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:text-blue-400'
                }`}>
                <QrCode className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className={`font-bold text-lg ${selectedOption === 'qr-code' ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                    Request for QR Code
                  </p>
                  {selectedOption === 'qr-code' && <Check className="w-5 h-5 text-blue-500" />}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Pay via UPI using QR code</p>
              </div>
            </div>
          </button>

          {/* Request for Bank Details */}
          <button
            onClick={() => setSelectedOption('bank-details')}
            className={`w-full p-5 border rounded-2xl transition-all text-left relative overflow-hidden group ${selectedOption === 'bank-details'
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${selectedOption === 'bank-details' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:text-emerald-400'
                }`}>
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className={`font-bold text-lg ${selectedOption === 'bank-details' ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                    Request for Bank Details
                  </p>
                  {selectedOption === 'bank-details' && <Check className="w-5 h-5 text-emerald-500" />}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Pay via NEFT/RTGS/IMPS</p>
              </div>
            </div>
          </button>
        </div>
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
          className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 flex items-center justify-center gap-2 group"
        >
          Continue
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
