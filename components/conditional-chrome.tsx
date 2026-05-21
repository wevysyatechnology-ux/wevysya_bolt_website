"use client";

import { usePathname } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

export function ConditionalChrome() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  if (isAdmin) return null;
  return (
    <>
      <Navigation />
    </>
  );
}

export function ConditionalFooter() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  if (isAdmin) return null;
  return <Footer />;
}
