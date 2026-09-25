"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  MessageCircle,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import { ProductCard } from "./ProductCard";
import { getCached, setCached } from "@/lib/liveCache";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://au-shop-latest-backend.arishusm12an.workers.dev";

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
    href: string;
    buttonText: string;
  }>;
  why: {
    eyebrow: string;
    title: string;
    text: string;
    points: string[];
  };
};

type Category = {
  id: number | string;
  name: string;
  slug?: string;
  image?: string | null;
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
    buttonLink: "/products",
  },
  showcase: [],
  why: {
    eyebrow: "WHY A.U SHOP",
    title: "Quality products. Clear pricing. Easy tracking.",
    text:
      "A modern beauty storefront designed for simple discovery, easy checkout and clear order tracking.",
    points: [
      "Curated beauty catalog",
      "Delivery tracking",
      "Customer reviews",
    ],
  },
};

function normalizeSite(data: any): SiteContent {
  return {
    ...defaultSite,
    ...(data || {}),
    hero: {
      ...defaultSite.hero,
      ...(data?.hero || {}),
    },
    showcase: Array.isArray(data?.showcase)
      ? data.showcase.map((item: any) => ({
          image: item?.image || "",
          title: item?.title || "",
          text: item?.text || "",
          href:
            item?.href ||
            item?.buttonLink ||
            item?.button_link ||
            "/products",
          buttonText:
            item?.button_text ||
            item?.buttonText ||
            "View Detail",
        }))
      : [],
    why: {
      ...defaultSite.why,
      ...(data?.why || {}),
      points: Array.isArray(data?.why?.points)
        ? data.why.points
        : defaultSite.why.points,
    },
  };
}

async function getJson(path: string) {
  const res = await fetch(`${API}${path}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`${path} failed: ${res.status}`);
  }

  return res.json();
}

function unwrap<T = any>(json: any): T {
  return (json?.data ?? json) as T;
}

function openHref(href: string) {
  return href || "/products";
}

function isExternal(href: string) {
  return /^https?:\/\//i.test(href);
}

export default function LiveHome() {
  const [site, setSite] = useState<SiteContent>(() => {
    const cached = getCached<any>("site-content");
    return normalizeSite(cached);
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    return getCached<Category[]>("categories") || [];
  });

  const [products, setProducts] = useState<Product[]>(() => {
    return getCached<Product[]>("products") || [];
  });

  const [homeConfig, setHomeConfig] = useState<HomeConfig>(() => {
    return (
      getCached<HomeConfig>("home-config") || {
        categories: [],
        products: [],
      }
    );
  });

  const [slideIndex, setSlideIndex] = useState(0);
  const [showTop, setShowTop] = useState(false);

  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const refreshSite = async () => {
      try {
        const json = await getJson("/api/site-content");
        const next = normalizeSite(unwrap(json));

        if (!cancelled) {
          setSite(next);
          setCached("site-content", next);
        }
      } catch {
        // Cached/default content remains visible.
      }
    };

    const refreshCategories = async () => {
      try {
        const json = await getJson("/api/categories");
        const data: any = unwrap(json);

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
            ? data.items
            : [];

        if (!cancelled) {
          setCategories(list);
          setCached("categories", list);
        }
      } catch {
        // Cached categories remain visible.
      }
    };

    const refreshProducts = async () => {
      try {
        const json = await getJson("/api/products");
        const data: any = unwrap(json);

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
            ? data.items
            : [];

        if (!cancelled) {
          setProducts(list);
          setCached("products", list);
        }
      } catch {
        // Cached products remain visible.
      }
    };

    const refreshHomeConfig = async () => {
      try {
        const json = await getJson("/api/home-config");
        const data: any = unwrap(json);

        const config: HomeConfig = {
          categories: Array.isArray(data?.categories)
            ? data.categories
            : [],
          products: Array.isArray(data?.products)
            ? data.products
            : [],
        };

        if (!cancelled) {
          setHomeConfig(config);
          setCached("home-config", config);
        }
      } catch {
        // Home config is optional. Normal category/product data remains.
      }
    };

    refreshSite();
    refreshCategories();
    refreshProducts();
    refreshHomeConfig();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!site.showcase.length) return;

    if (slideIndex >= site.showcase.length) {
      setSlideIndex(0);
    }

    const timer = window.setInterval(() => {
      setSlideIndex((current) =>
        current + 1 >= site.showcase.length ? 0 : current + 1
      );
    }, 4500);

    return () => window.clearInterval(timer);
  }, [site.showcase.length, slideIndex]);

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visibleCategories = useMemo(() => {
    if (!homeConfig.categories.length) {
      return [...categories].sort(
        (a, b) =>
          Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0) ||
          String(a.name).localeCompare(String(b.name))
      );
    }

    const order = new Map(
      homeConfig.categories
        .filter((item) => item.enabled !== false)
        .map((item) => [
          String(item.category_id),
          Number(item.sort_order ?? 0),
        ])
    );

    return categories
      .filter((category) => order.has(String(category.id)))
      .sort(
        (a, b) =>
          Number(order.get(String(a.id)) ?? 0) -
          Number(order.get(String(b.id)) ?? 0)
      );
  }, [categories, homeConfig.categories]);

  const getCategoryProducts = (categoryId: number | string) => {
    const byId = new Map(
      products.map((product) => [String(product.id), product])
    );

    if (homeConfig.products.length) {
      const configured = homeConfig.products
        .filter(
          (item) =>
            String(item.category_id) === String(categoryId) &&
            item.enabled !== false
        )
        .sort(
          (a, b) =>
            Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0)
        );

      return configured
        .map((item) => byId.get(String(item.product_id)))
        .filter(Boolean)
        .slice(0, 2) as Product[];
    }

    return products
      .filter(
        (product) =>
          String(product.category_id) === String(categoryId) ||
          String(product.category?.id) === String(categoryId)
      )
      .slice(0, 2);
  };

  const nextSlide = () => {
    if (!site.showcase.length) return;

    setSlideIndex((current) =>
      current + 1 >= site.showcase.length ? 0 : current + 1
    );
  };

  const previousSlide = () => {
    if (!site.showcase.length) return;

    setSlideIndex((current) =>
      current <= 0 ? site.showcase.length - 1 : current - 1
    );
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const distance = endX - touchStartX.current;

    touchStartX.current = null;

    if (Math.abs(distance) < 45) return;

    if (distance < 0) {
      nextSlide();
    } else {
      previousSlide();
    }
  };

  const scrollToCategories = () => {
    document
      .getElementById("home-categories")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const whatsappMessage = encodeURIComponent(
    "Assalam o Alaikum! 👋\n\nMain A.U SHOP se products ke bare mein maloomat lena chahta hoon.\n\nPlease mujhe products aur ordering ke bare mein guide kar dein."
  );

  const whatsappUrl = `https://wa.me/923160478318?text=${whatsappMessage}`;

  const whyIcons = [ShieldCheck, Truck, Star];

  return (
    <>
      <main className="container homePage">
        <section className="hero">
          <div className="heroCard">
            <div className="eyebrow">{site.hero.eyebrow}</div>

            <h1>{site.hero.title}</h1>

            <p>{site.hero.text}</p>

            <div className="heroActions">
              <Link
                className="button"
                href={site.hero.buttonLink || "/products"}
              >
                {site.hero.buttonText || "Shop Now"}
              </Link>

              <button
                type="button"
                className="button buttonSecondary"
                onClick={scrollToCategories}
              >
                Explore Categories
              </button>
            </div>
          </div>
        </section>

        {site.showcase.length > 0 && (
          <section className="section homeShowcaseSection">
            <div className="sectionHead">
              <div>
                <div className="eyebrow">FEATURED</div>
                <h2>Featured Collections</h2>
              </div>
            </div>

            <div
              className="showcaseSlider"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div className="showcaseViewport">
                {(() => {
                  const slide = site.showcase[slideIndex];

                  if (!slide) return null;

                  const href = openHref(slide.href);

                  return (
                    <div className="showcaseSlide">
                      <div className="showcaseImageWrap">
                        {slide.image ? (
                          <img
                            src={slide.image}
                            alt={slide.title || "Featured collection"}
                          />
                        ) : (
                          <div className="showcaseImagePlaceholder">
                            A.U SHOP
                          </div>
                        )}

                        <div className="showcaseOverlay">
                          {slide.title && <h3>{slide.title}</h3>}

                          {slide.text && <p>{slide.text}</p>}
                        </div>
                      </div>

                      <div className="showcaseBottom">
                        {isExternal(href) ? (
                          <a
                            className="button"
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {slide.buttonText || "View Detail"}
                          </a>
                        ) : (
                          <Link className="button" href={href}>
                            {slide.buttonText || "View Detail"}
                          </Link>
                        )}

                        <span className="showcaseSwipeHint">
                          Swipe to explore
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {site.showcase.length > 1 && (
                <>
                  <button
                    type="button"
                    className="showcaseControl showcaseControlLeft"
                    onClick={previousSlide}
                    aria-label="Previous showcase"
                  >
                    <ArrowLeft size={20} />
                  </button>

                  <button
                    type="button"
                    className="showcaseControl showcaseControlRight"
                    onClick={nextSlide}
                    aria-label="Next showcase"
                  >
                    <ArrowRight size={20} />
                  </button>

                  <div className="showcaseDots">
                    {site.showcase.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        className={
                          index === slideIndex
                            ? "showcaseDot active"
                            : "showcaseDot"
                        }
                        onClick={() => setSlideIndex(index)}
                        aria-label={`Showcase ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        <section className="section whySection">
          <div className="whyCard">
            <div className="eyebrow">{site.why.eyebrow}</div>

            <h2>{site.why.title}</h2>

            <p className="whyDescription">{site.why.text}</p>

            <div className="whyPoints">
              {site.why.points.map((point, index) => {
                const Icon = whyIcons[index % whyIcons.length];

                return (
                  <div className="whyPoint" key={`${point}-${index}`}>
                    <Icon size={27} strokeWidth={1.8} />
                    <span>{point}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section" id="home-categories">
          <div className="sectionHead">
            <div>
              <div className="eyebrow">SHOP</div>
              <h2>Shop by Category</h2>
            </div>
          </div>

          <div className="homeCategories">
            {visibleCategories.map((category) => {
              const categoryProducts = getCategoryProducts(category.id);

              const categoryHref = `/category/${
                category.slug || category.id
              }`;

              return (
                <section
                  className="homeCategory"
                  key={String(category.id)}
                >
                  <Link
                    href={categoryHref}
                    className="categoryBannerLink"
                  >
                    <div className="categoryBannerImage">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                        />
                      ) : (
                        <div className="categoryImagePlaceholder">
                          {category.name}
                        </div>
                      )}

                      <div className="categoryBannerOverlay">
                        <div>
                          <div className="eyebrow">CATEGORY</div>
                          <h3>{category.name}</h3>
                        </div>

                        <span>View Category →</span>
                      </div>
                    </div>
                  </Link>

                  {categoryProducts.length > 0 && (
                    <div className="productGrid homeCategoryProducts">
                      {categoryProducts.map((product) => (
                        <ProductCard
                          key={String(product.id)}
                          p={product}
                        />
                      ))}
                    </div>
                  )}
                </section>
              );
            })}

            {!visibleCategories.length && (
              <div className="empty">
                Categories will appear here once they are added.
              </div>
            )}
          </div>
        </section>

        <section className="section whatsappSection">
          <div className="whatsappCard">
            <div className="whatsappIcon">
              <MessageCircle size={34} />
            </div>

            <div>
              <div className="eyebrow">WHATSAPP</div>
              <h2>Need help choosing a product?</h2>
              <p>
                Chat with us for product information, availability,
                ordering help or any question about A.U SHOP.
              </p>
            </div>

            <a
              className="button"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat With Us
            </a>
          </div>
        </section>
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
