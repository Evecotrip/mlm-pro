'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PrivacyPolicyPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/info/privacy-policy');
  }, [router]);

  return null;
}
