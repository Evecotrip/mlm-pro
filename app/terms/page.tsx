'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TermsOfServicePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/info/terms');
  }, [router]);

  return null;
}
