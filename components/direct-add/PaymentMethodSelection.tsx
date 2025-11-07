'use client';

import { useState } from 'react';
import { Banknote, CreditCard, AlertCircle, Info } from 'lucide-react';

export type DirectPaymentMethod = 'cash' | 'digital' | null;

interface PaymentMethodSelectionProps {
  amount: string;
  bonus: number;
  totalCredit: number;
  onContinue: (method: DirectPaymentMethod) => void;
  onBack: () => void;
}

export default function PaymentMethodSelection({ 
  amount, 
  bonus, 
  totalCredit, 
  onContinue, 
  onBack 
}: PaymentMethodSelectionProps) {
  const [paymentMethod, setPaymentMethod] = useState<DirectPaymentMethod>(null);
  const [error, setError] = useState('');

  const amountValue = parseFloat(amount);
  const isCashEnabled = amountValue >= 100000; // ₹1,00,000

  const handleContinue = () => {
    setError('');
    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }
    onContinue(paymentMethod);
  };

  return (
    <div className="space-y-6">
      {/* Amount Summary */}
      <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Amount to Add:</span>
            <span className="font-bold text-gray-900 text-lg">₹{amountValue.toLocaleString('en-IN')}</span>
          </div>
          {bonus > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Bonus:</span>
              <span className="font-semibold text-green-600">+₹{bonus.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t-2 border-gray-300">
            <span className="font-bold text-gray-900">Total Credit:</span>
            <span className="font-bold text-green-600 text-xl">₹{totalCredit.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Choose Payment Method *
        </label>
        <div className="space-y-3">
          {/* Add Cash */}
          <button
            onClick={() => isCashEnabled && setPaymentMethod('cash')}
            disabled={!isCashEnabled}
            className={`w-full p-4 border-2 rounded-xl transition-all text-left relative ${
              !isCashEnabled
                ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                : paymentMethod === 'cash'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            {!isCashEnabled && (
              <div className="absolute top-2 right-2 bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-semibold">
                DISABLED
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'cash' && isCashEnabled ? 'border-green-600' : 'border-gray-300'
              }`}>
                {paymentMethod === 'cash' && isCashEnabled && (
                  <div className="w-3 h-3 rounded-full bg-green-600"></div>
                )}
              </div>
              <Banknote className={`w-6 h-6 ${isCashEnabled ? 'text-green-600' : 'text-gray-400'}`} />
              <div className="flex-1">
                <p className={`font-semibold ${isCashEnabled ? 'text-gray-900' : 'text-gray-500'}`}>
                  ○ Add Cash (Physical Cash)
                </p>
                <p className="text-sm text-gray-600">
                  {isCashEnabled ? 'Our team will collect cash from you' : 'Minimum ₹1,00,000 required'}
                </p>
              </div>
            </div>
          </button>

          {/* Add Digital Money */}
          <button
            onClick={() => setPaymentMethod('digital')}
            className={`w-full p-4 border-2 rounded-xl transition-all text-left ${
              paymentMethod === 'digital'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'digital' ? 'border-green-600' : 'border-gray-300'
              }`}>
                {paymentMethod === 'digital' && (
                  <div className="w-3 h-3 rounded-full bg-green-600"></div>
                )}
              </div>
              <CreditCard className="w-6 h-6 text-blue-600" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">○ Add Digital Money</p>
                <p className="text-sm text-gray-600">(UPI/Bank Transfer)</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Info Box for Cash Payment */}
      {!isCashEnabled && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Cash payment is available only for amounts ₹1 Lakh and above. 
            For smaller amounts, please use digital payment methods.
          </p>
        </div>
      )}

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
          className="flex-1 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
