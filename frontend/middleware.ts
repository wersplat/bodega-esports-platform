import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// Define public paths that don't require authentication
const publicPaths = [
  '/auth/login',
  '/auth/register',
  '/auth/reset-password',
  '/sentry-example-page',      // <— allow the Sentry demo page
];

// Define admin paths that require admin privileges
const adminPaths = ['/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes and static files
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Quick pass for any of the publicPaths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Create a response object that we can modify
  const response = NextResponse.next();

  // Create a Supabase client bound to this request/response
  const supabase = createMiddlewareClient({ req: request, res: response });

  // Get the current user's session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect to login if not authenticated and on a protected route
  if (!session) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If this is an admin-only path, check the is_admin flag
  if (adminPaths.some(path => pathname.startsWith(path))) {
    const { data: userData } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .single();

    const isAdmin = userData?.is_admin || false;
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - any image/font asset
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
