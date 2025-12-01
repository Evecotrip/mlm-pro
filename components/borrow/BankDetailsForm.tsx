'use client';

import { useState } from 'react';
import { AlertCircle, Building2, Loader2 } from 'lucide-react';

export interface BankDetails {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  accountType: 'savings' | 'current';
  upiId: string;
}

interface BankDetailsFormProps {
  onSubmit: (details: BankDetails) => void;
  onBack: () => void;
  loading?: boolean;
}

export default function BankDetailsForm({ onSubmit, onBack, loading = false }: BankDetailsFormProps) {
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    accountType: 'savings',
    upiId: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');

    if (!bankDetails.accountHolderName || !bankDetails.bankName ||
      !bankDetails.accountNumber || !bankDetails.ifscCode) {
      setError('Please fill all required fields');
      return;
    }

    if (bankDetails.accountNumber !== bankDetails.confirmAccountNumber) {
      setError('Account numbers do not match');
      return;
    }

    if (bankDetails.ifscCode.length !== 11) {
      setError('IFSC code must be 11 characters');
      return;
    }

    onSubmit(bankDetails);
  };

  return (
    <div className="space-y-8">
      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4">
        <p className="text-sm text-blue-600 dark:text-blue-400">
          <strong className="text-blue-700 dark:text-blue-300">Note:</strong> Provide your bank details to receive digital payment from the lender.
        </p>
      </div>

      {/* Form Fields */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            Account Holder Name *
          </label>
          <input
            type="text"
            value={bankDetails.accountHolderName}
            onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
            placeholder="As per bank records"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
            disabled={loading}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            Bank Name *
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-slate-500" />
            <input
              type="text"
              value={bankDetails.bankName}
              onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
              placeholder="e.g., HDFC Bank, SBI, ICICI"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
              disabled={loading}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            Account Number *
          </label>
          <input
            type="text"
            value={bankDetails.accountNumber}
            onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
            placeholder="Enter account number"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-mono placeholder:font-sans placeholder:text-slate-400 dark:placeholder:text-slate-600"
            disabled={loading}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            Re-enter Account Number *
          </label>
          <input
            type="text"
            value={bankDetails.confirmAccountNumber}
            onChange={(e) => setBankDetails({ ...bankDetails, confirmAccountNumber: e.target.value })}
            placeholder="Confirm account number"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-mono placeholder:font-sans placeholder:text-slate-400 dark:placeholder:text-slate-600"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            IFSC Code *
          </label>
          <input
            type="text"
            value={bankDetails.ifscCode}
            onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })}
            placeholder="e.g., HDFC0001234"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-mono placeholder:font-sans placeholder:text-slate-400 dark:placeholder:text-slate-600"
            maxLength={11}
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            Account Type *
          </label>
          <div className="flex gap-4 mt-3">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${bankDetails.accountType === 'savings' ? 'border-purple-500' : 'border-slate-400 dark:border-slate-600 group-hover:border-purple-400'
                }`}>
                {bankDetails.accountType === 'savings' && <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />}
              </div>
              <input
                type="radio"
                checked={bankDetails.accountType === 'savings'}
                onChange={() => setBankDetails({ ...bankDetails, accountType: 'savings' })}
                className="hidden"
                disabled={loading}
              />
              <span className={`text-sm ${bankDetails.accountType === 'savings' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>Savings</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${bankDetails.accountType === 'current' ? 'border-purple-500' : 'border-slate-400 dark:border-slate-600 group-hover:border-purple-400'
                }`}>
                {bankDetails.accountType === 'current' && <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />}
              </div>
              <input
                type="radio"
                checked={bankDetails.accountType === 'current'}
                onChange={() => setBankDetails({ ...bankDetails, accountType: 'current' })}
                className="hidden"
                disabled={loading}
              />
              <span className={`text-sm ${bankDetails.accountType === 'current' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>Current</span>
            </label>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            UPI ID (Optional)
          </label>
          <input
            type="text"
            value={bankDetails.upiId}
            onChange={(e) => setBankDetails({ ...bankDetails, upiId: e.target.value })}
            placeholder="yourname@upi"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
            disabled={loading}
          />
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
          disabled={loading}
          className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl font-bold transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </span>
          ) : (
            'Submit Request'
          )}
        </button>
      </div>
    </div>
  );
}
