import { useEffect } from 'react';
import Head from 'next/head';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        {/* Load CSS asynchronously to prevent render blocking */}
        <link 
          rel="preload" 
          href="/combined-theme.css" 
          as="style" 
          onLoad="this.onload=null;this.rel='stylesheet'"
        />
        <noscript>
          <link rel="stylesheet" href="/combined-theme.css" />
        </noscript>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
