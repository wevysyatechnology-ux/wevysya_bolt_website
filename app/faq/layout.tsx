import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | WeVysya',
  description: 'Got questions about WeVysya? Find answers about membership, meetings, events, and the Arya Vysya Entrepreneurs Network.',
  alternates: { canonical: '/faq' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
