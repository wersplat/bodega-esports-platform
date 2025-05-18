// This file is kept for backward compatibility with pages directory
// All the logic has been moved to the app directory structure
// See app/layout.tsx for the main layout implementation

import type { AppProps } from 'next/app';
import Head from 'next/head';
import { AuthProvider } from '@/components/auth/auth-provider';

// This is a minimal wrapper for pages that haven't been migrated to the App Router yet
// All new pages should be created in the app directory
function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default CustomApp;
