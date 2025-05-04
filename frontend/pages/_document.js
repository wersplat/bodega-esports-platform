import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="description" content="Bodega Esports Platform" />
        
        {/* DNS prefetch and preconnect */}
        <link rel="dns-prefetch" href="https://api.bodegacatsgc.gg" />
        <link rel="preconnect" href="https://api.bodegacatsgc.gg" crossOrigin="anonymous" />
        
        {/* Preload critical assets */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* Inline critical CSS */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Reset */
          *, *::before, *::after { box-sizing: border-box; }
          
          /* Base styles */
          body { 
            margin: 0;
            background: #0f172a;
            color: #f8fafc;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
          }
          
          /* Layout */
          .main-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1rem;
          }
          
          /* Typography */
          h1 {
            margin: 0 0 1.5rem;
            line-height: 1.2;
          }
          
          /* Skeleton loading animation */
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: .5; }
          }
          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
