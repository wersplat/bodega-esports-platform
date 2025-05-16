import { AuthProvider } from '@/components/auth/auth-provider'
import { Sidebar } from '@/components/ui/sidebar'
import { useEffect } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { Drawer, DrawerTrigger, DrawerContent } from '@/components/ui/drawer'
import * as Sentry from '@sentry/nextjs'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    document.body.classList.add('dark')
    // Global error handler
    const handleError = (error) => {
      Sentry.captureException(error)
    }
    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  const isMobile = useIsMobile()

  return (


    <AuthProvider>
      <div className="flex min-h-screen">
        {isMobile ? (
@@ -45,6 +47,8 @@ export default function App({ Component, pageProps }) {
        )}
      </div>
    </AuthProvider>

  )
}

const SentryApp = Sentry.withProfiler(MyApp)
export default SentryApp