import type { MetadataRoute } from 'next';
import { products } from '@/lib/products';
import { categories } from '@/lib/categories';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://au-shop-ruby.vercel.app';

  return [
    { url: base, priority: 1 },
    { url: `${base}/products`, priority: 0.9 },
    { url: `${base}/categories`, priority: 0.8 },

    ...categories.map((c) => ({
      url: `${base}/category/${c.id}`,
      priority: 0.7,
    })),

    { url: `${base}/about`, priority: 0.6 },
    { url: `${base}/contact`, priority: 0.6 },
    { url: `${base}/location`, priority: 0.5 },
    { url: `${base}/privacy-policy`, priority: 0.6 },
    { url: `${base}/terms`, priority: 0.5 },
    { url: `${base}/return-refund`, priority: 0.5 },
    { url: `${base}/shipping`, priority: 0.5 },

    ...products.map((p) => ({
      url: `${base}/product/${p.slug}`,
      priority: 0.6,
      lastModified: new Date(),
    })),
  ];
}
