'use client';

import { useState } from 'react';
import { QrCode, Building2, AlertCircle } from 'lucide-react';

export type DigitalOption = 'qr-code' | 'bank-details' | null;

interface DigitalPaymentOptionsProps {
  amount: string;
  bonus: number;
  totalCredit: number;
  onContinue: (option: DigitalOption) => void;
  onBack: () => void;
}

export default function DigitalPaymentOptions({ 
  amount, 
  bonus, 
  totalCredit, 
  onContinue, 
  onBack 
}: DigitalPaymentOptionsProps) {
  const [selectedOption, setSelectedOption] = useState<DigitalOption>(null);
  const [error, setError] = useState('');

  const handleContinue = () => {
    setError('');
    if (!selectedOption) {
      setError('Please select a payment option');
      return;
    }
    onContinue(selectedOption);
  };

  return (
    <div className="space-y-6">
      {/* Amount Summary */}
      <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Amount to Add:</span>
            <span className="font-bold text-gray-900 text-lg">₹{parseFloat(amount).toLocaleString('en-IN')}</span>
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

      {/* Digital Payment Options */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Select Payment Method *
        </label>
        <div className="space-y-3">
          {/* Request for QR Code */}
          <button
            onClick={() => setSelectedOption('qr-code')}
            className={`w-full p-4 border-2 rounded-xl transition-all text-left ${
              selectedOption === 'qr-code'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedOption === 'qr-code' ? 'border-blue-600' : 'border-gray-300'
              }`}>
                {selectedOption === 'qr-code' && (
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                )}
              </div>
              <QrCode className="w-6 h-6 text-blue-600" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">○ Request for QR Code</p>
                <p className="text-sm text-gray-600">Pay via UPI using QR code</p>
              </div>
            </div>
          </button>

          {/* Request for Bank Details */}
          <button
            onClick={() => setSelectedOption('bank-details')}
            className={`w-full p-4 border-2 rounded-xl transition-all text-left ${
              selectedOption === 'bank-details'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedOption === 'bank-details' ? 'border-green-600' : 'border-gray-300'
              }`}>
                {selectedOption === 'bank-details' && (
                  <div className="w-3 h-3 rounded-full bg-green-600"></div>
                )}
              </div>
              <Building2 className="w-6 h-6 text-green-600" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">○ Request for Bank Details</p>
                <p className="text-sm text-gray-600">Pay via NEFT/RTGS/IMPS</p>
              </div>
            </div>
          </button>
        </div>
      </div>

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
