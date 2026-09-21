import { ProductCard } from '@/components/ProductCard';
import { notFound } from 'next/navigation';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://au-shop-latest-backend.arishusm12an.workers.dev';

type CategoryProduct = {
  product_id: number | string;
};

type Category = {
  id: number | string;
  name: string;
  slug?: string;
  tagline?: string;
  tone?: string;
  image?: string | null;
  category_products?: CategoryProduct[];
};

type Product = {
  id: number | string;
  [key: string]: any;
};

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/api/categories`, {
      cache: 'no-store',
    });

    if (!res.ok) return [];

    const json = await res.json();

    return Array.isArray(json.data)
      ? json.data
      : Array.isArray(json.data?.items)
        ? json.data.items
        : Array.isArray(json.items)
          ? json.items
          : [];
  } catch {
    return [];
  }
}

async function getHomeConfig() {
  try {
    const res = await fetch(`${API_URL}/api/home-config`, {
      cache: 'no-store',
    });

    if (!res.ok) return { categories: [], products: [] };

    const json = await res.json();

    return json?.ok && json?.data
      ? json.data
      : { categories: [], products: [] };
  } catch {
    return { categories: [], products: [] };
  }
}

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/api/products`, {
      cache: 'no-store',
    });

    if (!res.ok) return [];

    const json = await res.json();

    return Array.isArray(json.data?.items)
      ? json.data.items
      : [];
  } catch {
    return [];
  }
}

export default async function Category({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [categories, products, homeConfig] = await Promise.all([
    getCategories(),
    getProducts(),
    getHomeConfig(),
  ]);

  /*
   * URL uses category.slug:
   * /category/beauty-creams
   *
   * Backend also has numeric id:
   * id = 1
   *
   * Match slug first, with id as fallback.
   */
  const c = categories.find(
    (x) =>
      String(x.slug || '').toLowerCase() === slug.toLowerCase() ||
      String(x.id) === slug
  );

  if (!c) {
    notFound();
  }

  const productIds = new Set(
    (homeConfig.products ?? [])
      .filter(
        (x: any) =>
          String(x.category_id) === String(c.id) &&
          x.enabled !== false
      )
      .sort(
        (a: any, b: any) =>
          Number(a.sort_order || 0) - Number(b.sort_order || 0)
      )
      .map((x: any) => String(x.product_id))
  );

  const list = products.filter((p) =>
    productIds.has(String(p.id))
  );

  return (
    <main className="container page">
      <div className={`catBanner ${c.tone || ''}`}>
        <div className="catContent">
          <div className="eyebrow">Category</div>

          <h3>{c.name}</h3>

          {c.tagline && <p>{c.tagline}</p>}
        </div>
      </div>

      <div className="notice">
        Category: {c.name}
      </div>

      <div className="grid">
        {list.length > 0 ? (
          list.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))
        ) : (
          <div className="empty">
            No products in this category yet.
          </div>
        )}
      </div>
    </main>
  );
}
