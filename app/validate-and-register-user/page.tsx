'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { TrendingUp, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Logo */}
        <Logo size="lg" className="mb-6 sm:mb-8" />
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Enter Referral Code
          </h1>
          <p className="text-gray-600 mb-6">
            Please enter the referral code provided by your referrer to complete registration.
          </p>

          {/* Referral Code Input */}
          <div className="space-y-4">
            <div>
              <label htmlFor="referralCode" className="block text-sm font-medium text-gray-700 mb-2">
                Referral Code
              </label>
              <input
                id="referralCode"
                type="text"
                value={referralCode}
                onChange={(e) => {
                  setReferralCode(e.target.value.toUpperCase());
                  setValidationStatus({ valid: null, message: '' });
                  setError('');
                }}
                placeholder="Enter referral code (e.g., REF00001AA)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase font-mono"
                disabled={isValidating || isRegistering}
              />
            </div>

            {/* Validation Status */}
            {validationStatus.valid === true && (
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-green-800">{validationStatus.message}</p>
                  {validationStatus.referrerName && (
                    <p className="text-green-700 mt-1">
                      Referrer: {validationStatus.referrerName}
                    </p>
                  )}
                </div>
              </div>
            )}

            {validationStatus.valid === false && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-red-800">{validationStatus.message}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {!validationStatus.valid && (
                <button
                  onClick={handleValidateCode}
                  disabled={isValidating || !referralCode.trim()}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    'Validate Code'
                  )}
                </button>
              )}

              {validationStatus.valid && (
                <button
                  onClick={handleRegister}
                  disabled={isRegistering}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isRegistering ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    'Complete Registration'
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Need a referral code?</p>
                <p>Contact your referrer or reach out to support for assistance.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}