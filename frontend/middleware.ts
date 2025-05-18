import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

// If you get “Not implemented: request.cookies” you can switch to nodejs:
// export const runtime = 'nodejs'

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

const publicPaths = [
  '/',                        // your “front face”
  '/auth/login',
  '/auth/register',
  '/auth/reset-password',
  '/sentry-example-page',
]
const adminPaths = ['/admin']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // always skip _next, images, static files, api routes
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // if it’s a public path, just let it through
  if (publicPaths.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next()
  }

  // wrap in try/catch so any supabase error ≠ crash your site
  try {
    const response = NextResponse.next()

    // pass cookies so getSession() actually works
    const supabase = createMiddlewareClient({
      req: request,
      res: response,
      cookies: request.cookies,
    })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/auth/login'
      loginUrl.searchParams.set('redirectedFrom', pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (adminPaths.some(p => pathname.startsWith(p))) {
      const { data: userData } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single()

      if (!userData?.is_admin) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    return response
  } catch (err) {
    console.error('🛑 Middleware caught error:', err)
    // fail open so your frontend still loads
    return NextResponse.next()
  }
}
