import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact WeVysya | Bengaluru',
  description: 'Get in touch with WeVysya. Reach us at our Basavanagudi, Bengaluru office or drop us an email.',
  alternates: { canonical: '/contact' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
