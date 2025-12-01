'use client';

import { useState } from 'react';
import { User, riskProfiles, lockInPeriods, calculateReturn } from '@/lib/mockData';
import { TrendingUp, Clock, AlertCircle, CheckCircle, ArrowRight, Shield, Wallet } from 'lucide-react';

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
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-500 mt-0.5" />
          <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
            Investment request submitted! Waiting for referrer approval.
          </p>
        </div>
      )}

      {/* Investment Amount */}
      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
          Investment Amount <span className="text-red-500">*</span>
        </label>
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-500 text-xl font-bold group-focus-within:text-purple-600 dark:group-focus-within:text-purple-500 transition-colors">₹</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setSelectedRisk(null); // Reset risk selection when amount changes
            }}
            className="w-full pl-10 pr-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-xl font-bold placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-600"
            placeholder="500"
            min="500"
            step="100"
          />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 flex items-center gap-1">
          <Wallet className="w-3 h-3" />
          Minimum: ₹500 | No maximum limit
        </p>
      </div>

      {/* Risk Profile Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
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
                className={`p-5 rounded-xl border text-left transition-all relative overflow-hidden group ${isSelected
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/10 shadow-lg shadow-purple-500/10'
                  : isAvailable
                    ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 hover:border-purple-500/50 hover:bg-slate-50 dark:hover:bg-slate-900'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/30 opacity-50 cursor-not-allowed'
                  }`}
              >
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <div>
                    <h3 className={`font-bold text-lg flex items-center gap-2 ${isAvailable ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-500'}`}>
                      {risk.name}
                      {isSelected && <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-500" />}
                    </h3>
                    <p className={`text-sm mt-1 ${isAvailable ? 'text-slate-600 dark:text-slate-400' : 'text-slate-500 dark:text-slate-600'}`}>
                      {risk.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${isAvailable ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-600'
                      }`}>
                      {risk.returnRate}%
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500">Return Rate</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-200 dark:border-slate-800/50 mt-3 relative z-10">
                  <span className={isAvailable ? 'text-slate-500 dark:text-slate-500' : 'text-slate-500 dark:text-slate-600'}>
                    Min Investment: <span className="font-mono">₹{risk.threshold.toLocaleString()}</span>
                  </span>
                  {!isAvailable && (
                    <span className="text-red-500 dark:text-red-400 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Add ₹{(risk.threshold - numAmount).toLocaleString()} more
                    </span>
                  )}
                </div>

                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lock-in Period Selection */}
      {selectedRisk && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
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
                  className={`p-4 rounded-xl border text-center transition-all relative overflow-hidden group ${isSelected
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/10 shadow-lg shadow-purple-500/10'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 hover:border-purple-500/50 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                >
                  <div className={`w-10 h-10 mx-auto mb-3 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-800 group-hover:text-purple-600 dark:group-hover:text-purple-400'
                    }`}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <p className={`font-bold mb-1 ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                    {period.months} Month{period.months > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">+{period.bonusRate}% Bonus</p>

                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-500" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Return Calculation Summary */}
      {returns && (
        <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950 rounded-xl p-6 border border-slate-200 dark:border-slate-800 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-200 dark:border-emerald-500/20">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Investment Summary</h3>
          </div>

          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">Investment Amount</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">₹{numAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">Base Return <span className="text-xs text-slate-500 dark:text-slate-500">({riskProfiles.find(r => r.level === selectedRisk)?.returnRate}%)</span></span>
              <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">+₹{returns.baseReturn.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">Lock-in Bonus <span className="text-xs text-slate-500 dark:text-slate-500">({lockInPeriods.find(l => l.months === selectedLockIn)?.bonusRate}%)</span></span>
              <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">+₹{returns.lockInBonus.toLocaleString()}</span>
            </div>

            <div className="h-px bg-slate-200 dark:bg-slate-800 my-2"></div>

            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-700 dark:text-slate-300">Total Return</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-lg">+₹{returns.totalReturn.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center bg-white/50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white">Final Amount</span>
              <span className="font-mono font-bold text-purple-600 dark:text-purple-400 text-xl">₹{(numAmount + returns.totalReturn).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!amount || !selectedRisk || !selectedLockIn || success}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 flex items-center justify-center gap-2 group"
      >
        {success ? (
          <>
            <CheckCircle className="w-5 h-5" />
            Investment Submitted!
          </>
        ) : (
          <>
            Submit Investment Request
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>

      {/* Important Note */}
      <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700 dark:text-amber-200/80 leading-relaxed">
          <strong className="text-amber-800 dark:text-amber-400 block mb-1">Important Note</strong>
          Your investment will be pending until approved by your referrer.
          Payment is cash-only and will be collected after approval.
        </p>
      </div>
    </form>
  );
}
