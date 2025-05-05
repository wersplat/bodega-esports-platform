import '../styles/globals.css'
// import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/components/auth/auth-provider'
import { Sidebar } from '@/components/ui/sidebar'
import { useEffect } from 'react'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    document.body.classList.add('dark')
  }, [])

  return (
    // Uncomment if you add a ThemeProvider in the future
    // <ThemeProvider>
      <AuthProvider>
        <div className="flex">
          <Sidebar />
          <main className="flex-1">
            <Component {...pageProps} />
          </main>
        </div>
      </AuthProvider>
    // </ThemeProvider>
  )
}
