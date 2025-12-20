'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RulesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/info/rules');
  }, [router]);

  return null;
}
