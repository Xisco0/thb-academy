import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  try {
    // 1. Refresh session and get Supabase client safely
    const { user, supabaseResponse, supabase } = await updateSession(request);

    // If updateSession fails to initialize Supabase, fallback to normal response
    if (!supabase) {
      return NextResponse.next();
    }

    const url = request.nextUrl.clone();
    const path = url.pathname;

    // Helper function to safely fetch profile without throwing on missing records
    const getUserProfile = async (userId: string) => {
      const { data } = await supabase
        .from('profiles')
        .select('user_type, is_active')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle() instead of single() to avoid throwing errors
      return data;
    };

    // Protect /admin routes
    if (path.startsWith('/admin')) {
      if (!user) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
      }
      
      const profile = await getUserProfile(user.id);
      if (!profile || profile.user_type !== 'admin' || profile.is_active === false) {
        url.pathname = '/login';
        url.searchParams.set('error', 'suspended');
        return NextResponse.redirect(url);
      }
    }

    // Protect /student routes
    if (path.startsWith('/student')) {
      if (!user) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
      }
      
      const profile = await getUserProfile(user.id);
      if (!profile || (profile.user_type !== 'student' && profile.user_type !== 'admin')) {
        url.pathname = '/';
        return NextResponse.redirect(url);
      }
    }

    // Redirect logged-in users away from /login ONLY (never hijack public registration or enrollment)
    if (path === '/login') {
      if (user) {
        const profile = await getUserProfile(user.id);
          
        if (profile?.user_type === 'admin' && profile?.is_active !== false) {
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
        .maybeSingle();
        
      if (redirect?.new_url) {
        url.pathname = redirect.new_url;
        return NextResponse.redirect(url);
      }
    }

    return supabaseResponse;
  } catch (error) {
    console.error('Middleware execution error:', error);
    // Return standard response instead of crashing the site with a 500 error
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};