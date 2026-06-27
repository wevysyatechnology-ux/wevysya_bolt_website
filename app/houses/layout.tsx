import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WeVysya Business Houses Explained',
  description: 'Understand how WeVysya Business Houses work and how they help Arya Vysya entrepreneurs collaborate and grow.',
  alternates: { canonical: '/houses' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
