'use client';

import { useState, useEffect } from 'react';
import { X, Send, Download, User, Phone, AlertCircle, CheckCircle, ArrowRight, Wallet } from 'lucide-react';
import { getUserByReferralCode, User as UserType, getAvailableWithdrawalBalance } from '@/lib/mockData';

interface TransferFormProps {
  onClose: () => void;
  currentUser: UserType;
  currentBalance: number;
}

export default function TransferForm({ onClose, currentUser, currentBalance }: TransferFormProps) {
  const [mode, setMode] = useState<'send' | 'receive'>('send');
  const [referralCode, setReferralCode] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [receiverUser, setReceiverUser] = useState<UserType | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get transfer balance from matured investment returns
  const transferBalance = getAvailableWithdrawalBalance(currentUser.id).totalReturns;

  // Reset form when mode changes
  useEffect(() => {
    setReferralCode('');
    setAmount('');
    setNotes('');
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

    if (mode === 'send' && transferAmount > transferBalance) {
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="sticky top-0 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 p-6 z-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Transfer Money</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setMode('send')}
              className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${mode === 'send'
                  ? 'bg-slate-800 text-white shadow-lg border border-slate-700'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
            >
              <Send className="w-4 h-4" />
              Send Money
            </button>
            <button
              onClick={() => setMode('receive')}
              className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${mode === 'receive'
                  ? 'bg-slate-800 text-white shadow-lg border border-slate-700'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
            >
              <Download className="w-4 h-4" />
              Request Money
            </button>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="p-6 bg-emerald-500/10 border-b border-emerald-500/20 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-3 text-emerald-400">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-white">
                  {mode === 'send' ? 'Money Sent Successfully!' : 'Request Sent Successfully!'}
                </p>
                <p className="text-sm text-emerald-400/80">
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Current Balance (for Send mode) */}
          {mode === 'send' && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-400 mb-1">Transfer Balance</p>
                <p className="text-2xl font-bold text-blue-300">₹{transferBalance.toLocaleString('en-IN')}</p>
                <p className="text-xs text-blue-400/70 mt-1">Returns from matured investments</p>
              </div>
              <Wallet className="w-8 h-8 text-blue-500/50" />
            </div>
          )}

          {/* Referral Code Input */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              {mode === 'send' ? "Receiver's Referral Code" : "Sender's Referral Code"}
            </label>
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              placeholder="Enter referral code"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-mono text-lg tracking-wider uppercase placeholder:text-slate-600 placeholder:font-sans placeholder:tracking-normal"
              maxLength={10}
              disabled={loading || success}
            />
            <p className="text-xs text-slate-500 mt-1">
              Enter the referral code of the {mode === 'send' ? 'receiver' : 'sender'}
            </p>
          </div>

          {/* User Details Card */}
          {receiverUser && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white text-lg">{receiverUser.name}</p>
                  <p className="text-sm text-slate-400 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {receiverUser.phone}
                  </p>
                </div>
                <CheckCircle className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="bg-slate-950 rounded-lg p-2 text-center border border-slate-800">
                <p className="text-xs text-slate-500 mb-1">Referral Code</p>
                <p className="font-mono font-bold text-emerald-400 tracking-wider">{receiverUser.referralCode}</p>
              </div>
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl font-bold">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-xl font-bold placeholder:font-normal placeholder:text-slate-600"
                min="1"
                step="1"
                disabled={loading || success || !receiverUser}
              />
            </div>
            {mode === 'send' && amount && parseFloat(amount) > transferBalance && (
              <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
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
                  disabled={loading || success || (mode === 'send' && quickAmount > transferBalance)}
                  className="py-2 px-3 bg-slate-900 text-slate-300 border border-slate-800 hover:border-purple-500/50 hover:text-purple-400 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ₹{quickAmount}
                </button>
              ))}
            </div>
          )}

          {/* Notes/Reason (for Request mode) */}
          {mode === 'receive' && receiverUser && (
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Reason for Request (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Payment for services, loan repayment, etc."
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none placeholder:text-slate-600"
                rows={3}
                maxLength={150}
                disabled={loading || success}
              />
              <p className="text-xs text-slate-500 mt-1 text-right">{notes.length}/150 characters</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400 font-medium">{error}</p>
            </div>
          )}

          {/* Transfer Summary */}
          {receiverUser && amount && parseFloat(amount) > 0 && !error && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 animate-in fade-in slide-in-from-bottom-2">
              <p className="text-sm font-semibold text-slate-400 mb-3">
                {mode === 'send' ? 'Transfer Summary' : 'Request Summary'}
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">
                    {mode === 'send' ? 'To' : 'From'}
                  </span>
                  <span className="font-semibold text-white">{receiverUser.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Amount</span>
                  <span className="font-bold text-xl text-emerald-400">₹{parseFloat(amount).toLocaleString('en-IN')}</span>
                </div>
                {mode === 'send' && (
                  <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                    <span className="text-slate-500 text-sm">Balance After Transfer</span>
                    <span className="font-semibold text-slate-300">
                      ₹{(transferBalance - parseFloat(amount)).toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                {mode === 'receive' && notes && (
                  <div className="pt-3 border-t border-slate-800">
                    <span className="text-slate-500 text-sm block mb-1">Reason</span>
                    <p className="text-slate-300 text-sm">{notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!receiverUser || !amount || parseFloat(amount) <= 0 || loading || success || !!error}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg ${mode === 'send'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/20 hover:shadow-blue-600/40'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-purple-600/20 hover:shadow-purple-600/40'
              } disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none`}
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
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3">
            <p className="text-xs text-slate-500 text-center">
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
