'use client';

import { useState } from 'react';
import { AlertCircle, Building2 } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Info Box */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Provide your bank details to receive digital payment from the lender.
        </p>
      </div>

      {/* Form Fields */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Account Holder Name *
          </label>
          <input
            type="text"
            value={bankDetails.accountHolderName}
            onChange={(e) => setBankDetails({...bankDetails, accountHolderName: e.target.value})}
            placeholder="As per bank records"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900"
            disabled={loading}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Bank Name *
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={bankDetails.bankName}
              onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
              placeholder="e.g., HDFC Bank, SBI, ICICI"
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900"
              disabled={loading}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Account Number *
          </label>
          <input
            type="text"
            value={bankDetails.accountNumber}
            onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
            placeholder="Enter account number"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900 font-mono"
            disabled={loading}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Re-enter Account Number *
          </label>
          <input
            type="text"
            value={bankDetails.confirmAccountNumber}
            onChange={(e) => setBankDetails({...bankDetails, confirmAccountNumber: e.target.value})}
            placeholder="Confirm account number"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900 font-mono"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            IFSC Code *
          </label>
          <input
            type="text"
            value={bankDetails.ifscCode}
            onChange={(e) => setBankDetails({...bankDetails, ifscCode: e.target.value.toUpperCase()})}
            placeholder="e.g., HDFC0001234"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900 font-mono"
            maxLength={11}
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Account Type *
          </label>
          <div className="flex gap-4 mt-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={bankDetails.accountType === 'savings'}
                onChange={() => setBankDetails({...bankDetails, accountType: 'savings'})}
                className="w-4 h-4"
                disabled={loading}
              />
              <span className="text-gray-700">○ Savings</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={bankDetails.accountType === 'current'}
                onChange={() => setBankDetails({...bankDetails, accountType: 'current'})}
                className="w-4 h-4"
                disabled={loading}
              />
              <span className="text-gray-700">○ Current</span>
            </label>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            UPI ID (Optional)
          </label>
          <input
            type="text"
            value={bankDetails.upiId}
            onChange={(e) => setBankDetails({...bankDetails, upiId: e.target.value})}
            placeholder="yourname@upi"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900"
            disabled={loading}
          />
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
          disabled={loading}
          className="flex-1 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold transition-all shadow-lg disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
