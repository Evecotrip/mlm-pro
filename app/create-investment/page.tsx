'use client';

import { useEffect, useState, Suspense } from 'react';
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
  Award,
  Loader2
} from 'lucide-react';

const PROFILE_ICONS = {
  BRONZE: Award,
  SILVER: Shield,
  GOLD: Crown,
  DIAMOND: Gem,
};

const PROFILE_STYLES = {
  BRONZE: {
    gradient: 'from-amber-600 to-orange-700',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-500',
    shadow: 'shadow-amber-500/10',
  },
  SILVER: {
    gradient: 'from-slate-400 to-slate-600',
    bg: 'bg-slate-400/10',
    border: 'border-slate-400/20',
    text: 'text-slate-400',
    shadow: 'shadow-slate-400/10',
  },
  GOLD: {
    gradient: 'from-yellow-500 to-amber-600',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    text: 'text-yellow-500',
    shadow: 'shadow-yellow-500/10',
  },
  DIAMOND: {
    gradient: 'from-cyan-500 to-blue-600',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    text: 'text-cyan-500',
    shadow: 'shadow-cyan-500/10',
  },
};

function CreateInvestmentContent() {
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading plan details...</p>
        </div>
      </div>
    );
  }

  if (success && createdInvestment) {
    const Icon = PROFILE_ICONS[selectedProfile];
    const styles = PROFILE_STYLES[selectedProfile];

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-blue-500/30 transition-colors duration-300">
        <Navbar onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Success Message */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-500" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Investment Created Successfully
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Your investment request has been submitted for approval
              </p>
            </div>

            {/* Investment Details */}
            <div className={`bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 p-8 mb-6 relative overflow-hidden shadow-sm dark:shadow-none`}>
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${styles.gradient}`}></div>

              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-xl ${styles.bg} ${styles.border} border`}>
                  <Icon className={`w-8 h-8 ${styles.text}`} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedProfile} Investment</h2>
              </div>

              <div className="space-y-4 border-t border-slate-200 dark:border-slate-800 pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Reference ID</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono bg-slate-100 dark:bg-slate-950 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800">{createdInvestment.referenceId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Amount</span>
                  <span className="font-bold text-slate-900 dark:text-white text-lg">{createdInvestment.amount} USDT</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Expected Returns</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {createdInvestment.expectedMinReturn} - {createdInvestment.expectedMaxReturn} USDT
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Return Rate</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {createdInvestment.minReturnRate}% - {createdInvestment.maxReturnRate}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Lock-in Period</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {createdInvestment.lockInMonths} months
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Maturity Date</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {new Date(createdInvestment.maturityDate).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Status</span>
                  <span className="px-3 py-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border border-yellow-500/20 rounded-full text-sm font-bold uppercase tracking-wide">
                    {createdInvestment.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 mb-8">
              <div className="flex gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg h-fit">
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-blue-600 dark:text-blue-400 font-bold mb-1">What's Next?</h3>
                  <p className="text-sm text-blue-800/80 dark:text-blue-200/80 leading-relaxed">
                    Your investment is awaiting approval from your referrer. Once approved, it will become active and start earning returns automatically. You'll be notified via email.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push('/investment-history')}
                className="flex-1 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20"
              >
                View All Investments
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="flex-1 px-6 py-4 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl font-bold transition-colors"
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
  const styles = PROFILE_STYLES[selectedProfile];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-blue-500/30 transition-colors duration-300">
      <Navbar onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.push('/new-investment')}
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Plans
          </button>

          {/* Header */}
          <div className={`bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 p-8 mb-6 relative overflow-hidden group hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm dark:shadow-none`}>
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${styles.gradient}`}></div>

            <div className="flex items-center gap-4 mb-6">
              <div className={`p-4 rounded-2xl ${styles.bg} ${styles.border} border shadow-lg ${styles.shadow}`}>
                <Icon className={`w-10 h-10 ${styles.text}`} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{selectedProfile} Investment</h1>
                <p className="text-slate-500 dark:text-slate-400">{profileDetails.description}</p>
              </div>
            </div>

            {/* Plan Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="bg-slate-100 dark:bg-slate-950/50 rounded-xl p-3 border border-slate-200 dark:border-slate-800/50">
                <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Returns</p>
                <p className="font-bold text-emerald-600 dark:text-emerald-400">
                  {profileDetails.minReturnRate}% - {profileDetails.maxReturnRate}%
                </p>
              </div>
              <div className="bg-slate-100 dark:bg-slate-950/50 rounded-xl p-3 border border-slate-200 dark:border-slate-800/50">
                <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Lock-in</p>
                <p className="font-bold text-slate-900 dark:text-white">{profileDetails.lockInMonths} months</p>
              </div>
              <div className="bg-slate-100 dark:bg-slate-950/50 rounded-xl p-3 border border-slate-200 dark:border-slate-800/50">
                <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Network</p>
                <p className="font-bold text-slate-900 dark:text-white">{profileDetails.maxHierarchyDepth} levels</p>
              </div>
              <div className="bg-slate-100 dark:bg-slate-950/50 rounded-xl p-3 border border-slate-200 dark:border-slate-800/50">
                <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Min Amount</p>
                <p className="font-bold text-slate-900 dark:text-white">{profileDetails.minInvestment} USDT</p>
              </div>
            </div>
          </div>

          {/* Investment Form */}
          <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 p-8 mb-6 shadow-sm dark:shadow-none">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-500" />
              Investment Details
            </h2>

            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                Investment Amount (USDT) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount in USDT"
                  className="w-full px-4 py-4 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-lg font-bold placeholder:font-normal"
                  min={profileDetails.minInvestment}
                  max={profileDetails.maxInvestment !== '9999999999' ? profileDetails.maxInvestment : undefined}
                  step="0.01"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold pointer-events-none">
                  USDT
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Range: {profileDetails.minInvestment} - {profileDetails.maxInvestment === '9999999999' ? '∞' : profileDetails.maxInvestment} USDT
              </p>
            </div>

            {/* Expected Returns Display */}
            {amount && parseFloat(amount) > 0 && (
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6 mb-6">
                <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-4 font-medium">Expected Returns Calculator</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Minimum Return</p>
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      {(parseFloat(amount) * parseFloat(profileDetails.minReturnRate) / 100).toFixed(2)} USDT
                    </p>
                  </div>
                  <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 mb-1">Maximum Return</p>
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      {(parseFloat(amount) * parseFloat(profileDetails.maxReturnRate) / 100).toFixed(2)} USDT
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Notes Input */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this investment..."
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                rows={3}
              />
            </div>

            {/* Features */}
            <div className="bg-slate-100 dark:bg-slate-950/50 rounded-2xl p-6 mb-8 border border-slate-200 dark:border-slate-800/50">
              <p className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Plan Features</p>
              <ul className="space-y-3">
                {profileDetails.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleCreateInvestment}
              disabled={loading}
              className={`w-full py-4 bg-gradient-to-r ${styles.gradient} hover:opacity-90 text-white rounded-xl font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
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
          <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6 text-center">
            <p className="text-sm text-blue-800/80 dark:text-blue-300/80">
              <strong className="text-blue-600 dark:text-blue-400">ℹ️ Important:</strong> Your investment will be reviewed and approved by your referrer. Once approved, the lock-in period begins and you cannot withdraw until maturity.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CreateInvestmentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    }>
      <CreateInvestmentContent />
    </Suspense>
  );
}
