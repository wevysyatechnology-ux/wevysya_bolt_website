import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://wevysya.com';
  const routes: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '',                      priority: 1.0, freq: 'weekly'  },
    { path: '/about',                priority: 0.8, freq: 'monthly' },
    { path: '/membership',           priority: 0.9, freq: 'monthly' },
    { path: '/events',               priority: 0.8, freq: 'weekly'  },
    { path: '/houses',               priority: 0.7, freq: 'monthly' },
    { path: '/blog',                 priority: 0.7, freq: 'weekly'  },
    { path: '/faq',                  priority: 0.7, freq: 'monthly' },
    { path: '/contact',              priority: 0.6, freq: 'monthly' },
    { path: '/visitor-registration', priority: 0.6, freq: 'monthly' },
    { path: '/terms',                priority: 0.3, freq: 'yearly'  },
    { path: '/privacy',              priority: 0.3, freq: 'yearly'  },
    { path: '/refund',               priority: 0.3, freq: 'yearly'  },
  ];

  return routes.map(({ path, priority, freq }) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: freq,
    priority,
  }));
}
