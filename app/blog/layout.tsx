import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resources & Stories | WeVysya',
  description: 'Insights, success stories, and business wisdom from the Arya Vysya entrepreneur community.',
  alternates: { canonical: '/blog' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
