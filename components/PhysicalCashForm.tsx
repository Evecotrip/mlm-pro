'use client';

import { useState } from 'react';
import { X, ArrowLeft, Phone, MessageCircle, User, CheckCircle, AlertCircle, Banknote } from 'lucide-react';
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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Sent Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your referrer has been notified about your cash withdrawal request
            </p>

            <div className="bg-gray-50 rounded-xl p-5 mb-6 space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="font-bold text-green-600 text-lg">₹{parseFloat(amount).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Method</span>
                <span className="font-semibold text-gray-900">Physical Cash Pickup</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                  In Progress
                </span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-700">
                💡 Please coordinate with your referrer to arrange the cash pickup. 
                Both you and your referrer will receive notifications.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Referrer Not Found</h2>
            <p className="text-gray-600 mb-6">Unable to find your referrer's contact information</p>
            <button
              onClick={onBack}
              className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStep('amount')}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold">Physical Cash Pickup</h2>
                  <p className="text-green-100 text-sm">Contact your referrer</p>
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

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 mb-1">Contact Your Referrer</p>
                <p className="text-sm text-blue-700">
                  Please contact your referrer to arrange cash pickup. Your referrer has been notified about your withdrawal request.
                </p>
              </div>
            </div>

            {/* Withdrawal Amount */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5 text-center">
              <p className="text-sm text-green-600 font-medium mb-2">Withdrawal Amount</p>
              <p className="text-4xl font-bold text-green-700">₹{parseFloat(amount).toLocaleString('en-IN')}</p>
            </div>

            {/* Referrer Contact Card */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Your Referrer</p>
                  <h3 className="text-xl font-bold text-gray-900">{referrer.name}</h3>
                </div>
              </div>

              <div className="space-y-3">
                {/* Primary Contact */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-2">Primary Contact</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-600" />
                      <span className="font-mono font-semibold text-gray-900">{referrer.phone}</span>
                    </div>
                    <a
                      href={`tel:${referrer.phone}`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
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
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Send WhatsApp Message
                </a>
              </div>
            </div>

            {/* Note */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Your referrer has been notified via SMS, email, and in-app notification about your withdrawal request.
              </p>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirmRequest}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Confirm & Send Request
            </button>

            {/* Info Note */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
              <p className="text-xs text-gray-600 text-center">
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-2xl font-bold">Physical Cash Pickup</h2>
                <p className="text-green-100 text-sm">Enter withdrawal amount</p>
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
        <form onSubmit={handleAmountSubmit} className="p-6 space-y-5">
          {/* Available Balance */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-sm text-green-600 mb-1">Available for Withdrawal</p>
            <p className="text-2xl font-bold text-green-700">₹{withdrawalInfo.availableBalance.toLocaleString('en-IN')}</p>
          </div>

          {/* Amount Input */}
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
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors text-xl font-semibold text-gray-900"
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

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[500, 1000, 2000, 5000].map((quickAmount) => (
              <button
                key={quickAmount}
                type="button"
                onClick={() => setAmount(quickAmount.toString())}
                disabled={quickAmount > withdrawalInfo.availableBalance}
                className="py-2 px-3 bg-gray-100 text-gray-900 hover:bg-green-100 hover:text-green-600 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ₹{quickAmount}
              </button>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 mb-1">How it works</p>
              <ul className="text-sm text-blue-700 space-y-1">
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
            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Banknote className="w-5 h-5" />
            Continue to Contact Details
          </button>
        </form>
      </div>
    </div>
  );
}
