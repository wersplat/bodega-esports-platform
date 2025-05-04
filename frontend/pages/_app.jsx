import '../styles/globals.css'
// import { ThemeProvider } from '@/components/theme-provider'
// import { AuthProvider } from '@/components/auth-provider'

export default function App({ Component, pageProps }) {
  return (
    // Uncomment if you add a ThemeProvider or AuthProvider in the future
    // <ThemeProvider>
    //   <AuthProvider>
        <Component {...pageProps} />
    //   </AuthProvider>
    // </ThemeProvider>
  )
}
