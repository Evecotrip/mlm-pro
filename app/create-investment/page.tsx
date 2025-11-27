'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import { 
  createInvestment, 
  getInvestmentProfiles,
  InvestmentProfile 
} from '@/api/investment-api';
import { 
  TrendingUp, 
  Clock, 
  Users, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Crown,
  Gem,
  Award
} from 'lucide-react';

const PROFILE_ICONS = {
  BRONZE: Award,
  SILVER: Shield,
  GOLD: Crown,
  DIAMOND: Gem,
};

const PROFILE_COLORS = {
  BRONZE: {
    gradient: 'from-amber-600 to-orange-700',
    bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
    border: 'border-amber-300',
    text: 'text-amber-700',
  },
  SILVER: {
    gradient: 'from-gray-400 to-gray-600',
    bg: 'bg-gradient-to-br from-gray-50 to-slate-50',
    border: 'border-gray-300',
    text: 'text-gray-700',
  },
  GOLD: {
    gradient: 'from-yellow-500 to-amber-600',
    bg: 'bg-gradient-to-br from-yellow-50 to-amber-50',
    border: 'border-yellow-400',
    text: 'text-yellow-700',
  },
  DIAMOND: {
    gradient: 'from-cyan-500 to-blue-600',
    bg: 'bg-gradient-to-br from-cyan-50 to-blue-50',
    border: 'border-cyan-400',
    text: 'text-cyan-700',
  },
};

export default function CreateInvestmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, user } = useUser();
  
  const selectedProfile = searchParams.get('profile') as 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND';
  
  const [profileDetails, setProfileDetails] = useState<InvestmentProfile | null>(null);
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [createdInvestment, setCreatedInvestment] = useState<any>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push('/login');
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    if (!selectedProfile) {
      router.push('/new-investment');
      return;
    }
    fetchProfileDetails();
  }, [selectedProfile]);

  const fetchProfileDetails = async () => {
    try {
      const response = await getInvestmentProfiles();
      if (response.success && response.data) {
        const profile = response.data.find(p => p.profile === selectedProfile);
        if (profile) {
          setProfileDetails(profile);
          // Set minimum amount as default
          setAmount(profile.minInvestment);
        }
      }
    } catch (error) {
      console.error('Error fetching profile details:', error);
    }
  };

  const handleCreateInvestment = async () => {
    setError('');
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!profileDetails) {
      setError('Profile details not loaded');
      return;
    }

    const amountNum = parseFloat(amount);
    const minAmount = parseFloat(profileDetails.minInvestment);
    const maxAmount = parseFloat(profileDetails.maxInvestment);

    if (amountNum < minAmount) {
      setError(`Minimum investment for ${selectedProfile} is ${minAmount} USDT`);
      return;
    }

    if (profileDetails.maxInvestment !== '9999999999' && amountNum > maxAmount) {
      setError(`Maximum investment for ${selectedProfile} is ${maxAmount} USDT`);
      return;
    }

    setLoading(true);

    try {
      const response = await createInvestment({
        profile: selectedProfile,
        amount: amountNum,
        notes: notes || `${selectedProfile} investment`
      });

      if (response.success && response.data) {
        setCreatedInvestment(response.data);
        setSuccess(true);
      } else {
        setError(response.error || 'Failed to create investment');
      }
    } catch (error) {
      console.error('Error creating investment:', error);
      setError('An error occurred while creating investment');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    router.push('/');
  };

  if (!profileDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
        <Navbar onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (success && createdInvestment) {
    const Icon = PROFILE_ICONS[selectedProfile];
    const colors = PROFILE_COLORS[selectedProfile];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
        <Navbar onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Success Message */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                ✓ Investment Created Successfully
              </h1>
              <p className="text-gray-600">
                Your investment request has been submitted for approval
              </p>
            </div>

            {/* Investment Details */}
            <div className={`${colors.bg} border-2 ${colors.border} rounded-2xl p-6 mb-6`}>
              <div className="flex items-center gap-3 mb-4">
                <Icon className={`w-8 h-8 ${colors.text}`} />
                <h2 className="text-xl font-bold text-gray-900">{selectedProfile} Investment</h2>
              </div>

              <div className="space-y-3 border-t-2 border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Reference ID:</span>
                  <span className="font-bold text-gray-900 font-mono">{createdInvestment.referenceId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-bold text-gray-900">{createdInvestment.amount} USDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expected Returns:</span>
                  <span className="font-bold text-green-600">
                    {createdInvestment.expectedMinReturn} - {createdInvestment.expectedMaxReturn} USDT
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Return Rate:</span>
                  <span className="font-semibold text-gray-900">
                    {createdInvestment.minReturnRate}% - {createdInvestment.maxReturnRate}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lock-in Period:</span>
                  <span className="font-semibold text-gray-900">
                    {createdInvestment.lockInMonths} months
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Maturity Date:</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(createdInvestment.maturityDate).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                    {createdInvestment.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>What's Next?</strong><br />
                Your investment is awaiting approval from your referrer. Once approved, it will become active and start earning returns. You'll be notified via email.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push('/investment-history')}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors"
              >
                View All Investments
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const Icon = PROFILE_ICONS[selectedProfile];
  const colors = PROFILE_COLORS[selectedProfile];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      <Navbar onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.push('/new-investment')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Plans
          </button>

          {/* Header */}
          <div className={`${colors.bg} border-2 ${colors.border} rounded-2xl p-6 mb-6`}>
            <div className="flex items-center gap-3 mb-4">
              <Icon className={`w-10 h-10 ${colors.text}`} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedProfile} Investment</h1>
                <p className="text-sm text-gray-600">{profileDetails.description}</p>
              </div>
            </div>

            {/* Plan Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t-2 border-gray-200">
              <div>
                <p className="text-xs text-gray-600 mb-1">Returns</p>
                <p className="font-bold text-green-600">
                  {profileDetails.minReturnRate}% - {profileDetails.maxReturnRate}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Lock-in</p>
                <p className="font-bold text-gray-900">{profileDetails.lockInMonths} months</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Network</p>
                <p className="font-bold text-gray-900">{profileDetails.maxHierarchyDepth} levels</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Min Amount</p>
                <p className="font-bold text-gray-900">{profileDetails.minInvestment} USDT</p>
              </div>
            </div>
          </div>

          {/* Investment Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Investment Details</h2>

            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Investment Amount (USDT) *
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount in USDT"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors text-lg font-semibold text-gray-900"
                min={profileDetails.minInvestment}
                max={profileDetails.maxInvestment !== '9999999999' ? profileDetails.maxInvestment : undefined}
                step="0.01"
              />
              <p className="text-xs text-gray-500 mt-2">
                Range: {profileDetails.minInvestment} - {profileDetails.maxInvestment === '9999999999' ? '∞' : profileDetails.maxInvestment} USDT
              </p>
            </div>

            {/* Expected Returns Display */}
            {amount && parseFloat(amount) > 0 && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">Expected Returns:</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-600">Minimum</p>
                    <p className="text-lg font-bold text-green-700">
                      {(parseFloat(amount) * parseFloat(profileDetails.minReturnRate) / 100).toFixed(2)} USDT
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">to</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Maximum</p>
                    <p className="text-lg font-bold text-green-700">
                      {(parseFloat(amount) * parseFloat(profileDetails.maxReturnRate) / 100).toFixed(2)} USDT
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Notes Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this investment..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors text-gray-900"
                rows={3}
              />
            </div>

            {/* Features */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Plan Features:</p>
              <ul className="space-y-2">
                {profileDetails.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleCreateInvestment}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating Investment...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Create Investment
                </>
              )}
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <strong>ℹ️ Important:</strong> Your investment will be reviewed and approved by your referrer. Once approved, the lock-in period begins and you cannot withdraw until maturity.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
