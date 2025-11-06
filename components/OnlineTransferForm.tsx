'use client';

import { useState } from 'react';
import { X, ArrowLeft, Building2, CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { User as UserType } from '@/lib/mockData';

interface OnlineTransferFormProps {
  onClose: () => void;
  onBack: () => void;
  currentUser: UserType;
  withdrawalInfo: {
    totalReturns: number;
    availableBalance: number;
    withdrawalPercentage: number;
    canWithdraw: boolean;
    message: string;
  };
}

export default function OnlineTransferForm({ onClose, onBack, currentUser, withdrawalInfo }: OnlineTransferFormProps) {
  const [step, setStep] = useState<'details' | 'review' | 'success'>('details');
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [amount, setAmount] = useState('');
  const [accountHolderName, setAccountHolderName] = useState(currentUser.name);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountType, setAccountType] = useState<'savings' | 'current'>('savings');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    const withdrawalAmount = parseFloat(amount);
    if (!amount || withdrawalAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (withdrawalAmount > withdrawalInfo.availableBalance) {
      setError(`Amount cannot exceed ₹${withdrawalInfo.availableBalance.toLocaleString('en-IN')}`);
      return;
    }

    if (!accountHolderName || !bankName || !accountNumber || !ifscCode) {
      setError('Please fill all required fields');
      return;
    }

    if (accountNumber !== confirmAccountNumber) {
      setError('Account numbers do not match');
      return;
    }

    if (ifscCode.length !== 11) {
      setError('IFSC code must be 11 characters');
      return;
    }

    setStep('review');
  };

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 2000);
  };

  // Success Screen
  if (step === 'success') {
    const requestId = `WD${Date.now().toString().slice(-9)}`;
    
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Withdrawal Request Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Your request will be processed within 24 hours
            </p>

            <div className="bg-gray-50 rounded-xl p-5 mb-6 space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">Request ID</span>
                <span className="font-mono font-semibold text-gray-900">{requestId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="font-bold text-green-600 text-lg">₹{parseFloat(amount).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                  Pending Approval
                </span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-700">
                💡 Your referrer has been notified and will process your request soon. 
                Money will be credited to your account within 2-3 business days after approval.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors"
              >
                Back to Dashboard
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
              >
                Track Request
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Review Screen
  if (step === 'review') {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStep('details')}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold">Review & Confirm</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Withdrawal Request Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-blue-200">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-bold text-blue-600 text-xl">₹{parseFloat(amount).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-blue-200">
                  <span className="text-gray-600">Method</span>
                  <span className="font-semibold text-gray-900">Online Transfer</span>
                </div>
                <div className="flex justify-between py-2 border-b border-blue-200">
                  <span className="text-gray-600">Bank</span>
                  <span className="font-semibold text-gray-900">{bankName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-blue-200">
                  <span className="text-gray-600">Account</span>
                  <span className="font-mono font-semibold text-gray-900">
                    XXXX XXXX {accountNumber.slice(-4)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">IFSC</span>
                  <span className="font-mono font-semibold text-gray-900">{ifscCode}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Confirm Withdrawal
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Details Form
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-2xl font-bold">Online Transfer</h2>
                <p className="text-blue-100 text-sm">Enter your bank details</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Available Balance */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-600 mb-1">Available for Withdrawal</p>
            <p className="text-2xl font-bold text-blue-700">₹{withdrawalInfo.availableBalance.toLocaleString('en-IN')}</p>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Withdrawal Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl font-bold">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-xl font-semibold text-gray-900"
                min="1"
                max={withdrawalInfo.availableBalance}
                step="1"
              />
            </div>
            {amount && parseFloat(amount) > withdrawalInfo.availableBalance && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Amount exceeds available balance
              </p>
            )}
          </div>

          {/* Account Holder Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Account Holder Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
              placeholder="Enter account holder name"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-900"
            />
            <p className="text-xs text-gray-500 mt-1">Must match your registered name</p>
          </div>

          {/* Bank Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bank Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g., HDFC Bank, SBI, ICICI"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-900"
              />
            </div>
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter account number"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors font-mono text-gray-900"
              maxLength={18}
            />
          </div>

          {/* Confirm Account Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Re-enter Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={confirmAccountNumber}
              onChange={(e) => setConfirmAccountNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="Re-enter account number"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors font-mono text-gray-900"
              maxLength={18}
            />
            {confirmAccountNumber && accountNumber !== confirmAccountNumber && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Account numbers do not match
              </p>
            )}
          </div>

          {/* IFSC Code */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              IFSC Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
              placeholder="e.g., HDFC0001234"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors font-mono text-gray-900 uppercase"
              maxLength={11}
            />
            <p className="text-xs text-gray-500 mt-1">11 character alphanumeric code</p>
          </div>

          {/* Account Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Account Type <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex-1 flex items-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="radio"
                  name="accountType"
                  value="savings"
                  checked={accountType === 'savings'}
                  onChange={(e) => setAccountType(e.target.value as 'savings')}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="font-medium text-gray-900">Savings</span>
              </label>
              <label className="flex-1 flex items-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="radio"
                  name="accountType"
                  value="current"
                  checked={accountType === 'current'}
                  onChange={(e) => setAccountType(e.target.value as 'current')}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="font-medium text-gray-900">Current</span>
              </label>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Remarks (Optional)
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add any additional notes..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-900 resize-none"
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">{remarks.length}/200 characters</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            Review Withdrawal Request
          </button>

          {/* Info Note */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
            <p className="text-xs text-gray-600 text-center">
              🔒 Your bank details are secure and will only be shared with your referrer for processing
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
