"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MessageCircle, ArrowUp } from "lucide-react";
import { ProductCard } from "./ProductCard";

const API = process.env.NEXT_PUBLIC_API_URL || "";

type SiteContent = {
  hero: {
    eyebrow: string;
    title: string;
    text: string;
    buttonText: string;
    buttonLink: string;
  };
  showcase: Array<{
    image: string;
    title: string;
    text: string;
    buttonText: string;
    buttonLink: string;
  }>;
};

type Category = {
  id: number | string;
  name: string;
  image?: string;
  sort_order?: number;
};

type Product = {
  id: number | string;
  name: string;
  slug?: string;
  price: number;
  sale_price?: number | null;
  image?: string;
  images?: string[];
  category_id?: number | string;
  category?: {
    id?: number | string;
    name?: string;
  };
};

type HomeConfig = {
  categories: Array<{
    category_id: number | string;
    enabled: boolean;
    sort_order: number;
  }>;
  products: Array<{
    category_id: number | string;
    product_id: number | string;
    enabled: boolean;
    sort_order: number;
  }>;
};

const defaultSite: SiteContent = {
  hero: {
    eyebrow: "A.U SHOP",
    title: "Discover Your Everyday Favorites",
    text: "Shop quality products with a simple and premium shopping experience.",
    buttonText: "Shop Now",
    buttonLink: "/",
  },
  showcase: [],
};

export default function LiveHome() {
  const [site, setSite] = useState<SiteContent>(defaultSite);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [homeConfig, setHomeConfig] = useState<HomeConfig>({
    categories: [],
    products: [],
  });
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [siteRes, catRes, productRes, configRes] = await Promise.all([
          fetch(`${API}/api/site-content`, { cache: "no-store" }),
          fetch(`${API}/api/categories`, { cache: "no-store" }),
          fetch(`${API}/api/products`, { cache: "no-store" }),
          fetch(`${API}/api/home-config`, { cache: "no-store" }),
        ]);

        if (siteRes.ok) {
          const data = await siteRes.json();
          setSite({ ...defaultSite, ...data });
        }

        if (catRes.ok) {
          const data = await catRes.json();
          setCategories(Array.isArray(data) ? data : data?.items || []);
        }

        if (productRes.ok) {
          const data = await productRes.json();
          setProducts(Array.isArray(data) ? data : data?.items || []);
        }

        if (configRes.ok) {
          const data = await configRes.json();
          setHomeConfig({
            categories: Array.isArray(data?.categories) ? data.categories : [],
            products: Array.isArray(data?.products) ? data.products : [],
          });
        }
      } catch (error) {
        console.error("Unable to load homepage:", error);
      }
    };

    load();
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visibleCategories = useMemo(() => {
    if (!homeConfig.categories.length) return [];

    const order = new Map(
      homeConfig.categories.map((item) => [
        String(item.category_id),
        item.sort_order,
      ])
    );

    return categories
      .filter((cat) => order.has(String(cat.id)))
      .sort(
        (a, b) =>
          Number(order.get(String(a.id)) ?? 0) -
          Number(order.get(String(b.id)) ?? 0)
      );
  }, [categories, homeConfig.categories]);

  const getCategoryProducts = (categoryId: number | string) => {
    const configured = homeConfig.products
      .filter(
        (item) =>
          String(item.category_id) === String(categoryId) && item.enabled
      )
      .sort((a, b) => a.sort_order - b.sort_order);

    const byId = new Map(products.map((product) => [String(product.id), product]));

    return configured
      .map((item) => byId.get(String(item.product_id)))
      .filter(Boolean) as Product[];
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <a
        href={`https://wa.me/923160478318?text=${encodeURIComponent(
          "Assalam o Alaikum! 👋\n\nMain A.U SHOP se products ke bare mein maloomat lena chahta hoon."
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="floatingWhatsapp"
        aria-label="Chat with A.U SHOP on WhatsApp"
      >
        <MessageCircle size={25} fill="currentColor" />
      </a>

      <main className="container">
        <section className="hero">
          <div className="heroCard">
            <div className="eyebrow">{site.hero.eyebrow}</div>

            <h1>{site.hero.title}</h1>

            <p>{site.hero.text}</p>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <Link className="button" href={site.hero.buttonLink || "/"}>
                {site.hero.buttonText || "Shop Now"}
              </Link>
            </div>
          </div>
        </section>

        {site.showcase?.length > 0 && (
          <section className="section">
            <div className="sectionHead">
              <div>
                <div className="eyebrow">FEATURED</div>
                <h2>Featured Collections</h2>
              </div>
            </div>

            <div className="showcaseGrid">
              {site.showcase.map((item, index) => (
                <div className="showcaseCard" key={`${item.title}-${index}`}>
                  {item.image && (
                    <img src={item.image} alt={item.title || "Featured"} />
                  )}

                  <div className="showcaseContent">
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>

                    {item.buttonText && (
                      <Link
                        href={item.buttonLink || "/"}
                        className="button"
                      >
                        {item.buttonText}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {visibleCategories.map((category) => {
          const categoryProducts = getCategoryProducts(category.id);

          if (!categoryProducts.length) return null;

          return (
            <section className="section" key={String(category.id)}>
              <div className="sectionHead">
                <div>
                  <div className="eyebrow">SHOP</div>
                  <h2>{category.name}</h2>
                </div>

                <Link
                  href={`/category/${category.id}`}
                  className="textLink"
                >
                  View All
                </Link>
              </div>

              <div className="productGrid">
                {categoryProducts.map((product) => (
                  <ProductCard
                    key={String(product.id)}
                    p={product}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {showTop && (
        <button
          type="button"
          className="backToTop"
          onClick={scrollTop}
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </>
  );
}
