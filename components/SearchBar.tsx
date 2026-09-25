'use client';

import {Search, X} from 'lucide-react';
import {useEffect, useState} from 'react';
import Link from 'next/link';
import {getCached, setCached} from '@/lib/liveCache';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

type Product = {
  id: string | number;
  name?: string;
  title?: string;
  slug?: string;
  price?: number | string;
  use?: string;
};

export function SearchBar() {
  const [q, setQ] = useState('');
  const [products, setProducts] = useState<Product[]>(() => {
    return getCached<Product[]>('products') || [];
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const cached = getCached<Product[]>('products');

    if (cached?.length && !cancelled) {
      setProducts(cached);
    }

    const loadProducts = async () => {
      setLoading(true);

      try {
        const res = await fetch(`${API_URL}/api/products`, {
          cache: 'no-store',
        });

        if (!res.ok) throw new Error('Products API failed');

        const json = await res.json();

        const list = Array.isArray(json.data)
          ? json.data
          : Array.isArray(json.data?.items)
            ? json.data.items
            : Array.isArray(json.items)
              ? json.items
              : [];

        if (!cancelled) {
          setProducts(list);
          setCached('products', list);
        }
      } catch {
        // Keep cached products if API fails.
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const query = q.trim().toLowerCase();

  const hits = query
    ? products
        .filter((p) => {
          const name = String(p.name || p.title || '').toLowerCase();
          const use = String(p.use || '').toLowerCase();

          return name.includes(query) || use.includes(query);
        })
        .slice(0, 7)
    : [];

  return (
    <div className="searchWrap">
      <div className="search">
        <Search size={18} />

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products, serums, face wash..."
        />

        {q && (
          <button
            className="iconbtn"
            style={{width: 34, height: 34}}
            onClick={() => setQ('')}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {q && (
        <div className="suggestions">
          {loading && !products.length ? (
            <div style={{padding: 18}} className="muted">
              Searching products...
            </div>
          ) : hits.length ? (
            hits.map((p) => {
              const slug = p.slug || String(p.id);
              const price = Number(p.price || 0);

              return (
                <Link
                  key={p.id}
                  href={`/product/${slug}`}
                  onClick={() => setQ('')}
                >
                  {p.name || p.title || 'Unnamed product'}

                  <span
                    className="muted"
                    style={{float: 'right'}}
                  >
                    Rs {price.toLocaleString()}
                  </span>
                </Link>
              );
            })
          ) : (
            <div style={{padding: 18}} className="muted">
              No record found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
