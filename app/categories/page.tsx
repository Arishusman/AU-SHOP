import Link from 'next/link';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://au-shop-latest-backend.arishusm12an.workers.dev';

type Category = {
  id: number | string;
  name: string;
  slug?: string;
  tagline?: string;
  tone?: string;
  image?: string | null;
};

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/api/categories`, {
      cache: 'no-store',
    });

    if (!res.ok) return [];

    const json = await res.json();

    return Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json?.data?.items)
        ? json.data.items
        : [];
  } catch {
    return [];
  }
}

export default async function Categories() {
  const categories = await getCategories();

  return (
    <main className="container page">
      <div className="eyebrow">Shop by need</div>

      <h1 style={{ fontSize: 54 }}>Categories</h1>

      <div className="grid">
        {categories.map((c) => (
          <Link
            href={`/category/${c.slug || c.id}`}
            key={c.id}
            className={`catBanner ${c.tone || ''}`}
            style={{
              textDecoration: 'none',
              minHeight: 230,
            }}
          >
            <div className="catContent">
              <h3>{c.name}</h3>

              {c.tagline && (
                <div className="muted">
                  {c.tagline}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
