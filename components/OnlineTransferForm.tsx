'use client';

import { useState } from 'react';
import { X, ArrowLeft, Building2, CreditCard, CheckCircle, AlertCircle, Loader2, Wallet } from 'lucide-react';
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
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>

          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/10">
              <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Withdrawal Request Submitted!</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Your request will be processed within 24 hours
            </p>

            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-5 mb-6 space-y-4 text-left">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-500 text-sm">Request ID</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{requestId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-500 text-sm">Amount</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">₹{parseFloat(amount).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-500 text-sm">Status</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-500/20 rounded-full text-xs font-bold uppercase tracking-wide">
                  Pending Approval
                </span>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-blue-700 dark:text-blue-300/90 leading-relaxed">
                <strong className="text-blue-800 dark:text-blue-400 block mb-1">What's Next?</strong>
                Your referrer has been notified and will process your request soon.
                Money will be credited to your account within 2-3 business days after approval.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold rounded-xl transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-600/20"
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
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 p-6 z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep('details')}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Review & Confirm</h2>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-lg flex items-center gap-2">
                <Wallet className="w-5 h-5 text-purple-600 dark:text-purple-500" />
                Withdrawal Summary
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Amount</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xl">₹{parseFloat(amount).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Method</span>
                  <span className="font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm">Online Transfer</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Bank</span>
                  <span className="font-medium text-slate-900 dark:text-white">{bankName}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Account</span>
                  <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                    XXXX XXXX {accountNumber.slice(-4)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-600 dark:text-slate-400">IFSC</span>
                  <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{ifscCode}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 p-6 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Online Transfer</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Enter your bank details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Available Balance */}
          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Available for Withdrawal</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">₹{withdrawalInfo.availableBalance.toLocaleString('en-IN')}</p>
            </div>
            <Wallet className="w-8 h-8 text-blue-500/50" />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              Withdrawal Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-500 text-xl font-bold">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-xl font-bold placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-600"
                min="1"
                max={withdrawalInfo.availableBalance}
                step="1"
              />
            </div>
            {amount && parseFloat(amount) > withdrawalInfo.availableBalance && (
              <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Amount exceeds available balance
              </p>
            )}
          </div>

          {/* Account Holder Name */}
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              Account Holder Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
              placeholder="Enter account holder name"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
            />
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Must match your registered name</p>
          </div>

          {/* Bank Name */}
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              Bank Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-500 w-5 h-5" />
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g., HDFC Bank, SBI, ICICI"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter account number"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-mono placeholder:font-sans placeholder:text-slate-400 dark:placeholder:text-slate-600"
              maxLength={18}
            />
          </div>

          {/* Confirm Account Number */}
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              Re-enter Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={confirmAccountNumber}
              onChange={(e) => setConfirmAccountNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="Re-enter account number"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-mono placeholder:font-sans placeholder:text-slate-400 dark:placeholder:text-slate-600"
              maxLength={18}
            />
            {confirmAccountNumber && accountNumber !== confirmAccountNumber && (
              <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Account numbers do not match
              </p>
            )}
          </div>

          {/* IFSC Code */}
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              IFSC Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
              placeholder="e.g., HDFC0001234"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-mono uppercase placeholder:font-sans placeholder:text-slate-400 dark:placeholder:text-slate-600"
              maxLength={11}
            />
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">11 character alphanumeric code</p>
          </div>

          {/* Account Type */}
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              Account Type <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className={`flex-1 flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer transition-all ${accountType === 'savings'
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/10'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700'
                }`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${accountType === 'savings' ? 'border-purple-500' : 'border-slate-400 dark:border-slate-600'
                  }`}>
                  {accountType === 'savings' && <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />}
                </div>
                <input
                  type="radio"
                  name="accountType"
                  value="savings"
                  checked={accountType === 'savings'}
                  onChange={(e) => setAccountType(e.target.value as 'savings')}
                  className="hidden"
                />
                <span className={`font-medium ${accountType === 'savings' ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>Savings</span>
              </label>

              <label className={`flex-1 flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer transition-all ${accountType === 'current'
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/10'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700'
                }`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${accountType === 'current' ? 'border-purple-500' : 'border-slate-400 dark:border-slate-600'
                  }`}>
                  {accountType === 'current' && <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />}
                </div>
                <input
                  type="radio"
                  name="accountType"
                  value="current"
                  checked={accountType === 'current'}
                  onChange={(e) => setAccountType(e.target.value as 'current')}
                  className="hidden"
                />
                <span className={`font-medium ${accountType === 'current' ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>Current</span>
              </label>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              Remarks (Optional)
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add any additional notes..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 text-right">{remarks.length}/200 characters</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40"
          >
            <CreditCard className="w-5 h-5" />
            Review Withdrawal Request
          </button>

          {/* Info Note */}
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
            <p className="text-xs text-slate-500 dark:text-slate-500 text-center flex items-center justify-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Your bank details are secure and encrypted
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
