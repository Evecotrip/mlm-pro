'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import { Clock, AlertCircle, TrendingUp, Loader2, CheckCircle2, ShieldCheck, RefreshCw, LogOut } from 'lucide-react';
import { getUserProfile, getTokenFromCookies, handleUserRegistrationFlow } from '@/api/register-user-api';
import Logo from '@/components/Logo';

export default function QueuePage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load user profile
  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push('/login');
      return;
    }

    loadUserProfile();
  }, [isLoaded, user, router]);

  const loadUserProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const token = getTokenFromCookies();
      if (!token) {
        // No token, check registration status
        const result = await handleUserRegistrationFlow(user.id);
        router.push(result.redirectTo);
        return;
      }

      const profileResponse = await getUserProfile(token);
      if (profileResponse.success && profileResponse.data) {
        const profile = profileResponse.data;
        setUserProfile(profile);

        // Check if user is now active
        if (profile.status === 'ACTIVE') {
          router.push('/dashboard');
        }
      } else {
        // Token might be invalid, check registration status
        const result = await handleUserRegistrationFlow(user.id);
        router.push(result.redirectTo);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadUserProfile();
    setIsRefreshing(false);
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
            <Loader2 className="w-16 h-16 text-blue-600 dark:text-blue-500 animate-spin relative z-10" />
          </div>
          <p className="text-slate-600 dark:text-slate-400 font-medium tracking-wide">Checking status...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo size="sm" />
          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Status
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12 items-center">

          {/* Status Card */}
          <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl dark:shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10 text-center">
              <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-yellow-200 dark:ring-yellow-500/30">
                <Clock className="w-10 h-10 text-yellow-600 dark:text-yellow-500 animate-pulse" />
              </div>

              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Approval Pending
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                Your account is currently under review by your referrer.
              </p>

              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-left mb-6">
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">Account Details</h2>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
                    <span className="text-slate-500 dark:text-slate-500">Name</span>
                    <span className="font-medium text-slate-900 dark:text-white">{userProfile.firstName} {userProfile.lastName}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
                    <span className="text-slate-500 dark:text-slate-500">Email</span>
                    <span className="font-medium text-slate-900 dark:text-white">{userProfile.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-500">Referral Code</span>
                    <code className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/10 px-2 py-1 rounded">{userProfile.referralCode}</code>
                  </div>
                </div>
              </div>

              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isRefreshing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Checking Status...
                  </>
                ) : (
                  'Check Approval Status'
                )}
              </button>
            </div>
          </div>

          {/* Timeline & Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
                Registration Progress
              </h3>

              <div className="space-y-0 relative">
                {/* Vertical Line */}
                <div className="absolute left-[19px] top-8 bottom-8 w-0.5 bg-slate-200 dark:bg-slate-800"></div>

                {/* Step 1 */}
                <div className="relative flex gap-4 pb-8">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 ring-4 ring-slate-50 dark:ring-slate-950 z-10">
                    <CheckCircle2 className="w-6 h-6 text-white dark:text-slate-950" />
                  </div>
                  <div className="pt-2">
                    <h4 className="font-bold text-slate-900 dark:text-white">Registration Complete</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Your account has been successfully created.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex gap-4 pb-8">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 ring-4 ring-slate-50 dark:ring-slate-950 z-10 animate-pulse">
                    <Clock className="w-6 h-6 text-white dark:text-slate-950" />
                  </div>
                  <div className="pt-2">
                    <h4 className="font-bold text-yellow-600 dark:text-yellow-500">Awaiting Approval</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Your referrer needs to verify and approve your account.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex gap-4">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0 ring-4 ring-slate-50 dark:ring-slate-950 z-10">
                    <span className="font-bold text-slate-500 dark:text-slate-500">3</span>
                  </div>
                  <div className="pt-2">
                    <h4 className="font-bold text-slate-400 dark:text-slate-600">Dashboard Access</h4>
                    <p className="text-sm text-slate-400 dark:text-slate-600 mt-1">Unlock full access to investments and features.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">What happens next?</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300/80 leading-relaxed">
                    Your referrer has been notified of your registration. Once they approve your request, you'll automatically gain access to the dashboard. You can refresh this page to check for updates.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
