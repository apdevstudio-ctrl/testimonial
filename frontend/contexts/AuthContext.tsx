'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      // Validate token by fetching user profile
      fetchUserProfile(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async (authToken: string) => {
    try {
      const apiUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/auth` : '/api/auth';
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
          try {
            const userData = JSON.parse(responseText);
            setUser(userData);
          } catch (parseError) {
            console.error('Failed to parse user data:', parseError);
          }
        }
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const apiUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/auth?action=login` : '/api/auth?action=login';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const responseText = await response.text();
      let data;
      
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        throw new Error(data.message || `Login failed: ${response.status} ${response.statusText}`);
      }

      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem('auth_token', data.access_token);
      router.push('/dashboard');
    } catch (error: any) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const apiUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/auth?action=register` : '/api/auth?action=register';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const responseText = await response.text();
      let data;
      
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        throw new Error(data.message || `Registration failed: ${response.status} ${response.statusText}`);
      }

      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem('auth_token', data.access_token);
      router.push('/dashboard');
    } catch (error: any) {
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    if (typeof window === 'undefined') {
      throw new Error('Google login is only available in the browser');
    }

    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      throw new Error('Google OAuth is not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID');
    }

    // Load Google Identity Services script
    return new Promise<void>((resolve, reject) => {
      // Check if script is already loaded
      if ((window as any).google?.accounts) {
        initializeGoogleSignIn(googleClientId, resolve, reject);
      } else {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          initializeGoogleSignIn(googleClientId, resolve, reject);
        };
        script.onerror = () => {
          reject(new Error('Failed to load Google Sign-In script'));
        };
        document.head.appendChild(script);
      }
    });
  };

  const initializeGoogleSignIn = (
    clientId: string,
    resolve: () => void,
    reject: (error: Error) => void
  ) => {
    try {
      const google = (window as any).google;
      if (!google?.accounts?.id) {
        reject(new Error('Google Sign-In not available'));
        return;
      }

      // Initialize Google Sign-In
      google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: { credential: string }) => {
          try {
            // Send credential to backend
            const apiUrl = `${window.location.origin}/api/auth/google`;
            const authResponse = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ idToken: response.credential }),
            });

            const responseText = await authResponse.text();
            let data;
            
            try {
              data = responseText ? JSON.parse(responseText) : {};
            } catch (parseError) {
              throw new Error('Invalid response from server');
            }

            if (!authResponse.ok) {
              throw new Error(data.message || 'Google authentication failed');
            }

            setToken(data.access_token);
            setUser(data.user);
            localStorage.setItem('auth_token', data.access_token);
            router.push('/dashboard');
            resolve();
          } catch (error: any) {
            reject(error);
          }
        },
      });

      // Trigger Google Sign-In popup
      google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // If prompt doesn't work, use button click flow
          const button = document.createElement('div');
          button.id = 'google-signin-button';
          document.body.appendChild(button);
          
          google.accounts.id.renderButton(button, {
            theme: 'outline',
            size: 'large',
            width: 300,
            text: 'signin_with',
          });

          // Auto-click the button
          setTimeout(() => {
            const btn = document.getElementById('google-signin-button');
            if (btn) {
              const clickable = btn.querySelector('div[role="button"]') as HTMLElement;
              if (clickable) {
                clickable.click();
              }
            }
          }, 100);
        }
      });
    } catch (error: any) {
      reject(new Error(error.message || 'Failed to initialize Google Sign-In'));
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
    router.push('/landing');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        loginWithGoogle,
        logout,
        isLoading,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
