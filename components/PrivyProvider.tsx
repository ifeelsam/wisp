'use client';

import { PrivyProvider as PrivyProviderBase } from '@privy-io/react-auth';

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  const appId = "cmivh9plb00dnju0ch5srps0e";
  
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

