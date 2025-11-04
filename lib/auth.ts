'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/login') {
      return;
    }

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('bpl_logged_in');
    
    if (isLoggedIn !== 'true') {
      router.push('/login');
    }
  }, [router, pathname]);
}

export function logout() {
  localStorage.removeItem('bpl_logged_in');
  localStorage.removeItem('bpl_username');
  window.location.href = '/login';
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('bpl_logged_in') === 'true';
}

export function getUsername(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('bpl_username');
}
