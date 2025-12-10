'use client';

import { usePrivy } from '@privy-io/react-auth';

export function useApi() {
  const { user, getAccessToken, authenticated, ready } = usePrivy();

  const getHeaders = async (isFormData = false) => {
    const headers: HeadersInit = {};

    if (!user || !authenticated) {
      throw new Error('User not authenticated');
    }

    // Don't set Content-Type for FormData - browser will set it with boundary
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
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
    const privyId = user.id || '';
    
    // Extract email - Privy user.email can be an object with address property
    let email = '';
    if (typeof user.email === 'string') {
      email = user.email;
    } else if (user.email?.address) {
      email = user.email.address;
    }
    
    // If no email from primary email field, try linked accounts
    if (!email) {
      console.warn('Email not available from user.email. Checking linked accounts...');
      const linkedAccounts = (user as any).linkedAccounts || [];
      const googleAccount = linkedAccounts.find((acc: any) => acc.type === 'google' || acc.type === 'google_oauth');
      email = googleAccount?.email || googleAccount?.emailAddress || '';
      
      if (email) {
        console.log('Using email from Google account:', email);
      }
    }
    
    console.log('Extracted user info:', { 
      privyId, 
      email,
      hasEmail: !!email,
      userEmailType: typeof user.email,
      userEmailValue: user.email
    });
    
    if (!privyId) {
      throw new Error('User ID not available from Privy');
    }
    
    if (!email) {
      console.error('User object structure:', JSON.stringify(user, null, 2));
      throw new Error('User email not available from Privy. Please ensure your account has an email address linked.');
    }
    
    headers['x-privy-user-id'] = privyId;
    headers['x-privy-user-email'] = email;

    return headers;
  };

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    if (!ready || !authenticated || !user) {
      throw new Error('Not authenticated');
    }

    const isFormData = options.body instanceof FormData;
    const headers = await getHeaders(isFormData);
    
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

