'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, AlertCircle, TrendingUp } from 'lucide-react';

export default function QueuePage() {
  const router = useRouter();
  const { currentUser, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (currentUser?.isApproved) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, currentUser, router]);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            <span className="text-lg sm:text-2xl font-bold text-gray-900">MLM Investment</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-8 sm:py-20">
        <div className="max-w-2xl mx-auto">
          {/* Pending Approval Card */}
          <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-8 border border-gray-100 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Account Pending Approval
            </h1>

            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
              Your registration is complete! Your account is currently waiting for approval from your referrer.
            </p>

            {/* User Info */}
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 text-left">
              <h2 className="font-semibold text-gray-900 mb-4">Your Account Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium text-gray-900">{currentUser.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-900">{currentUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Your Referral Code:</span>
                  <span className="font-mono font-bold text-blue-600">{currentUser.referralCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    Pending Approval
                  </span>
                </div>
              </div>
            </div>

            {/* Info Alert */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3 text-left">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">What happens next?</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Your referrer will be notified of your registration</li>
                  <li>They will review and approve your account</li>
                  <li>Once approved, you'll gain full access to the dashboard</li>
                  <li>You can then make investments and build your network</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Refresh Status
              </button>
              
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-8 sm:mt-12 bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-6">Registration Timeline</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                </div>
                <div className="pb-8">
                  <h4 className="font-semibold text-gray-900">Registration Complete</h4>
                  <p className="text-sm text-gray-600">You've successfully created your account</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                </div>
                <div className="pb-8">
                  <h4 className="font-semibold text-gray-900">Waiting for Approval</h4>
                  <p className="text-sm text-gray-600">Your referrer is reviewing your application</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">3</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-400">Access Dashboard</h4>
                  <p className="text-sm text-gray-400">Start investing and building your network</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
