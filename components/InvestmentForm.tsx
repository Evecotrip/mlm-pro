'use client';

import { useState } from 'react';
import { User, riskProfiles, lockInPeriods, calculateReturn } from '@/lib/mockData';
import { DollarSign, TrendingUp, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface InvestmentFormProps {
  currentUser: User;
  onSuccess: () => void;
}

export default function InvestmentForm({ currentUser, onSuccess }: InvestmentFormProps) {
  const [amount, setAmount] = useState<string>('');
  const [selectedRisk, setSelectedRisk] = useState<'low' | 'moderate' | 'high' | null>(null);
  const [selectedLockIn, setSelectedLockIn] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const numAmount = parseFloat(amount) || 0;

  // Get available risk profiles based on amount
  const availableRisks = riskProfiles.filter(risk => numAmount >= risk.threshold);

  // Calculate returns
  const returns = selectedRisk && selectedLockIn 
    ? calculateReturn(numAmount, selectedRisk, selectedLockIn)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (numAmount < 500) {
      setError('Minimum investment amount is ₹500');
      return;
    }

    if (!selectedRisk) {
      setError('Please select a risk profile');
      return;
    }

    if (!selectedLockIn) {
      setError('Please select a lock-in period');
      return;
    }

    // Create investment (in real app, this would be an API call)
    const newInvestment = {
      id: `inv-${Date.now()}`,
      userId: currentUser.id,
      amount: numAmount,
      riskProfile: selectedRisk,
      lockInMonths: selectedLockIn,
      baseReturn: returns!.baseReturn,
      lockInBonus: returns!.lockInBonus,
      totalReturn: returns!.totalReturn,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };

    // Store in localStorage (dummy implementation)
    const investments = JSON.parse(localStorage.getItem('investments') || '[]');
    investments.push(newInvestment);
    localStorage.setItem('investments', JSON.stringify(investments));

    setSuccess(true);
    setTimeout(() => {
      onSuccess();
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          <p className="text-sm text-green-800">
            Investment request submitted! Waiting for referrer approval.
          </p>
        </div>
      )}

      {/* Investment Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Investment Amount <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setSelectedRisk(null); // Reset risk selection when amount changes
            }}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg font-semibold text-gray-900"
            placeholder="500"
            min="500"
            step="100"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Minimum: ₹500 | No maximum limit</p>
      </div>

      {/* Risk Profile Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Risk Profile <span className="text-red-500">*</span>
        </label>
        <div className="grid gap-3">
          {riskProfiles.map((risk) => {
            const isAvailable = numAmount >= risk.threshold;
            const isSelected = selectedRisk === risk.level;

            return (
              <button
                key={risk.level}
                type="button"
                onClick={() => isAvailable && setSelectedRisk(risk.level)}
                disabled={!isAvailable}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : isAvailable
                    ? 'border-gray-200 hover:border-blue-300 bg-white'
                    : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className={`font-bold ${isAvailable ? 'text-gray-900' : 'text-gray-400'}`}>
                      {risk.name}
                    </h3>
                    <p className={`text-sm ${isAvailable ? 'text-gray-600' : 'text-gray-400'}`}>
                      {risk.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${
                      isAvailable ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {risk.returnRate}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className={isAvailable ? 'text-gray-600' : 'text-gray-400'}>
                    Min: ₹{risk.threshold.toLocaleString()}
                  </span>
                  {!isAvailable && (
                    <span className="text-red-600 font-medium">
                      Need ₹{(risk.threshold - numAmount).toLocaleString()} more
                    </span>
                  )}
                  {isSelected && (
                    <span className="text-blue-600 font-medium">✓ Selected</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lock-in Period Selection */}
      {selectedRisk && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Lock-in Period <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {lockInPeriods.map((period) => {
              const isSelected = selectedLockIn === period.months;

              return (
                <button
                  key={period.months}
                  type="button"
                  onClick={() => setSelectedLockIn(period.months)}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 bg-white'
                  }`}
                >
                  <Clock className={`w-6 h-6 mx-auto mb-2 ${
                    isSelected ? 'text-purple-600' : 'text-gray-400'
                  }`} />
                  <p className="font-bold text-gray-900">{period.months} Month{period.months > 1 ? 's' : ''}</p>
                  <p className="text-sm text-green-600 font-semibold">+{period.bonusRate}%</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Return Calculation Summary */}
      {returns && (
        <div className="bg-linear-to-br from-green-50 to-blue-50 rounded-lg p-6 border-2 border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-bold text-gray-900">Investment Summary</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Investment Amount:</span>
              <span className="font-semibold text-gray-900">₹{numAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Base Return ({riskProfiles.find(r => r.level === selectedRisk)?.returnRate}%):</span>
              <span className="font-semibold text-green-600">₹{returns.baseReturn.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Lock-in Bonus ({lockInPeriods.find(l => l.months === selectedLockIn)?.bonusRate}%):</span>
              <span className="font-semibold text-green-600">₹{returns.lockInBonus.toLocaleString()}</span>
            </div>
            <div className="border-t-2 border-green-300 pt-3 flex justify-between">
              <span className="font-bold text-gray-900">Total Return:</span>
              <span className="font-bold text-green-600 text-xl">₹{returns.totalReturn.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-gray-900">Final Amount:</span>
              <span className="font-bold text-blue-600 text-2xl">₹{(numAmount + returns.totalReturn).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!amount || !selectedRisk || !selectedLockIn || success}
        className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-bold text-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {success ? 'Investment Submitted!' : 'Submit Investment Request'}
      </button>

      {/* Important Note */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Your investment will be pending until approved by your referrer. 
          Payment is cash-only and will be collected after approval.
        </p>
      </div>
    </form>
  );
}
