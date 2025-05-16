import '../styles/globals.css'
import { AuthProvider } from '@/components/auth/auth-provider'
import { Sidebar } from '@/components/ui/sidebar'
import { useEffect } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { Drawer, DrawerTrigger, DrawerContent } from '@/components/ui/drawer'
import * as Sentry from '@sentry/nextjs'

// eslint-disable-next-line no-unused-vars
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
          <Drawer>
            <DrawerTrigger asChild>
              <button className="fixed top-4 left-4 z-50 p-2 rounded-md bg-[#1e293b] bg-opacity-80 text-[#f8fafc] shadow-lg focus:outline-none focus:ring-2 focus:ring-[#e11d48] md:hidden">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                <span className="sr-only">Open sidebar</span>
              </button>
            </DrawerTrigger>
            <DrawerContent className="!left-0 !top-0 !bottom-0 !h-full !w-64 !rounded-none !fixed !z-50 p-0">
              <Sidebar />
            </DrawerContent>
            <main className="flex-1 w-full">
              <Component {...pageProps} />
            </main>
          </Drawer>
        ) : (
          <>
            <Sidebar />
            <main className="flex-1">
              <Component {...pageProps} />
            </main>
          </>
        )}
      </div>
    </AuthProvider>
  )
}

// Named export for Fast Refresh
const AppWithSentry = Sentry.withProfiler(MyApp)

export default AppWithSentry