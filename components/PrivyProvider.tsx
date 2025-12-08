'use client';

import { PrivyProvider as PrivyProviderBase } from '@privy-io/react-auth';

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  const appId = "cm58j5nmx00vr52bsakztgq2r";
  
  if (!appId) {
    console.warn('NEXT_PUBLIC_PRIVY_APP_ID is not set. Please add it to your .env.local file.');
  }

  return (
    <PrivyProviderBase
      appId={appId}
      config={{
        loginMethods: ['email', 'google'],
        appearance: {
          theme: 'light',
          accentColor: '#EE7C2B',
        },
      }}
    >
      {children}
    </PrivyProviderBase>
  );
}

