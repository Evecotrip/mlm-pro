'use client';

import { useState } from 'react';
import { X, CreditCard, Banknote, ArrowRight, AlertCircle, Info } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">Withdraw Money</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-green-100 text-sm">Select your preferred withdrawal method</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Available Balance Info */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-green-600 font-medium mb-1">Available for Withdrawal</p>
                <p className="text-3xl font-bold text-green-700">
                  ₹{withdrawalInfo.availableBalance.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <Banknote className="w-7 h-7 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white/60 rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Returns</span>
                <span className="font-semibold text-gray-900">
                  ₹{withdrawalInfo.totalReturns.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Withdrawal Limit</span>
                <span className="font-semibold text-green-600">
                  {withdrawalInfo.withdrawalPercentage}%
                </span>
              </div>
            </div>

            {/* Info Message */}
            <div className="mt-3 flex items-start gap-2 text-sm text-green-700">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>{withdrawalInfo.message}</p>
            </div>
          </div>

          {/* Withdrawal Disabled Message */}
          {!withdrawalInfo.canWithdraw && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-orange-900 mb-1">Withdrawals Not Available Yet</p>
                <p className="text-sm text-orange-700">
                  You can start withdrawing after 3 months from your account approval date.
                </p>
              </div>
            </div>
          )}

          {/* Method Selection */}
          {withdrawalInfo.canWithdraw && (
            <>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Select Withdrawal Method</h3>
                
                <div className="space-y-3">
                  {/* Online Transfer Option */}
                  <button
                    onClick={() => setStep('online')}
                    className="w-full bg-white border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-xl p-5 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-blue-100 group-hover:bg-blue-200 rounded-xl flex items-center justify-center transition-colors">
                        <CreditCard className="w-7 h-7 text-blue-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="font-bold text-gray-900 text-lg mb-1">Online Money Transfer</h4>
                        <p className="text-sm text-gray-600">Direct bank transfer to your account</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </button>

                  {/* Physical Cash Option */}
                  <button
                    onClick={() => setStep('physical')}
                    className="w-full bg-white border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 rounded-xl p-5 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-green-100 group-hover:bg-green-200 rounded-xl flex items-center justify-center transition-colors">
                        <Banknote className="w-7 h-7 text-green-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="font-bold text-gray-900 text-lg mb-1">Physical Cash Pickup</h4>
                        <p className="text-sm text-gray-600">Collect cash from your referrer</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Info Note */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-600 text-center">
                  💡 All withdrawal requests require approval from your referrer
                </p>
              </div>
            </>
          )}

          {/* Close Button (when disabled) */}
          {!withdrawalInfo.canWithdraw && (
            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
