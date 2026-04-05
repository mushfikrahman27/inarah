"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import PolicyFeatures from "../components/PolicyFeatures";
import ProductGrid from "../components/ProductGrid";
import { useProductCatalog } from "../context/ProductCatalogContext";
import { useSearch } from "../context/SearchContext";
import { applyProductFilters } from "../utils/productFilters";

export type HomeCategory = "All" | "Men" | "Women" | "Accessories";

function scrollToProducts() {
  document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { searchText } = useSearch();
  const { products } = useProductCatalog();

  const categoryFromUrl = searchParams.get("category");
  const subFromUrl = searchParams.get("subCategory");

  const [category, setCategory] = useState<HomeCategory>("All");
  const [subCategory, setSubCategory] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState(5000);

  useEffect(() => {
    const c = categoryFromUrl;
    if (c === "Men" || c === "Women" || c === "Accessories") setCategory(c);
    else setCategory("All");
  }, [categoryFromUrl]);

  useEffect(() => {
    setSubCategory(subFromUrl);
  }, [subFromUrl]);

  const setFilters = useCallback(
    (cat: HomeCategory, sub: string | null = null) => {
      setCategory(cat);
      setSubCategory(sub);
      const q = new URLSearchParams();
      if (cat !== "All") q.set("category", cat);
      if (sub) q.set("subCategory", sub);
      const qs = q.toString();
      router.replace(qs ? `/?${qs}` : "/", { scroll: false });
    },
    [router],
  );

  const filteredProducts = useMemo(
    () =>
      applyProductFilters(products, {
        category: category === "All" ? null : category,
        subCategory: subCategory && subCategory !== "All" ? subCategory : null,
        priceMin: null,
        priceMax: maxPrice,
        searchText,
      }),
    [category, maxPrice, products, searchText, subCategory],
  );

  return (
    <>
      <section className="hero-parallax hero-section" id="hero-section">
        <div className="hero-bg-image">
          <Image
            src="/images/banner1.png"
            alt="Hero banner"
            fill
            priority
            sizes="100vw"
            className="object-cover brightness-[0.7]"
          />
        </div>
        <div className="hero-overlay" />
      </section>

      <section className="featured-collection">
        <div className="promo-grid">
          <div
            className="promo-card large-card relative"
            role="button"
            tabIndex={0}
            onClick={() => {
              setFilters("Men");
              scrollToProducts();
            }}
          >
            <Image src="/images/men.jpg" alt="Men's Collection" className="promo-image" fill sizes="(max-width: 768px) 100vw, 66vw" />
            <div className="promo-card-content">
              <h3 className="promo-title">Men&apos;s Collection</h3>
              <p className="promo-subtitle">Discover Premium Styles</p>
            </div>
          </div>
          <div className="promo-column">
            <div
              className="promo-card small-card relative"
              role="button"
              tabIndex={0}
              onClick={() => {
                setFilters("Women");
                scrollToProducts();
              }}
            >
              <Image src="/images/woman.jpg" alt="Women's Collection" className="promo-image" fill sizes="(max-width: 768px) 100vw, 33vw" />
              <div className="promo-card-content">
                <h3 className="promo-title">Women&apos;s</h3>
                <p className="promo-subtitle">Elegant Designs</p>
              </div>
            </div>
            <div
              className="promo-card small-card relative"
              role="button"
              tabIndex={0}
              onClick={() => {
                setFilters("Accessories");
                scrollToProducts();
              }}
            >
              <Image src="/images/accesories.png" alt="Accessories" className="promo-image" fill sizes="(max-width: 768px) 100vw, 33vw" />
              <div className="promo-card-content">
                <h3 className="promo-title">Accessories</h3>
                <p className="promo-subtitle">Complete Your Collection</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="aesthetic-highlight-zone">
        <div className="aesthetic-container">
          <div
            className="aesthetic-card trending-card"
            role="button"
            tabIndex={0}
            onClick={() => {
              setFilters("All", "Trending");
              scrollToProducts();
            }}
          >
            <div className="card-inner">
              <div className="card-icon">
                <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke="#ff9a00" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 12px rgba(255, 154, 0, 0.6))" }} aria-hidden>
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3 2.5.5 4.5 2.5 4.5 5.5a4.5 4.5 0 0 1-9 0c0-1.11.44-2.11 1.16-2.84.55.34 1.16.84 1.34 1.84Z" />
                  <path d="M12 2c1 2 2 3.5 3.5 4.65 1.5 1.15 3 2.35 3 5a6.5 6.5 0 0 1-13 0c0-1.5.5-3 1.5-4.5.5-1 1-2 1.5-3.5.5-1.5 1-3 1.5-4.5Z" />
                </svg>
              </div>
              <div className="card-text">
                <span className="card-subtitle">Top Picks</span>
                <h3 className="card-title">TRENDING PRODUCTS</h3>
              </div>
            </div>
            <div className="flowing-border" aria-hidden />
          </div>

          <div
            className="aesthetic-card viewed-card"
            role="button"
            tabIndex={0}
            onClick={() => {
              setFilters("All");
              scrollToProducts();
            }}
          >
            <div className="card-inner">
              <div className="card-icon">
                <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 12px rgba(0, 212, 255, 0.6))" }} aria-hidden>
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div className="card-text">
                <span className="card-subtitle">Popular Now</span>
                <h3 className="card-title">New Collection</h3>
              </div>
            </div>
            <div className="flowing-border" aria-hidden />
          </div>
        </div>
      </section>

      <section className="products-section" id="products-section" data-category={category}>
        <div className="filter-pills">
          <button type="button" className={`pill${category === "All" ? " active" : ""}`} onClick={() => setFilters("All")}>
            All
          </button>
          <button type="button" className={`pill${category === "Men" ? " active" : ""}`} onClick={() => setFilters("Men")}>
            Men
          </button>
          <button type="button" className={`pill${category === "Women" ? " active" : ""}`} onClick={() => setFilters("Women")}>
            Women
          </button>
          <button type="button" className={`pill${category === "Accessories" ? " active" : ""}`} onClick={() => setFilters("Accessories")}>
            Accessories
          </button>
        </div>

        <div style={{ height: 20 }} aria-hidden />

        <div className="advanced-filter-row">
          <div className="adv-filter-item">
            <label htmlFor="priceRange">
              Price: <span id="priceLabel">৳{maxPrice}</span>
            </label>
            <input
              type="range"
              id="priceRange"
              min={0}
              max={5000}
              step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="product-grid" id="productGrid">
          <ProductGrid products={filteredProducts} />
        </div>

        <div className="pagination-footer">
          <div className="pagination-column" id="paginationBar" />
          <button type="button" className="scroll-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} aria-hidden>
              <polyline points="18 15 12 9 6 15" />
            </svg>
            <span>Back to Top</span>
          </button>
        </div>
      </section>

      <PolicyFeatures />
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] flex items-center justify-center text-[#888]">Loading…</div>}>
      <HomeContent />
    </Suspense>
  );
}
