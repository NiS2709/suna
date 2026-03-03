'use client';

import { useEffect } from 'react';

/**
 * This page handles the popup callback from Google OAuth when using
 * the implicit flow (response_type=id_token). It extracts the id_token
 * from the URL hash fragment and sends it back to the parent window
 * via postMessage.
 */
export default function GoogleIdTokenCallback() {
  useEffect(() => {
    // The id_token is in the URL hash fragment (after #)
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const idToken = params.get('id_token');

    if (idToken && window.opener) {
      // Send the token back to the parent window
      window.opener.postMessage(
        { type: 'google-id-token', token: idToken },
        window.location.origin
      );
      // Close the popup
      window.close();
    } else if (!window.opener) {
      // If opened directly (not as popup), redirect to auth page
      window.location.href = '/auth';
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground">Completing sign-in...</p>
    </div>
  );
}
