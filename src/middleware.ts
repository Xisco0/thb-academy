import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { user, supabaseResponse, supabase } = await updateSession(request);

  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Protect /admin routes
  if (path.startsWith('/admin')) {
    if (!user) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    
    // Check user type for admin routes
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', user.id)
      .single();

    if (profile?.user_type !== 'admin') {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  // Protect /student routes
  if (path.startsWith('/student')) {
    if (!user) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    
    // Check user type for student routes
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', user.id)
      .single();

    if (profile?.user_type !== 'student' && profile?.user_type !== 'admin') {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  // Redirect logged-in users away from /login and /register
  if (path === '/login' || path === '/register') {
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single();
        
      if (profile?.user_type === 'admin') {
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      } else if (profile?.user_type === 'student') {
        url.pathname = '/student';
        return NextResponse.redirect(url);
      } else {
        url.pathname = '/';
        return NextResponse.redirect(url);
      }
    }
  }

  // Handle URL redirects for SEO
  if (path.startsWith('/programs/') || path.startsWith('/events/')) {
    const { data: redirect } = await supabase
      .from('url_redirects')
      .select('new_url')
      .eq('old_url', path)
      .single();
      
    if (redirect) {
      url.pathname = redirect.new_url;
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, public folder contents
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
