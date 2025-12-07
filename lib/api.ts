'use client';

import { usePrivy } from '@privy-io/react-auth';

export function useApi() {
  const { user, getAccessToken } = usePrivy();

  const getHeaders = async () => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (user) {
      try {
        // Get access token from Privy
        const token = await getAccessToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error getting access token:', error);
      }

      // Also send user info in headers for easier access
      const email = user.email?.address || '';
      const privyId = user.id || '';
      
      headers['x-privy-user-id'] = privyId;
      headers['x-privy-user-email'] = email;
    }

    return headers;
  };

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const headers = await getHeaders();
    return fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });
  };

  return { fetchWithAuth, user };
}

