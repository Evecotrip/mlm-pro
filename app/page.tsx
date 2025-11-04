'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, Shield, Users, ArrowRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, currentUser } = useAuth();

  useEffect(() => {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">MLM Investment</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => router.push('/signup')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Grow Your Wealth with
            <span className="text-blue-600"> Smart Investments</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Join our multi-level investment platform and earn returns based on your risk profile.
            Build your network and grow together.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/signup')}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => router.push('/login')}
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg"
            >
              Login to Dashboard
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Multiple Risk Profiles</h3>
            <p className="text-gray-600">
              Choose from Low (5%), Moderate (20%), or High Risk (100%) investment options based on your comfort level.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Flexible Lock-in Periods</h3>
            <p className="text-gray-600">
              Earn additional bonuses with lock-in periods from 1 to 12 months. Longer periods = higher returns.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Referral Network</h3>
            <p className="text-gray-600">
              Build your downline network, view your team's performance, and grow together with complete transparency.
            </p>
          </div>
        </div>

        {/* Investment Tiers */}
        <div className="mt-20 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Investment Tiers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-200">
              <h3 className="text-2xl font-bold text-green-900 mb-2">Low Risk</h3>
              <p className="text-4xl font-bold text-green-600 mb-4">5%</p>
              <p className="text-green-800 mb-4">Minimum: ₹500</p>
              <p className="text-sm text-green-700">Safe and steady returns for conservative investors</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200">
              <h3 className="text-2xl font-bold text-blue-900 mb-2">Moderate Risk</h3>
              <p className="text-4xl font-bold text-blue-600 mb-4">20%</p>
              <p className="text-blue-800 mb-4">Minimum: ₹5,000</p>
              <p className="text-sm text-blue-700">Balanced approach for moderate investors</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200">
              <h3 className="text-2xl font-bold text-purple-900 mb-2">High Risk</h3>
              <p className="text-4xl font-bold text-purple-600 mb-4">100%</p>
              <p className="text-purple-800 mb-4">Minimum: ₹10,000</p>
              <p className="text-sm text-purple-700">Maximum returns for aggressive investors</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>© 2024 MLM Investment Platform. All rights reserved.</p>
          <p className="text-sm mt-2">Investment involves risk. Please read all terms and conditions carefully.</p>
        </div>
      </footer>
    </div>
  );
}
