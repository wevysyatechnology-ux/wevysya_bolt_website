import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Attend a WeVysya Meet as a Visitor',
  description: 'Register to attend a WeVysya meeting as a visitor and experience the Arya Vysya Entrepreneurs Network firsthand.',
  alternates: { canonical: '/visitor-registration' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
