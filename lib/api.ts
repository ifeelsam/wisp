'use client';

import { usePrivy } from '@privy-io/react-auth';

export function useApi() {
  const { user, getAccessToken, authenticated, ready } = usePrivy();

  const getHeaders = async () => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (!user || !authenticated) {
      throw new Error('User not authenticated');
    }

    try {
      // Get access token from Privy
      const token = await getAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting access token:', error);
    }

    // Send user info in headers for easier access
    const email = user.email?.address || '';
    const privyId = user.id || '';
    
    if (!privyId || !email) {
      throw new Error('User email or ID not available');
    }
    
    headers['x-privy-user-id'] = privyId;
    headers['x-privy-user-email'] = email;

    return headers;
  };

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    if (!ready || !authenticated || !user) {
      throw new Error('Not authenticated');
    }

    const headers = await getHeaders();
    return fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });
  };

  return { fetchWithAuth, user, ready, authenticated };
}

