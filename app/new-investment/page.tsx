'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import {
  getInvestmentProfiles,
  getExchangeRate,
  InvestmentProfile
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
  Award,
  Zap
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

const PROFILE_STYLES = {
  BRONZE: {
    gradient: 'from-amber-700/20 to-orange-900/20',
    border: 'border-amber-700/50',
    text: 'text-amber-500',
    icon: 'text-amber-500',
    glow: 'shadow-amber-900/20',
    button: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500',
  },
  SILVER: {
    gradient: 'from-slate-700/20 to-gray-900/20',
    border: 'border-slate-500/50',
    text: 'text-slate-300',
    icon: 'text-slate-300',
    glow: 'shadow-slate-900/20',
    button: 'bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-500 hover:to-gray-500',
  },
  GOLD: {
    gradient: 'from-yellow-700/20 to-amber-900/20',
    border: 'border-yellow-500/50',
    text: 'text-yellow-400',
    icon: 'text-yellow-400',
    glow: 'shadow-yellow-900/20',
    button: 'bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500',
  },
  DIAMOND: {
    gradient: 'from-cyan-700/20 to-blue-900/20',
    border: 'border-cyan-500/50',
    text: 'text-cyan-400',
    icon: 'text-cyan-400',
    glow: 'shadow-cyan-900/20',
    button: 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500',
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
      const currencies = ['INR', 'USD', 'EUR', 'GBP'];
      const rates: { [key: string]: number } = { USDT: 1 };

      for (const currency of currencies) {
        const response = await getExchangeRate(currency);
        if (response.success && response.data) {
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
    router.push(`/create-investment?profile=${profile.profile}`);
  };

  const handleLogout = async () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <Navbar onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading investment plans...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30">
      <Navbar onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8 relative">
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[100px]"></div>
        </div>

        {/* Header Section */}
        <div className="text-center mb-16 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-slate-800 backdrop-blur-md mb-6">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-medium text-yellow-500 uppercase tracking-wide">Premium Plans</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Choose Your <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Growth Path</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
            Select the perfect investment tier that matches your goals and watch your wealth grow with our secure, high-yield strategies.
          </p>

          {/* Currency Selector */}
          <div className="inline-flex items-center bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-1">
            {CURRENCIES.map((currency) => (
              <button
                key={currency.code}
                onClick={() => setSelectedCurrency(currency.code)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCurrency === currency.code
                    ? 'bg-slate-800 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
              >
                {currency.code}
              </button>
            ))}
          </div>
        </div>

        {/* Investment Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 relative z-10">
          {profiles.map((profile) => {
            const Icon = PROFILE_ICONS[profile.profile] || Shield;
            const styles = PROFILE_STYLES[profile.profile] || PROFILE_STYLES.SILVER;

            return (
              <div
                key={profile.profile}
                className={`group relative bg-slate-900/40 backdrop-blur-xl border ${styles.border} rounded-3xl overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl ${styles.glow}`}
              >
                {/* Recommended Badge for GOLD */}
                {profile.profile === 'GOLD' && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-gradient-to-bl from-yellow-500 to-amber-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-lg">
                      POPULAR
                    </div>
                  </div>
                )}

                <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                <div className="p-6 relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl bg-slate-950/50 border border-slate-800 flex items-center justify-center ${styles.icon}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-950/50 px-2 py-1 rounded-lg border border-slate-800">
                      Level {profile.priority}
                    </span>
                  </div>

                  <h3 className={`text-2xl font-bold mb-2 ${styles.text}`}>{profile.profile}</h3>
                  <p className="text-sm text-slate-400 mb-6 min-h-[40px]">{profile.description}</p>

                  {/* Investment Range */}
                  <div className="mb-6 p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50">
                    <p className="text-xs text-slate-500 mb-1">Investment Range</p>
                    <p className="text-xl font-bold text-white">
                      {getCurrencySymbol()}{convertAmount(profile.minInvestment)}
                      <span className="text-slate-500 text-sm font-normal mx-1">-</span>
                      {profile.maxInvestment === '9999999999' ? '∞' : `${getCurrencySymbol()}${convertAmount(profile.maxInvestment)}`}
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-3 bg-slate-950/30 rounded-xl border border-slate-800/50">
                      <div className="flex items-center gap-1.5 mb-1">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[10px] text-slate-400 uppercase">Returns</span>
                      </div>
                      <p className="text-sm font-bold text-emerald-400">{profile.minReturnRate}% - {profile.maxReturnRate}%</p>
                    </div>
                    <div className="p-3 bg-slate-950/30 rounded-xl border border-slate-800/50">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-[10px] text-slate-400 uppercase">Lock-in</span>
                      </div>
                      <p className="text-sm font-bold text-blue-400">{profile.lockInMonths} Months</p>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {profile.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle className={`w-4 h-4 ${styles.text} flex-shrink-0 mt-0.5`} />
                        <span className="opacity-80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Select Button */}
                  <button
                    onClick={() => handleSelectPlan(profile)}
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 ${styles.button}`}
                  >
                    Get Started <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Section */}
        <div className="relative z-10 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 overflow-hidden border border-slate-700/50">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 mx-auto md:mx-0">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Bank-Grade Security</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Your assets are protected by state-of-the-art encryption and multi-layer security protocols.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 mx-auto md:mx-0">
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Instant Withdrawals</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Access your earnings anytime with our automated withdrawal system. No waiting periods.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 mx-auto md:mx-0">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Community Rewards</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Earn additional bonuses by building your network and helping others achieve financial freedom.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
