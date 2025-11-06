'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, Shield, Users, ArrowRight, Sparkles, Zap, Target } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, currentUser } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    if (isAuthenticated && currentUser) {
      // Redirect based on approval status
      if (currentUser.isApproved) {
        router.push('/dashboard');
      } else {
        router.push('/queue');
      }
    }
  }, [isAuthenticated, currentUser, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>
      {/* Header */}
      <header className="border-b border-white/20 bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="relative">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">AuramX</span>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => router.push('/login')}
              className="px-3 sm:px-6 py-2 text-blue-600 hover:text-blue-700 font-medium transition-all duration-300 hover:scale-105 text-sm sm:text-base"
            >
              Login
            </button>
            <button
              onClick={() => router.push('/signup')}
              className="px-3 sm:px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-105"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-3 sm:px-4 py-10 sm:py-20 relative z-10">
        <div className={`max-w-4xl mx-auto text-center mb-10 sm:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6 animate-bounce">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-700">Trusted by 10,000+ Investors</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Grow Your Wealth with
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient"> Smart Investments</span>
          </h1>
          <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join our multi-level investment platform and earn returns based on your risk profile.
            Build your network and grow together.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => router.push('/signup')}
              className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl hover:shadow-2xl transition-all duration-300 font-semibold text-base sm:text-lg flex items-center justify-center gap-2 hover:scale-105 relative overflow-hidden"
            >
              <span className="relative z-10">Get Started</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            <button
              onClick={() => router.push('/login')}
              className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition-all duration-300 font-semibold text-base sm:text-lg hover:scale-105 hover:shadow-lg"
            >
              Login to Dashboard
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 max-w-5xl mx-auto">
          <div className={`group bg-white/80 backdrop-blur-sm p-5 sm:p-8 rounded-2xl shadow-lg border border-gray-200 hover:border-blue-400 transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: '200ms'}}>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Multiple Risk Profiles</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Choose from Low (5%), Moderate (20%), or High Risk (100%) investment options based on your comfort level.
            </p>
          </div>

          <div className={`group bg-white/80 backdrop-blur-sm p-5 sm:p-8 rounded-2xl shadow-lg border border-gray-200 hover:border-purple-400 transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: '400ms'}}>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">Flexible Lock-in Periods</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Earn additional bonuses with lock-in periods from 1 to 12 months. Longer periods = higher returns.
            </p>
          </div>

          <div className={`group bg-white/80 backdrop-blur-sm p-5 sm:p-8 rounded-2xl shadow-lg border border-gray-200 hover:border-green-400 transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: '600ms'}}>
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">Referral Network</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Build your downline network, view your team's performance, and grow together with complete transparency.
            </p>
          </div>
        </div>

        {/* Investment Tiers */}
        <div className="mt-12 sm:mt-20 max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Investment Tiers</h2>
            <p className="text-gray-600">Choose the plan that matches your investment goals</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="group relative bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-2xl border-2 border-green-200 hover:border-green-400 transition-all duration-500 hover:shadow-2xl hover:scale-105 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-400/20 rounded-full blur-2xl group-hover:w-40 group-hover:h-40 transition-all duration-500" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <h3 className="text-xl sm:text-2xl font-bold text-green-900">Low Risk</h3>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-green-600 mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">5%</p>
                <p className="text-green-800 mb-4 font-semibold">Minimum: ₹500</p>
                <p className="text-sm text-green-700">Safe and steady returns for conservative investors</p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-2xl border-2 border-blue-200 hover:border-blue-400 transition-all duration-500 hover:shadow-2xl hover:scale-105 overflow-hidden md:scale-105">
              <div className="absolute -top-2 -right-2 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg z-20">
                POPULAR
              </div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/20 rounded-full blur-2xl group-hover:w-40 group-hover:h-40 transition-all duration-500" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <h3 className="text-xl sm:text-2xl font-bold text-blue-900">Moderate Risk</h3>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-blue-600 mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">20%</p>
                <p className="text-blue-800 mb-4 font-semibold">Minimum: ₹5,000</p>
                <p className="text-sm text-blue-700">Balanced approach for moderate investors</p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-6 rounded-2xl border-2 border-purple-200 hover:border-purple-400 transition-all duration-500 hover:shadow-2xl hover:scale-105 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/20 rounded-full blur-2xl group-hover:w-40 group-hover:h-40 transition-all duration-500" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <h3 className="text-xl sm:text-2xl font-bold text-purple-900">High Risk</h3>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-purple-600 mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">100%</p>
                <p className="text-purple-800 mb-4 font-semibold">Minimum: ₹10,000</p>
                <p className="text-sm text-purple-700">Maximum returns for aggressive investors</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600 relative z-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-gray-900">AuramX</span>
          </div>
          <p className="mb-1">© 2024 AuramX Platform. All rights reserved.</p>
          <p className="text-sm mt-2 text-gray-500">Investment involves risk. Please read all terms and conditions carefully.</p>
        </div>
      </footer>
    </div>
  );
}
