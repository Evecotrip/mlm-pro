'use client';

import { useState } from 'react';
import { X, CreditCard, Banknote, ArrowRight, AlertCircle, Info, Wallet } from 'lucide-react';
import { User as UserType, getAvailableWithdrawalBalance } from '@/lib/mockData';
import OnlineTransferForm from './OnlineTransferForm';
import PhysicalCashForm from './PhysicalCashForm';

interface WithdrawalFormProps {
  onClose: () => void;
  currentUser: UserType;
}

export default function WithdrawalForm({ onClose, currentUser }: WithdrawalFormProps) {
  const [step, setStep] = useState<'method' | 'online' | 'physical'>('method');

  const withdrawalInfo = getAvailableWithdrawalBalance(currentUser.id);

  if (step === 'online') {
    return (
      <OnlineTransferForm
        onClose={onClose}
        onBack={() => setStep('method')}
        currentUser={currentUser}
        withdrawalInfo={withdrawalInfo}
      />
    );
  }

  if (step === 'physical') {
    return (
      <PhysicalCashForm
        onClose={onClose}
        onBack={() => setStep('method')}
        currentUser={currentUser}
        withdrawalInfo={withdrawalInfo}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        {/* Header */}
        <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 p-6 relative z-10">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Withdraw Money</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Select your preferred withdrawal method</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 relative z-10">
          {/* Available Balance Info */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-1">Available for Withdrawal</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-300">
                  ₹{withdrawalInfo.availableBalance.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-200 dark:border-emerald-500/30">
                <Wallet className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>

            <div className="bg-white/50 dark:bg-slate-950/50 rounded-lg p-3 space-y-2 border border-emerald-100 dark:border-slate-800/50 relative z-10">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Total Returns</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  ₹{withdrawalInfo.totalReturns.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Withdrawal Limit</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {withdrawalInfo.withdrawalPercentage}%
                </span>
              </div>
            </div>

            {/* Info Message */}
            <div className="mt-3 flex items-start gap-2 text-sm text-emerald-600/80 dark:text-emerald-400/80 relative z-10">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>{withdrawalInfo.message}</p>
            </div>
          </div>

          {/* Withdrawal Disabled Message */}
          {!withdrawalInfo.canWithdraw && (
            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-700 dark:text-amber-400 mb-1">Withdrawals Not Available Yet</p>
                <p className="text-sm text-amber-600 dark:text-amber-200/80">
                  You can start withdrawing after 3 months from your account approval date.
                </p>
              </div>
            </div>
          )}

          {/* Method Selection */}
          {withdrawalInfo.canWithdraw && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Select Withdrawal Method</h3>

              <div className="space-y-4">
                {/* Online Transfer Option */}
                <button
                  onClick={() => setStep('online')}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/5 rounded-xl p-5 transition-all group text-left relative overflow-hidden"
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 bg-blue-100 dark:bg-blue-500/10 group-hover:bg-blue-200 dark:group-hover:bg-blue-500/20 rounded-xl flex items-center justify-center transition-colors border border-blue-200 dark:border-blue-500/20">
                      <CreditCard className="w-7 h-7 text-blue-600 dark:text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Online Money Transfer</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Direct bank transfer to your account</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 dark:text-slate-600 group-hover:text-blue-500 transition-colors group-hover:translate-x-1 transform" />
                  </div>
                </button>

                {/* Physical Cash Option */}
                <button
                  onClick={() => setStep('physical')}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/5 rounded-xl p-5 transition-all group text-left relative overflow-hidden"
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-500/10 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-500/20 rounded-xl flex items-center justify-center transition-colors border border-emerald-200 dark:border-emerald-500/20">
                      <Banknote className="w-7 h-7 text-emerald-600 dark:text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Physical Cash Pickup</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Collect cash from your referrer</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 dark:text-slate-600 group-hover:text-emerald-500 transition-colors group-hover:translate-x-1 transform" />
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Info Note */}
          {withdrawalInfo.canWithdraw && (
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-500 dark:text-slate-500 text-center">
                💡 All withdrawal requests require approval from your referrer
              </p>
            </div>
          )}

          {/* Close Button (when disabled) */}
          {!withdrawalInfo.canWithdraw && (
            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold rounded-xl transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
