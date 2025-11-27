'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { SignIn } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { handleUserRegistrationFlow } from '@/api/register-user-api';
import Logo from '@/components/Logo';

export default function LoginPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  // Check user registration status after login
  useEffect(() => {
    if (!isLoaded || isCheckingStatus) return;

    if (user) {
      setIsCheckingStatus(true);
      handleUserRegistrationFlow(user.id)
        .then((result) => {
          router.push(result.redirectTo);
        })
        .catch((error) => {
          console.error('Error checking user status:', error);
          router.push('/validate-and-register-user');
        });
    }
  }, [isLoaded, user, router]);

  if (isCheckingStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Checking your account status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Logo 
          size="lg" 
          subtitle="Sign in to your account"
          className="mb-6 sm:mb-8"
        />

        {/* Clerk Sign In Component */}
        <div className="flex justify-center">
          <SignIn 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-xl border border-gray-100"
              }
            }}
            routing="hash"
            signUpUrl="/signup"
            forceRedirectUrl="/login"
            fallbackRedirectUrl="/login"
          />
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
