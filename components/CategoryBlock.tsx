import Link from 'next/link';
import { categoryProducts } from '@/lib/categories';
import { ProductCard } from './ProductCard';

export function CategoryBlock({
  cat,
  products,
}: {
  cat: any;
  products: any[];
}) {
  const list = categoryProducts(cat.id, products).slice(0, 6);

  return (
    <section className="section">
      <div className={`catBanner ${cat.tone}`}>
        <div className="catContent">
          <div className="eyebrow">Curated category</div>
          <h3>{cat.name}</h3>
          <div className="muted">{cat.tagline}</div>
        </div>
      </div>

      <div className="sectionHead">
        <div>
          <h2>{cat.name}</h2>
          <div className="muted">{cat.subs.join(' · ')}</div>
        </div>

        <Link href={`/category/${cat.id}`} className="btn ghost">
          View more
        </Link>
      </div>

      <div className="grid">
        {list.slice(0, 2).map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
