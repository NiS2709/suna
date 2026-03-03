'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from '@/lib/toast';
import { Icons } from './home/icons';
import { NexusLoader } from '@/components/ui/nexus-loader';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

interface GoogleSignInProps {
  returnUrl?: string;
  referralCode?: string;
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          cancel: () => void;
        };
      };
    };
    handleGoogleCredential?: (response: any) => void;
  }
}

export default function GoogleSignIn({ returnUrl, referralCode }: GoogleSignInProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [gsiReady, setGsiReady] = useState(false);
  const supabase = createClient();
  const t = useTranslations('auth');
  const router = useRouter();
  const initializedRef = useRef(false);

  const handleCredentialResponse = useCallback(async (response: any) => {
    try {
      setIsLoading(true);

      if (referralCode) {
        document.cookie = `pending-referral-code=${referralCode.trim().toUpperCase()}; path=/; max-age=600; SameSite=Lax`;
      }

      // Use signInWithIdToken - this sends the Google ID token directly
      // to Supabase's auth API (through the proxy), no OAuth redirect needed
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
      });

      if (error) {
        throw error;
      }

      // Successfully signed in - redirect
      const destination = returnUrl || '/dashboard';
      router.push(destination);
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      toast.error(error.message || 'Failed to sign in with Google');
      setIsLoading(false);
    }
  }, [supabase, referralCode, returnUrl, router]);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || initializedRef.current) return;

    // Set up the global callback for Google's script
    window.handleGoogleCredential = handleCredentialResponse;

    const initializeGsi = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: true,
        });
        setGsiReady(true);
        initializedRef.current = true;
      }
    };

    // Check if already loaded
    if (window.google?.accounts?.id) {
      initializeGsi();
      return;
    }

    // Load the Google Identity Services script
    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      existingScript.addEventListener('load', initializeGsi);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGsi;
    script.onerror = () => {
      console.error('Failed to load Google Identity Services');
    };
    document.head.appendChild(script);

    return () => {
      window.handleGoogleCredential = undefined;
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel();
      }
    };
  }, [handleCredentialResponse]);

  const handleGoogleSignIn = async () => {
    if (!GOOGLE_CLIENT_ID) {
      // Fallback to the old OAuth redirect method if no client ID is configured
      try {
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback${
              returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''
            }`,
          },
        });
        if (error) throw error;
      } catch (error: any) {
        console.error('Google sign-in error:', error);
        toast.error(error.message || 'Failed to sign in with Google');
        setIsLoading(false);
      }
      return;
    }

    if (!gsiReady || !window.google?.accounts?.id) {
      toast.error('Google sign-in is still loading, please try again in a moment');
      return;
    }

    setIsLoading(true);

    // Trigger Google One Tap prompt
    window.google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // One Tap not available - fall back to popup
        const reason = notification.isNotDisplayed()
          ? notification.getNotDisplayedReason()
          : notification.getSkippedReason();
        console.log('Google One Tap unavailable:', reason);

        // Open Google sign-in in a popup window
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const nonce = Math.random().toString(36).substring(2);
        const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID!);
        authUrl.searchParams.set('redirect_uri', `${window.location.origin}/auth/google-id-token-callback`);
        authUrl.searchParams.set('response_type', 'id_token');
        authUrl.searchParams.set('scope', 'openid email profile');
        authUrl.searchParams.set('nonce', nonce);
        authUrl.searchParams.set('prompt', 'select_account');

        const popup = window.open(
          authUrl.toString(),
          'google-signin',
          `width=${width},height=${height},left=${left},top=${top},popup=true`
        );

        // Listen for message from popup
        const handleMessage = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;
          if (event.data?.type === 'google-id-token') {
            window.removeEventListener('message', handleMessage);
            handleCredentialResponse({ credential: event.data.token });
          }
        };
        window.addEventListener('message', handleMessage);

        // Monitor popup close
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', handleMessage);
            setIsLoading(false);
          }
        }, 500);
      } else if (notification.isDismissedMoment()) {
        console.log('Google One Tap dismissed:', notification.getDismissedReason());
        setIsLoading(false);
      }
    });
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      variant="outline"
      size="lg"
      className="w-full h-12"
      type="button"
    >
      {isLoading ? (
        <NexusLoader size="small" />
      ) : (
        <Icons.google className="w-4 h-4" />
      )}
      <span>
        {isLoading ? t('signingIn') : t('continueWithGoogle')}
      </span>
    </Button>
  );
}
