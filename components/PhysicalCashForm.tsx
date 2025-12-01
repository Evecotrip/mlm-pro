'use client';

import { useState } from 'react';
import { X, ArrowLeft, Phone, MessageCircle, User, CheckCircle, AlertCircle, Banknote, Wallet } from 'lucide-react';
import { User as UserType, getUserById } from '@/lib/mockData';

interface PhysicalCashFormProps {
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

export default function PhysicalCashForm({ onClose, onBack, currentUser, withdrawalInfo }: PhysicalCashFormProps) {
  const [step, setStep] = useState<'amount' | 'contact' | 'success'>('amount');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const referrer = currentUser.referrerId ? getUserById(currentUser.referrerId) : null;

  const handleAmountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const withdrawalAmount = parseFloat(amount);
    if (!amount || withdrawalAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (withdrawalAmount > withdrawalInfo.availableBalance) {
      setError(`Amount cannot exceed ₹${withdrawalInfo.availableBalance.toLocaleString('en-IN')}`);
      return;
    }

    setStep('contact');
  };

  const handleConfirmRequest = () => {
    setStep('success');
  };

  // Success Screen
  if (step === 'success') {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>

          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/10">
              <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Request Sent Successfully!</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Your referrer has been notified about your cash withdrawal request
            </p>

            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-5 mb-6 space-y-4 text-left">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-500 text-sm">Amount</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">₹{parseFloat(amount).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-500 text-sm">Method</span>
                <span className="font-medium text-slate-900 dark:text-white">Physical Cash Pickup</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-500 text-sm">Status</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-500/20 rounded-full text-xs font-bold uppercase tracking-wide">
                  In Progress
                </span>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-blue-700 dark:text-blue-300/90 leading-relaxed">
                <strong className="text-blue-800 dark:text-blue-400 block mb-1">What's Next?</strong>
                Please coordinate with your referrer to arrange the cash pickup.
                Both you and your referrer will receive notifications.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-600/20"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Contact Screen
  if (step === 'contact') {
    if (!referrer) {
      return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-600 dark:text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Referrer Not Found</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Unable to find your referrer's contact information</p>
            <button
              onClick={onBack}
              className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold rounded-xl transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 p-6 z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep('amount')}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Physical Cash Pickup</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Contact your referrer</p>
              </div>
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
            {/* Info Banner */}
            <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-700 dark:text-blue-300 mb-1">Contact Your Referrer</p>
                <p className="text-sm text-blue-600 dark:text-blue-300/80">
                  Please contact your referrer to arrange cash pickup. Your referrer has been notified about your withdrawal request.
                </p>
              </div>
            </div>

            {/* Withdrawal Amount */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-5 text-center">
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-2">Withdrawal Amount</p>
              <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-300">₹{parseFloat(amount).toLocaleString('en-IN')}</p>
            </div>

            {/* Referrer Contact Card */}
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Your Referrer</p>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{referrer.name}</h3>
                </div>
              </div>

              <div className="space-y-3">
                {/* Primary Contact */}
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                  <p className="text-xs text-slate-500 dark:text-slate-500 mb-2 uppercase tracking-wider">Primary Contact</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400 dark:text-slate-400" />
                      <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">{referrer.phone}</span>
                    </div>
                    <a
                      href={`tel:${referrer.phone}`}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white text-sm font-semibold rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                    >
                      Call
                    </a>
                  </div>
                </div>

                {/* WhatsApp Button */}
                <a
                  href={`https://wa.me/${referrer.phone.replace(/[^0-9]/g, '')}?text=Hi, I would like to withdraw ₹${amount} in cash. Can we arrange a pickup?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition-colors shadow-lg shadow-[#25D366]/20"
                >
                  <MessageCircle className="w-5 h-5" />
                  Send WhatsApp Message
                </a>
              </div>
            </div>

            {/* Note */}
            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4">
              <p className="text-sm text-amber-700 dark:text-amber-200/80">
                <strong className="text-amber-800 dark:text-amber-400">Note:</strong> Your referrer has been notified via SMS, email, and in-app notification about your withdrawal request.
              </p>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirmRequest}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Confirm & Send Request
            </button>

            {/* Info Note */}
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
              <p className="text-xs text-slate-500 dark:text-slate-500 text-center">
                💡 After receiving cash, you can mark the transaction as completed in your withdrawal history
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Amount Input Screen
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg">
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
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Physical Cash Pickup</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Enter withdrawal amount</p>
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
        <form onSubmit={handleAmountSubmit} className="p-6 space-y-6">
          {/* Available Balance */}
          <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-1">Available for Withdrawal</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">₹{withdrawalInfo.availableBalance.toLocaleString('en-IN')}</p>
            </div>
            <Wallet className="w-8 h-8 text-emerald-500/50" />
          </div>

          {/* Amount Input */}
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
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-xl font-bold placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-600"
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

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-3">
            {[500, 1000, 2000, 5000].map((quickAmount) => (
              <button
                key={quickAmount}
                type="button"
                onClick={() => setAmount(quickAmount.toString())}
                disabled={quickAmount > withdrawalInfo.availableBalance}
                className="py-2 px-3 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ₹{quickAmount}
              </button>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-700 dark:text-blue-300 mb-1">How it works</p>
              <ul className="text-sm text-blue-600 dark:text-blue-300/80 space-y-1">
                <li>• Your referrer will be notified via SMS and email</li>
                <li>• Contact your referrer to arrange cash pickup</li>
                <li>• Collect cash in person from your referrer</li>
                <li>• Confirm receipt after collecting cash</li>
              </ul>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > withdrawalInfo.availableBalance}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Banknote className="w-5 h-5" />
            Continue to Contact Details
          </button>
        </form>
      </div>
    </div>
  );
}
