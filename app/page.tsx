'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useApi } from '@/lib/api';

export default function Home() {
  const router = useRouter();
  const { ready, authenticated, login } = usePrivy();
  const { fetchWithAuth } = useApi();

  useEffect(() => {
    if (!ready) return;

    const checkAndRedirect = async () => {
      if (!authenticated) {
        login();
        return;
      }

      // Check if onboarding is completed
      try {
        const response = await fetchWithAuth('/api/onboarding');
        if (response.ok) {
          const data = await response.json();
          if (data.completed) {
            router.push('/home');
          } else {
            router.push('/onboarding');
          }
        } else {
          router.push('/onboarding');
        }
      } catch (error) {
        console.error('Error checking onboarding:', error);
        router.push('/onboarding');
      }
    };

    checkAndRedirect();
  }, [ready, authenticated, router, login, fetchWithAuth]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🛒</div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
