'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CookiePolicyPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/info/cookies');
  }, [router]);

  return null;
}
