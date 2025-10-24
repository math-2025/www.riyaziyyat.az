import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAdminApp } from '@/lib/firebase/adminApp';

export async function middleware(request: NextRequest) {
  const sessionCookie = cookies().get('__session')?.value;

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const adminApp = getAdminApp();
    const decodedClaims = await adminApp.auth().verifySessionCookie(sessionCookie, true);
    
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decodedClaims.uid);
    requestHeaders.set('x-user-email', decodedClaims.email || '');

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('__session');
    return response;
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/exam/:path*', '/results/:path*'],
};
