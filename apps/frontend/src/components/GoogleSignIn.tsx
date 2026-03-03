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
          renderButton: (element: HTMLElement, config: any) => void;
          cancel: () => void;
        };
      };
    };
  }
}

export default function GoogleSignIn({ returnUrl, referralCode }: GoogleSignInProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [gsiReady, setGsiReady] = useState(false);
  const [useGsiButton, setUseGsiButton] = useState(false);
  const supabase = createClient();
  const t = useTranslations('auth');
  const router = useRouter();
  const initializedRef = useRef(false);
  const gsiButtonRef = useRef<HTMLDivElement>(null);

  const handleCredentialResponse = useCallback(async (response: any) => {
    try {
      setIsLoading(true);

      if (referralCode) {
        document.cookie = `pending-referral-code=${referralCode.trim().toUpperCase()}; path=/; max-age=600; SameSite=Lax`;
      }

      // Use signInWithIdToken - sends the Google ID token directly
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
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel();
      }
    };
  }, [handleCredentialResponse]);

  // Render the Google button when falling back to GSI button mode
  useEffect(() => {
    if (useGsiButton && gsiReady && gsiButtonRef.current && window.google?.accounts?.id) {
      window.google.accounts.id.renderButton(gsiButtonRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width: gsiButtonRef.current.offsetWidth,
      });
    }
  }, [useGsiButton, gsiReady]);

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
        // One Tap not available - show Google's own rendered button
        console.log('Google One Tap unavailable, showing Google button');
        setIsLoading(false);
        setUseGsiButton(true);
      } else if (notification.isDismissedMoment()) {
        console.log('Google One Tap dismissed:', notification.getDismissedReason());
        setIsLoading(false);
      }
    });
  };

  // If using GSI button fallback, show Google's own button
  if (useGsiButton) {
    return (
      <div className="w-full">
        <div
          ref={gsiButtonRef}
          className="w-full flex items-center justify-center"
          style={{ minHeight: '48px' }}
        />
        {isLoading && (
          <div className="flex items-center justify-center mt-2">
            <NexusLoader size="small" />
          </div>
        )}
      </div>
    );
  }

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
