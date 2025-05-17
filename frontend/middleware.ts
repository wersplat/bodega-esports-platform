import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// Define public paths that don't require authentication
const publicPaths = ['/auth/login', '/auth/register', '/auth/reset-password'];

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

  // Create a response object that we can modify
  const response = NextResponse.next();
  
  // Create a Supabase client
  const supabase = createMiddlewareClient({ req: request, res: response });
  
  // Get the current user's session
  const { data: { session } } = await supabase.auth.getSession();
  
  // Redirect to login if not authenticated and trying to access protected route
  if (!session && !publicPaths.some(path => pathname.startsWith(path))) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // Check admin access
  if (session) {
    const { data: userData } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .single();
      
    const isAdmin = userData?.is_admin || false;
    
    // Redirect to home if user tries to access admin route without admin privileges
    if (adminPaths.some(path => pathname.startsWith(path)) && !isAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
