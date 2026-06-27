import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About WeVysya | The Arya Vysya Entrepreneurs Network',
  description: 'Learn who we are, why WeVysya was founded, and how we unite Arya Vysya business owners globally.',
  alternates: { canonical: '/about' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
