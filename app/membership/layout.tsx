import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Membership & Plans | Join WeVysya',
  description: 'Join the exclusive WeVysya network. Apply for membership, explore plans, and start growing with fellow Arya Vysya entrepreneurs.',
  alternates: { canonical: '/membership' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
