import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

const publicPaths = [
  '/',
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

  try {
    // Try to get token from cookies (server) or fallback to localStorage (client)
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/auth/login'
      loginUrl.searchParams.set('redirectedFrom', pathname)
      return NextResponse.redirect(loginUrl)
    }
    // Check user/admin status via auth-service
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/auth-service/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/auth/login'
      loginUrl.searchParams.set('redirectedFrom', pathname)
      return NextResponse.redirect(loginUrl)
    }
    const user = await res.json();
    if (adminPaths.some(p => pathname.startsWith(p))) {
      if (!user.is_admin) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
    return NextResponse.next()
  } catch (err) {
    console.error('🛑 Middleware caught error:', err)
    return NextResponse.next()
  }
}
