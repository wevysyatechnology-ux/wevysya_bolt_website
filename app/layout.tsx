import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { ConditionalChrome, ConditionalFooter } from '@/components/conditional-chrome';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://wevysya.org'),
  title: 'WeVysya - Arya Vysya Entrepreneurs Grid',
  description: 'A global networking community for Arya Vysya business owners and entrepreneurs. United we stand, divided we fall.',
  keywords: 'WeVysya, Arya Vysya, Entrepreneurs, Business Network, Networking, India',
  openGraph: {
    title: 'WeVysya - Arya Vysya Entrepreneurs Grid',
    description: 'A global networking community for Arya Vysya business owners and entrepreneurs.',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WeVysya - Arya Vysya Entrepreneurs Grid',
    description: 'A global networking community for Arya Vysya business owners and entrepreneurs.',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ConditionalChrome />
          <main className="min-h-screen">{children}</main>
          <ConditionalFooter />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
