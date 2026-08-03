import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Downloads | WeVysya',
  description: 'Download audio, video, images, and documents from WeVysya.',
  alternates: { canonical: '/downloads' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
