import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upcoming Events & Meetups | WeVysya',
  description: 'Browse upcoming WeVysya events, bi-weekly meets, and annual conferences for Arya Vysya entrepreneurs.',
  alternates: { canonical: '/events' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
