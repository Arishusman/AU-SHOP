import { notFound } from 'next/navigation';
import { ProductActions } from '@/components/ProductActions';
import Link from 'next/link';
import { money } from '@/lib/store';

const API =
  process.env.NEXT_PUBLIC_API_URL || 'https://au-shop-latest-backend.arishusm12an.workers.dev';

function slugify(value: string) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function getProduct(slug: string) {
  try {
    const response = await fetch(
      `${API}/api/products`,
      { cache: 'no-store' }
    );

    if (!response.ok) return null;

    const result = await response.json();
    const dbProducts = Array.isArray(result?.data?.items)
      ? result.data.items
      : [];

    const product = dbProducts.find((p: any) => {
      const productSlug =
        p.slug ||
        p.handle ||
        slugify(p.name);

      return String(productSlug) === String(slug);
    });

    return product || null;
  } catch (error) {
    console.error('Product loading failed:', error);
    return null;
  }
}

export default async function ProductPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;

  const p = await getProduct(slug);

  if (!p) return notFound();

  const image =
    p.image ||
    p.image_url ||
    p.imageUrl ||
    '';

  return (
    <main className="container page">
      <div className="detail">

        <div className="productArt">
          {image ? (
            <img
              src={image}
              alt={p.name || 'Product'}
              style={{
                width: '100%',
                height: '100%',
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          ) : (
            <span>{p.name}</span>
          )}
        </div>

        <div>
          <div className="eyebrow">
            In store · Product #{p.id}
          </div>

          <h1>{p.name}</h1>

          <div
            className="price"
            style={{ fontSize: 28 }}
          >
            {money(Number(p.price) || 0)}
          </div>

          {p.use && (
            <p className="muted">
              {p.use}
            </p>
          )}

          {p.benefit && (
            <p style={{
              fontSize: 18,
              lineHeight: 1.7
            }}>
              {p.benefit}
            </p>
          )}

          <div className="notice">
            <b>Availability:</b>{' '}
            {p.available
              ? 'Available in store'
              : 'Out of stock'}
            {' · '}
            {p.stock ?? 0} units
          </div>

          <ProductActions p={p} />

          <div className="section">
            <h3>Product details</h3>

            <p className="muted">
              Designed for{' '}
              {p.forWho ||
                p.for_who ||
                'All customers'}.
            </p>
          </div>
        </div>
      </div>

      <Link href="/products" className="btn ghost">
        ← Back to products
      </Link>
    </main>
  );
}
