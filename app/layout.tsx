import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { ConditionalChrome, ConditionalFooter } from '@/components/conditional-chrome';
import { Toaster } from '@/components/ui/toaster';
import { VideoPlayProvider } from '@/components/video-play-context';
import { ConsentBanner } from '@/components/consent-banner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://wevysya.com'),
  title: 'WeVysya | Private Network for Arya Vysya Entrepreneurs',
  description: 'A private community for Arya Vysya business owners and entrepreneurs to swap hard-won lessons, open doors for each other, and grow together. Stop thinking I, start thinking WE.',
  robots: {
    index: true,
    follow: true,
    googleBot: { 'max-image-preview': 'large' },
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/wevysya-logo.png',
  },
  openGraph: {
    type: 'website',
    url: 'https://wevysya.com/',
    siteName: 'WeVysya',
    locale: 'en_IN',
    title: 'WeVysya | Private Network for Arya Vysya Entrepreneurs',
    description: 'A private community for Arya Vysya business owners and entrepreneurs to swap hard-won lessons, open doors, and grow together.',
    images: [
      {
        url: '/wevysya_social.webp',
        width: 1200,
        height: 630,
        alt: 'WeVysya | Private Network for Arya Vysya Entrepreneurs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WeVysya | Private Network for Arya Vysya Entrepreneurs',
    description: 'A private community for Arya Vysya business owners and entrepreneurs to swap hard-won lessons, open doors, and grow together.',
    images: ['/wevysya_social.webp'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'WeVysya',
  url: 'https://wevysya.com/',
  logo: 'https://wevysya.com/wevysya-logo.png',
  email: 'reachus@wevysya.com',
  telephone: '+91-98861-28128',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '59/3, Gandhi Bazaar Main Road',
    addressLocality: 'Basavanagudi',
    addressRegion: 'Karnataka',
    postalCode: '560004',
    addressCountry: 'IN',
  },
  sameAs: [
    'https://instagram.com/wevysya',
    'https://facebook.com/wevysya',
    'https://youtube.com/@wevysya',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <VideoPlayProvider>
            <ConditionalChrome />
            <main className="min-h-screen">{children}</main>
            <ConditionalFooter />
            <ConsentBanner />
          </VideoPlayProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
