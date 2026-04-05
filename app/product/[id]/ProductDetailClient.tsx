"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import BackButton from "../../../components/BackButton";
import Breadcrumbs from "../../../components/Breadcrumbs";
import ProductCard from "../../../components/ProductCard";
import { useCart } from "../../../context/CartContext";
import { useCheckout } from "../../../context/CheckoutContext";
import { useProductCatalog } from "../../../context/ProductCatalogContext";
import type { Product } from "../../../data/products";
import { normalizePublicImagePath } from "../../../data/products";
import { buildOrderContextForProduct, defaultColorForProduct, defaultSizeForProduct } from "../../../utils/productOrder";

function galleryForProduct(p: Product): { name: string; img: string }[] {
  const map = p.colorImages;
  const colors = p.colors?.length ? p.colors : [p.color];
  if (map) {
    return colors
      .map((name) => {
        const path = map[name];
        return path ? { name, img: normalizePublicImagePath(path) } : null;
      })
      .filter((x): x is { name: string; img: string } => x != null);
  }
  return [{ name: p.color, img: normalizePublicImagePath(p.img) }];
}

export default function ProductDetailClient({ product: p }: { product: Product }) {
  const { addToCart } = useCart();
  const { openCheckout } = useCheckout();

  const gallery = useMemo(() => (p ? galleryForProduct(p) : []), [p]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("N/A");

  useEffect(() => {
    if (!p) return;
    setSelectedColor(defaultColorForProduct(p));
    setSelectedSize(defaultSizeForProduct(p));
  }, [p]);

  const mainImg = useMemo(() => {
    if (!p) return "";
    const map = p.colorImages;
    if (map && selectedColor && map[selectedColor]) {
      return normalizePublicImagePath(map[selectedColor]);
    }
    return normalizePublicImagePath(p.img);
  }, [p, selectedColor]);

  if (!p) return null;

  const out = Number(p.stock) === 0;

  return (
    <div className="details-content-wrapper grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
      <div className="details-gallery">
        <div className="main-img-box relative w-full aspect-4/5 rounded-lg overflow-hidden bg-black">
          <Image src={mainImg} alt={p.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority />
        </div>
        {gallery.length > 1 && (
          <div className="thumbnail-strip flex gap-3 mt-4 flex-wrap">
            {gallery.map((item) => (
              <button
                key={item.name}
                type="button"
                className={`relative w-16 h-20 rounded overflow-hidden border-2 ${selectedColor === item.name ? "border-[#d4af37]" : "border-transparent"}`}
                onClick={() => setSelectedColor(item.name)}
              >
                <Image src={item.img} alt="" fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="details-info">
        <h1 className="font-serif text-3xl md:text-5xl mb-4 leading-tight">{p.name}</h1>
        <div className="det-price-row mb-8">
          <span className="text-[#d4af37] font-bold text-3xl">TK-{p.price}</span>
        </div>

        <div className="premium-variant-container mb-8 bg-white/5 p-6 rounded-xl border border-white/10">
          <label className="block text-xs tracking-widest text-[#aaa] uppercase mb-4 font-semibold">Choose your shade: <span className="text-white ml-2">{selectedColor}</span></label>
          <div className="premium-swatch-list flex gap-4 flex-wrap items-center">
            {(p.colors?.length ? p.colors : [p.color]).map((c) => {
              const cls =
                c === "Black" ? "bg-black border-gray-600" : 
                c.toLowerCase().includes("silver") ? "bg-gray-300 border-gray-400" : 
                c.toLowerCase().includes("gold") ? "bg-[#d4af37] border-yellow-600" : 
                "bg-gray-500 border-gray-400";
              return (
                <button
                  key={c}
                  type="button"
                  title={c}
                  data-color={c}
                  className={`variant-swatch color-swatch-item rounded-full w-10 h-10 border-2 ${cls} ${selectedColor === c ? "selected-variant ring-2 ring-offset-2 ring-offset-[#0a0a0a] ring-[#d4af37]" : "opacity-70 hover:opacity-100 border-white/20"}`}
                  onClick={() => setSelectedColor(c)}
                  aria-pressed={selectedColor === c}
                />
              );
            })}
          </div>
        </div>

        {p.sizes && p.sizes.length > 0 && (
          <div className="mb-10 bg-white/5 p-6 rounded-xl border border-white/10">
            <span className="text-xs tracking-widest text-[#aaa] uppercase font-semibold block mb-4">Select Size: <span className="text-white ml-2">{selectedSize !== "N/A" ? selectedSize : ""}</span></span>
            <div className="flex flex-wrap gap-3">
              {p.sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  className={`px-5 py-3 rounded-lg text-sm font-semibold transition-all ${selectedSize === sz ? "bg-[#d4af37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]" : "bg-[#1f1f1f] text-white hover:bg-[#2a2a2a] border border-white/10"}`}
                  onClick={() => setSelectedSize(sz)}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="det-actions flex flex-col sm:flex-row gap-4 mt-8">
          {out ? (
            <button type="button" className="det-btn opacity-50 cursor-not-allowed py-4 rounded-xl w-full bg-gray-800 text-gray-500" disabled>
              Out of stock
            </button>
          ) : (
            <>
              <button
                type="button"
                className="det-btn buy-now w-full sm:flex-1 py-3.5 sm:py-4 rounded-full bg-[#1a432e] text-[#d4af37] font-bold tracking-widest uppercase transition-all duration-300 hover:-translate-y-1 active:scale-95 shadow-md hover:shadow-lg text-sm sm:text-base border border-[#1a432e]"
                onClick={() => openCheckout(buildOrderContextForProduct(p, selectedColor, selectedSize))}
              >
                Buy Now
              </button>
              <button
                type="button"
                className="det-btn add-cart w-full sm:flex-1 py-3.5 sm:py-4 rounded-full border border-[#d4af37] text-[#1a432e] font-bold tracking-widest uppercase bg-transparent transition-all duration-300 hover:-translate-y-1 hover:bg-[#1a432e] hover:text-[#d4af37] active:scale-95 shadow-sm hover:shadow-md text-sm sm:text-base"
                onClick={() => addToCart(p, { color: selectedColor, size: selectedSize })}
              >
                Add To Cart
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
