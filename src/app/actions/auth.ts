'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAdminApp } from '@/lib/firebase/adminApp';

export async function createSession(idToken: string) {
  try {
    const adminApp = getAdminApp();
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminApp.auth().createSessionCookie(idToken, { expiresIn });

    cookies().set('__session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error creating session:', error);
    return { success: false, error: 'Failed to create session.' };
  }
}

export async function clearSession() {
  cookies().delete('__session');
  redirect('/login');
}
