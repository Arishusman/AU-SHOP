'use client';

import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { addCart, money } from '@/lib/store';
import { useState } from 'react';

export function ProductCard({ p }: { p: any }) {
  const [added, setAdded] = useState(false);

  const image =
    p.image ||
    p.image_url ||
    p.imageUrl ||
    '';

  const productLink = `/product/${p.slug}`;

  return (
    <article className="product">

      <Link
        href={productLink}
        className="productCardLink"
        aria-label={`View ${p.name}`}
      >
        <div className="productArt">
          {image ? (
            <img
              src={image}
              alt={p.name}
              className="productCardImage"
            />
          ) : (
            <span>{p.name}</span>
          )}
        </div>

        <div className="productBody">

          <div className="pill">
            IN STORE
          </div>

          <div className="productName">
            {p.name}
          </div>

          <div
            className="muted productUse"
            style={{ fontSize: 12 }}
          >
            {p.use}
          </div>

          <div className="price">
            {money(Number(p.price))}
          </div>

        </div>
      </Link>

      <div className="cardBtns">

        <button
          className="btn primary"
          onClick={() => {
            addCart(p);
            setAdded(true);
          }}
        >
          <ShoppingBag size={15} />
          {added ? 'Added' : 'Add to cart'}
        </button>

        <Link
          className="btn ghost"
          href={productLink}
        >
          View detail
          <ArrowRight size={15} />
        </Link>

      </div>

    </article>
  );
}
