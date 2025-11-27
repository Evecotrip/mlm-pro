'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import { 
  getInvestmentProfiles, 
  getExchangeRate, 
  InvestmentProfile,
  ExchangeRate 
} from '@/api/investment-api';
import { 
  TrendingUp, 
  Clock, 
  Users, 
  Shield, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Crown,
  Gem,
  Award
} from 'lucide-react';

const CURRENCIES = [
  { code: 'USDT', name: 'USDT', symbol: '', rate: 1 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 0 },
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 0 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0 },
];

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
    button: 'from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700',
  },
  SILVER: {
    gradient: 'from-gray-400 to-gray-600',
    bg: 'bg-gradient-to-br from-gray-50 to-slate-50',
    border: 'border-gray-300',
    text: 'text-gray-700',
    button: 'from-gray-500 to-slate-600 hover:from-gray-600 hover:to-slate-700',
  },
  GOLD: {
    gradient: 'from-yellow-500 to-amber-600',
    bg: 'bg-gradient-to-br from-yellow-50 to-amber-50',
    border: 'border-yellow-400',
    text: 'text-yellow-700',
    button: 'from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700',
  },
  DIAMOND: {
    gradient: 'from-cyan-500 to-blue-600',
    bg: 'bg-gradient-to-br from-cyan-50 to-blue-50',
    border: 'border-cyan-400',
    text: 'text-cyan-700',
    button: 'from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700',
  },
};

export default function NewInvestmentPage() {
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const [profiles, setProfiles] = useState<InvestmentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState('USDT');
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({
    USDT: 1,
    INR: 0,
    USD: 0,
    EUR: 0,
    GBP: 0,
  });

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push('/login');
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    fetchInvestmentProfiles();
    fetchExchangeRates();
  }, []);

  const fetchInvestmentProfiles = async () => {
    setLoading(true);
    try {
      const response = await getInvestmentProfiles();
      if (response.success && response.data) {
        setProfiles(response.data);
      } else {
        console.error('Failed to fetch investment profiles:', response.error);
      }
    } catch (error) {
      console.error('Error fetching investment profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExchangeRates = async () => {
    try {
      // Fetch rates for all currencies
      const currencies = ['INR', 'USD', 'EUR', 'GBP'];
      const rates: { [key: string]: number } = { USDT: 1 };

      for (const currency of currencies) {
        const response = await getExchangeRate(currency);
        if (response.success && response.data) {
          // Convert rate to USDT to currency (inverse of currency to USDT)
          rates[currency] = 1 / parseFloat(response.data.rate);
        }
      }

      setExchangeRates(rates);
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    }
  };

  const convertAmount = (usdtAmount: string): string => {
    const amount = parseFloat(usdtAmount);
    const rate = exchangeRates[selectedCurrency] || 1;
    return (amount * rate).toFixed(2);
  };

  const getCurrencySymbol = (): string => {
    const currency = CURRENCIES.find(c => c.code === selectedCurrency);
    return currency?.symbol || '';
  };

  const handleSelectPlan = (profile: InvestmentProfile) => {
    // Navigate to investment creation page with selected profile
    router.push(`/create-investment?profile=${profile.profile}`);
  };

  const handleLogout = async () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
        <Navbar onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading investment plans...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <Navbar onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Choose Your Investment Plan
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Select the perfect investment tier that matches your goals and watch your wealth grow
          </p>

          {/* Currency Selector */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="text-gray-400 text-sm">View amounts in:</span>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors"
            >
              {CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.name} ({currency.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Investment Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {profiles.map((profile) => {
            const Icon = PROFILE_ICONS[profile.profile];
            const colors = PROFILE_COLORS[profile.profile];

            return (
              <div
                key={profile.profile}
                className={`relative rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${colors.bg} border-2 ${colors.border}`}
              >
                {/* Recommended Badge for GOLD */}
                {profile.profile === 'GOLD' && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10">
                    ⭐ RECOMMENDED
                  </div>
                )}

                {/* Header */}
                <div className={`bg-gradient-to-r ${colors.gradient} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-10 h-10" />
                    <span className="text-sm font-semibold opacity-90">
                      Priority {profile.priority}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{profile.profile}</h3>
                  <p className="text-sm opacity-90">{profile.description}</p>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                  {/* Investment Range */}
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Investment Range</p>
                    <p className={`text-2xl font-bold ${colors.text}`}>
                      {getCurrencySymbol()}{convertAmount(profile.minInvestment)} - {profile.maxInvestment === '9999999999' ? '∞' : `${getCurrencySymbol()}${convertAmount(profile.maxInvestment)}`}
                    </p>
                    {selectedCurrency !== 'USDT' && (
                      <p className="text-xs text-gray-500 mt-1">
                        {profile.minInvestment} - {profile.maxInvestment === '9999999999' ? '∞' : profile.maxInvestment} USDT
                      </p>
                    )}
                  </div>

                  {/* Returns */}
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-3">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-600">Returns</p>
                      <p className="text-lg font-bold text-green-700">
                        {profile.minReturnRate}% - {profile.maxReturnRate}%
                      </p>
                    </div>
                  </div>

                  {/* Lock-in Period */}
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-600">Lock-in Period</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {profile.lockInMonths} months
                      </p>
                    </div>
                  </div>

                  {/* Network Depth */}
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-600">Network Levels</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {profile.maxHierarchyDepth} levels
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-xs text-gray-600 mb-2 font-semibold">Features:</p>
                    <ul className="space-y-2">
                      {profile.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Select Button */}
                  <button
                    onClick={() => handleSelectPlan(profile)}
                    className={`w-full py-3 bg-gradient-to-r ${colors.button} text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 group`}
                  >
                    Select {profile.profile}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info Section */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-8 text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Why Invest With Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">🔒 Secure & Transparent</h3>
                <p className="text-sm text-gray-300">
                  Your investments are protected with industry-leading security measures
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">📈 Proven Returns</h3>
                <p className="text-sm text-gray-300">
                  Consistent growth with competitive return rates across all tiers
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🤝 Network Benefits</h3>
                <p className="text-sm text-gray-300">
                  Earn additional bonuses through our multi-level referral system
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
