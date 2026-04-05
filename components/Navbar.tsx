"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useProductCatalog } from "../context/ProductCatalogContext";
import { useSearch } from "../context/SearchContext";
import SearchSuggestions from "./SearchSuggestions";

function SearchIcon() {
  return (
    <svg
      className="mobile-search-icon"
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden
    >
      <circle cx={11} cy={11} r={8} />
      <line x1={21} y1={21} x2={16.65} y2={16.65} />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg className="cart-icon" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path d="M9 2L6 9H3l3 9h12l3-9h-3l-3-7z" />
      <circle cx={9} cy={13} r={1} />
      <circle cx={15} cy={13} r={1} />
    </svg>
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { searchText, setSearchText, setShowSuggestions } = useSearch();
  const { count, setDrawerOpen } = useCart();
  const { products } = useProductCatalog();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openNested, setOpenNested] = useState<string | null>(null);

  // Make products available to SearchContext
  useEffect(() => {
    if (typeof window !== "undefined" && products.length > 0) {
      (window as any).allProducts = products;
    }
  }, [products]);

  // Hide Navbar completely on Admin panel
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function toggleMenu() {
    setMenuOpen((o) => !o);
  }

  function toggleNested(key: string) {
    setOpenNested((prev) => (prev === key ? null : key));
  }

  function randomProduct() {
    if (!products.length) return;
    const idx = Math.floor(Math.random() * products.length);
    const id = products[idx]!.id;
    router.push(`/product/${id}`);
    setMenuOpen(false);
  }

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <button type="button" className="menu-btn" onClick={toggleMenu} aria-expanded={menuOpen} aria-controls="menuOverlay">
            <div className="hamburger-icon-stylish">
              <span className="line-top" />
              <span className="line-mid" />
              <span className="line-bottom" />
            </div>
            <span className="menu-text">MENU</span>
          </button>
        </div>

        <div className="nav-center">
          <div className="logo-box" />
          <Link href="/" className="brand-name" style={{ textDecoration: "none" }}>
            INARAH
          </Link>
        </div>

        <div className="nav-right">
          <div className="search-wrapper">
            <div className="stylish-search">
              <SearchIcon />
              <input
                type="search"
                id="desktop-search-input"
                placeholder="Search..."
                autoComplete="off"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onFocus={() => { if (searchText.trim().length >= 2) setShowSuggestions(true); }}
              />
              <button type="button" className="clear-search-btn" aria-label="Clear search" onClick={() => setSearchText("")}>
                <ClearIcon />
              </button>
            </div>
            <SearchSuggestions />
          </div>
          <button type="button" className="cart-glass" onClick={() => setDrawerOpen(true)} aria-label={`Open cart, ${count} items`}>
            <CartIcon />
            <span className="cart-count-badge" id="navbarCartCount">
              {count}
            </span>
          </button>
        </div>

        <div
          id="menuOverlay"
          className={`menu-overlay${menuOpen ? " active" : ""}`}
          inert={!menuOpen}
        >
          <div className="menu-header">
            <button type="button" className="menu-back-btn" onClick={toggleMenu} aria-label="Close Menu">
              <div className="back-icon-wrapper">
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="back-text">CLOSE</span>
            </button>
          </div>
          <div className="menu-scroll-container">
            <div className={`nested${openNested === "men" ? " open" : ""}`}>
              <button type="button" className="category-trigger" onClick={() => toggleNested("men")}>
                <span className="cat-text">MEN</span>
                <span className="plus-icon">{openNested === "men" ? "−" : "+"}</span>
              </button>
              <ul className="sub-links">
                <li>
                  <Link href="/?category=Men&subCategory=Bags" onClick={() => setMenuOpen(false)}>
                    Bags
                  </Link>
                </li>
                <li>
                  <Link href="/?category=Men&subCategory=Sunglasses" onClick={() => setMenuOpen(false)}>
                    Sunglasses
                  </Link>
                </li>
                <li>
                  <Link href="/?category=Men&subCategory=Sneakers" onClick={() => setMenuOpen(false)}>
                    Sneakers
                  </Link>
                </li>
              </ul>
            </div>
            <div className={`nested${openNested === "women" ? " open" : ""}`}>
              <button type="button" className="category-trigger" onClick={() => toggleNested("women")}>
                <span className="cat-text">WOMEN</span>
                <span className="plus-icon">{openNested === "women" ? "−" : "+"}</span>
              </button>
              <ul className="sub-links">
                <li>
                  <Link href="/?category=Women&subCategory=HANDBAG" onClick={() => setMenuOpen(false)}>
                    HANDBAG
                  </Link>
                </li>
                <li>
                  <Link href="/?category=Women&subCategory=PURSE" onClick={() => setMenuOpen(false)}>
                    PURSE
                  </Link>
                </li>
              </ul>
            </div>
            <div className={`nested${openNested === "accessories" ? " open" : ""}`}>
              <button type="button" className="category-trigger" onClick={() => toggleNested("accessories")}>
                <span className="cat-text">ACCESSORIES</span>
                <span className="plus-icon">{openNested === "accessories" ? "−" : "+"}</span>
              </button>
              <ul className="sub-links">
                <li>
                  <Link href="/?category=Accessories&subCategory=HOME%20DECOR" onClick={() => setMenuOpen(false)}>
                    HOME DECOR
                  </Link>
                </li>
                <li>
                  <Link href="/?category=Accessories&subCategory=TECH%20PRODUCT" onClick={() => setMenuOpen(false)}>
                    TECH PRODUCT
                  </Link>
                </li>
              </ul>
            </div>
            <div style={{ height: 150, width: "100%" }} aria-hidden />
            <div className="nested">
              <Link
                href="/recently-viewed"
                className="category-trigger"
                onClick={() => setMenuOpen(false)}
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  textDecoration: "none",
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span className="cat-text" style={{ color: "#ff4d4d" }}>
                  RECENTLY VIEWED
                </span>
                <span className="plus-icon">→</span>
              </Link>
            </div>
            <div className="randomizer-menu-btn-container">
              <button type="button" className="menu-randomizer-btn" onClick={randomProduct}>
                <span className="dice-icon">🎲</span>
                <span className="btn-text">I Don&apos;t Know What I Want</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="mobile-search-bar">
        <div className="search-wrapper">
          <div className="stylish-search">
            <SearchIcon />
            <input
              type="search"
              id="mobile-search-input"
              placeholder="Search..."
              autoComplete="off"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onFocus={() => { if (searchText.trim().length >= 2) setShowSuggestions(true); }}
            />
            <button type="button" className="clear-search-btn" aria-label="Clear search" onClick={() => setSearchText("")}>
              <ClearIcon />
            </button>
          </div>
          <SearchSuggestions isMobile />
        </div>
      </div>
    </>
  );
}
