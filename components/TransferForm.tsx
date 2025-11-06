'use client';

import { useState, useEffect } from 'react';
import { X, Send, Download, User, Phone, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { getUserByReferralCode, User as UserType } from '@/lib/mockData';

interface TransferFormProps {
  onClose: () => void;
  currentUser: UserType;
  currentBalance: number;
}

export default function TransferForm({ onClose, currentUser, currentBalance }: TransferFormProps) {
  const [mode, setMode] = useState<'send' | 'receive'>('send');
  const [referralCode, setReferralCode] = useState('');
  const [amount, setAmount] = useState('');
  const [receiverUser, setReceiverUser] = useState<UserType | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Reset form when mode changes
  useEffect(() => {
    setReferralCode('');
    setAmount('');
    setReceiverUser(null);
    setError('');
    setSuccess(false);
  }, [mode]);

  // Fetch user details when referral code changes
  useEffect(() => {
    if (referralCode.length >= 6) {
      const user = getUserByReferralCode(referralCode.toUpperCase());
      if (user && user.id !== currentUser.id) {
        setReceiverUser(user);
        setError('');
      } else if (user && user.id === currentUser.id) {
        setReceiverUser(null);
        setError('Cannot transfer to yourself');
      } else {
        setReceiverUser(null);
        setError('Invalid referral code');
      }
    } else {
      setReceiverUser(null);
      setError('');
    }
  }, [referralCode, currentUser.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!referralCode || !receiverUser) {
      setError('Please enter a valid referral code');
      return;
    }

    const transferAmount = parseFloat(amount);
    if (!amount || transferAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (mode === 'send' && transferAmount > currentBalance) {
      setError('Insufficient balance');
      return;
    }

    // Simulate transfer
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Transfer Money</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Mode Toggle */}
          <div className="flex bg-white/20 backdrop-blur-sm rounded-xl p-1">
            <button
              onClick={() => setMode('send')}
              className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                mode === 'send'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Send className="w-4 h-4" />
              Send Money
            </button>
            <button
              onClick={() => setMode('receive')}
              className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                mode === 'receive'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Download className="w-4 h-4" />
              Request Money
            </button>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="p-6 bg-green-50 border-b border-green-200">
            <div className="flex items-center gap-3 text-green-700">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold">
                  {mode === 'send' ? 'Money Sent Successfully!' : 'Request Sent Successfully!'}
                </p>
                <p className="text-sm text-green-600">
                  {mode === 'send' 
                    ? `₹${amount} transferred to ${receiverUser?.name}`
                    : `Request for ₹${amount} sent to ${receiverUser?.name}`
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Current Balance (for Send mode) */}
          {mode === 'send' && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-600 mb-1">Available Balance</p>
              <p className="text-2xl font-bold text-blue-700">₹{currentBalance.toLocaleString('en-IN')}</p>
            </div>
          )}

          {/* Referral Code Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {mode === 'send' ? "Receiver's Referral Code" : "Sender's Referral Code"}
            </label>
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              placeholder="Enter referral code"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors font-mono text-lg tracking-wider uppercase text-gray-900"
              maxLength={10}
              disabled={loading || success}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the referral code of the {mode === 'send' ? 'receiver' : 'sender'}
            </p>
          </div>

          {/* User Details Card */}
          {receiverUser && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 animate-fadeIn">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-lg">{receiverUser.name}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {receiverUser.phone}
                  </p>
                </div>
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="bg-white/60 rounded-lg p-2 text-center">
                <p className="text-xs text-gray-600">Referral Code</p>
                <p className="font-mono font-bold text-green-700">{receiverUser.referralCode}</p>
              </div>
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Amount
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
                step="1"
                disabled={loading || success || !receiverUser}
              />
            </div>
            {mode === 'send' && amount && parseFloat(amount) > currentBalance && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Insufficient balance
              </p>
            )}
          </div>

          {/* Quick Amount Buttons */}
          {receiverUser && (
            <div className="grid grid-cols-4 gap-2">
              {[500, 1000, 2000, 5000].map((quickAmount) => (
                <button
                  key={quickAmount}
                  type="button"
                  onClick={() => setAmount(quickAmount.toString())}
                  disabled={loading || success || (mode === 'send' && quickAmount > currentBalance)}
                  className="py-2 px-3 bg-gray-100 text-gray-900 hover:bg-blue-100 hover:text-blue-600 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ₹{quickAmount}
                </button>
              ))}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Transfer Summary */}
          {receiverUser && amount && parseFloat(amount) > 0 && !error && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                {mode === 'send' ? 'Transfer Summary' : 'Request Summary'}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {mode === 'send' ? 'To' : 'From'}
                  </span>
                  <span className="font-semibold text-gray-900">{receiverUser.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-bold text-xl text-blue-600">₹{parseFloat(amount).toLocaleString('en-IN')}</span>
                </div>
                {mode === 'send' && (
                  <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                    <span className="text-gray-600">Balance After Transfer</span>
                    <span className="font-semibold text-gray-900">
                      ₹{(currentBalance - parseFloat(amount)).toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!receiverUser || !amount || parseFloat(amount) <= 0 || loading || success || !!error}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
              mode === 'send'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
            } disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg disabled:hover:shadow-none`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : success ? (
              <>
                <CheckCircle className="w-5 h-5" />
                {mode === 'send' ? 'Sent!' : 'Request Sent!'}
              </>
            ) : (
              <>
                {mode === 'send' ? (
                  <>
                    <Send className="w-5 h-5" />
                    Send ₹{amount || '0'}
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Request ₹{amount || '0'}
                  </>
                )}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Info Note */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
            <p className="text-xs text-gray-600 text-center">
              {mode === 'send' 
                ? '💡 Money will be transferred instantly to the receiver\'s wallet'
                : '💡 A request will be sent to the user. They can accept or decline it.'
              }
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
