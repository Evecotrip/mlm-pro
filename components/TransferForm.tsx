'use client';

import { useState } from 'react';
import { X, Send, User, AlertCircle, CheckCircle, ArrowRight, Wallet, Loader2 } from 'lucide-react';
import { useWalletStore } from '@/store/useWalletStore';
import {
  createTransferRequest,
  validateTransferAmount,
  validateReferralCode,
  formatTransferAmount,
} from '@/api/transfer-api';

interface TransferFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function TransferForm({ onClose, onSuccess }: TransferFormProps) {
  const balance = useWalletStore(state => state.balance);
  const [referralCode, setReferralCode] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transferData, setTransferData] = useState<any>(null);

  // Get available balance for transfer
  const availableBalance = parseFloat(balance?.available || '0');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate referral code
    const codeValidation = validateReferralCode(referralCode);
    if (!codeValidation.valid) {
      setError(codeValidation.error || 'Invalid referral code');
      return;
    }

    // Validate amount
    const transferAmount = parseFloat(amount);
    if (!amount || transferAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const amountValidation = validateTransferAmount(transferAmount, availableBalance);
    if (!amountValidation.valid) {
      setError(amountValidation.error || 'Invalid amount');
      return;
    }

    // Create transfer request
    setLoading(true);
    try {
      const response = await createTransferRequest({
        recipientCode: referralCode.toUpperCase(),
        amount: transferAmount,
        note: note.trim() || undefined,
      });

      if (response.success && response.data) {
        setTransferData(response.data);
        setSuccess(true);
        
        // Close modal after 2 seconds and trigger success callback
        setTimeout(() => {
          onClose();
          if (onSuccess) {
            onSuccess();
          }
        }, 2000);
      } else {
        setError(response.message || 'Failed to create transfer request');
      }
    } catch (error) {
      console.error('Error creating transfer:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 p-6 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Send Money</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Message */}
        {success && transferData && (
          <div className="p-6 bg-emerald-50 dark:bg-emerald-500/10 border-b border-emerald-200 dark:border-emerald-500/20 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-200 dark:border-emerald-500/30">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Transfer Request Created!
                </p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400/80">
                  ₹{formatTransferAmount(transferData.amount)} sent to {transferData.receiver.firstName} {transferData.receiver.lastName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Awaiting receiver approval
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Current Balance */}
          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Available Balance</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} INR
              </p>
              <p className="text-xs text-blue-500 dark:text-blue-400/70 mt-1">Your wallet balance</p>
            </div>
            <Wallet className="w-8 h-8 text-blue-500/50" />
          </div>

          {/* Referral Code Input */}
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              Receiver's Referral Code
            </label>
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              placeholder="REF12345AB"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono text-lg tracking-wider uppercase placeholder:text-slate-400 dark:placeholder:text-slate-600 placeholder:font-sans placeholder:tracking-normal"
              maxLength={10}
              disabled={loading || success}
              required
            />
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
              Enter the referral code of the person you want to send money to
            </p>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-500 text-xl font-bold"></span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00 INR"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-xl font-bold placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-600"
                min="1"
                step="0.01"
                disabled={loading || success}
                required
              />
            </div>
            {amount && parseFloat(amount) > availableBalance && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Insufficient balance
              </p>
            )}
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[100, 500, 1000, 5000].map((quickAmount) => (
              <button
                key={quickAmount}
                type="button"
                onClick={() => setAmount(quickAmount.toString())}
                disabled={loading || success || quickAmount > availableBalance}
                className="py-2 px-3 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {quickAmount}
              </button>
            ))}
          </div>

          {/* Note Input */}
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., Payment for services, loan repayment, etc."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
              rows={3}
              maxLength={200}
              disabled={loading || success}
            />
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 text-right">{note.length}/200 characters</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          {/* Transfer Summary */}
          {referralCode && amount && parseFloat(amount) > 0 && !error && (
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 animate-in fade-in slide-in-from-bottom-2">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
                Transfer Summary
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-500">To</span>
                  <span className="font-semibold text-slate-900 dark:text-white font-mono">{referralCode}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-500">Amount</span>
                  <span className="font-bold text-xl text-emerald-600 dark:text-emerald-400">
                    {parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} INR
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-500 text-sm">Balance After Transfer</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {(availableBalance - parseFloat(amount)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} INR
                  </span>
                </div>
                {note && (
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-500 text-sm block mb-1">Note</span>
                    <p className="text-slate-700 dark:text-slate-300 text-sm">{note}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!referralCode || !amount || parseFloat(amount) <= 0 || loading || success || !!error || parseFloat(amount) > availableBalance}
            className="w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/20 hover:shadow-blue-600/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : success ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Transfer Sent!
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send {amount || '0'} INR
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Info Note */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3">
            <p className="text-xs text-blue-900 dark:text-blue-100 text-center">
              💡 The transfer request will be sent to the receiver. They need to accept it before the money is transferred.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
