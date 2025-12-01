'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { TrendingUp, Loader2, CheckCircle, XCircle, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import {
  handleUserRegistrationFlow,
  validateReferralCode,
  registerUser,
} from '@/api/register-user-api';
import Logo from '@/components/Logo';

export default function ValidateAndRegisterUserPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [referralCode, setReferralCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [validationStatus, setValidationStatus] = useState<{
    valid: boolean | null;
    message: string;
    referrerName?: string;
  }>({ valid: null, message: '' });
  const [error, setError] = useState('');
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  // Check user registration status on mount
  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push('/login');
      return;
    }

    const checkUserStatus = async () => {
      try {
        const result = await handleUserRegistrationFlow(user.id);

        // If user is already registered and active/pending, redirect accordingly
        if (result.redirectTo !== '/validate-and-register-user') {
          router.push(result.redirectTo);
        } else {
          setIsCheckingStatus(false);
        }
      } catch (error) {
        console.error('Error checking user status:', error);
        setIsCheckingStatus(false);
      }
    };

    checkUserStatus();
  }, [isLoaded, user, router]);

  const handleValidateCode = async () => {
    if (!referralCode.trim()) {
      setError('Please enter a referral code');
      return;
    }

    setIsValidating(true);
    setError('');
    setValidationStatus({ valid: null, message: '' });

    try {
      const response = await validateReferralCode(referralCode.trim());

      if (response.success && response.data?.valid) {
        setValidationStatus({
          valid: true,
          message: 'Valid referral code!',
          referrerName: response.data.referrer.name,
        });
      } else {
        setValidationStatus({
          valid: false,
          message: response.message || 'Invalid referral code',
        });
      }
    } catch (error) {
      setError('Failed to validate referral code. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleRegister = async () => {
    if (!user || !validationStatus.valid) return;

    setIsRegistering(true);
    setError('');

    try {
      const response = await registerUser(user.id, referralCode.trim());

      if (response.success) {
        // Registration successful, redirect to queue
        router.push('/queue');
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setError('Failed to register. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  if (!isLoaded || isCheckingStatus) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center mb-6" />
        </div>

        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl dark:shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-200 dark:border-blue-500/20">
              <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Enter Referral Code
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Please enter the referral code provided by your referrer to complete registration.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="referralCode" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Referral Code
              </label>
              <div className="relative">
                <input
                  id="referralCode"
                  type="text"
                  value={referralCode}
                  onChange={(e) => {
                    setReferralCode(e.target.value.toUpperCase());
                    setValidationStatus({ valid: null, message: '' });
                    setError('');
                  }}
                  placeholder="Enter code (e.g., RE....)"
                  className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all uppercase font-mono text-lg tracking-wider placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  disabled={isValidating || isRegistering}
                />
              </div>
            </div>

            {/* Validation Status */}
            {validationStatus.valid === true && (
              <div className="flex items-start gap-3 p-4 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl animate-in fade-in slide-in-from-top-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-bold text-emerald-700 dark:text-emerald-400">{validationStatus.message}</p>
                  {validationStatus.referrerName && (
                    <p className="text-emerald-600/80 dark:text-emerald-200/80 mt-1">
                      Referrer: <span className="text-slate-900 dark:text-white font-medium">{validationStatus.referrerName}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {validationStatus.valid === false && (
              <div className="flex items-start gap-3 p-4 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl animate-in fade-in slide-in-from-top-2">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-bold text-red-700 dark:text-red-400">{validationStatus.message}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-bold text-red-700 dark:text-red-400">{error}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2">
              {!validationStatus.valid ? (
                <button
                  onClick={handleValidateCode}
                  disabled={isValidating || !referralCode.trim()}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    <>
                      Validate Code
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={isRegistering}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  {isRegistering ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      Complete Registration
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Need a referral code? <br />
              <span className="text-blue-600 dark:text-blue-400">Contact your referrer for assistance.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}