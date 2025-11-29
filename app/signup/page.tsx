'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { SignUp } from '@clerk/nextjs';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { handleUserRegistrationFlow } from '@/api/register-user-api';
import Logo from '@/components/Logo';
import { dark } from '@clerk/themes';

export default function SignupPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  // Check user registration status after signup
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin relative z-10" />
          </div>
          <p className="text-slate-400 font-medium tracking-wide">Setting up your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[100px] animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo size="lg" subtitle="Join the future of investing" />
          </div>

          {/* Clerk Sign Up Component */}
          <div className="flex justify-center">
            <SignUp
              appearance={{
                baseTheme: dark,
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent shadow-none p-0 w-full",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  formButtonPrimary: "bg-blue-600 hover:bg-blue-500 text-white",
                  formFieldInput: "bg-slate-950 border-slate-800 text-white",
                  formFieldLabel: "text-slate-400",
                  footerActionLink: "text-blue-400 hover:text-blue-300"
                }
              }}
              routing="hash"
              signInUrl="/login"
              forceRedirectUrl="/signup"
              fallbackRedirectUrl="/signup"
            />
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center border-t border-slate-800 pt-6">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
