"use client";

import { usePathname } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

export function ConditionalChrome() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin') || pathname === '/launch') return null;
  return <Navigation />;
}

export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin') || pathname === '/launch') return null;
  return <Footer />;
}
