"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { Product } from "../data/products";
import { normalizePublicImagePath } from "../data/products";
import { useCart } from "../context/CartContext";
import { useCheckout } from "../context/CheckoutContext";
import { useProductDetails } from "../context/ProductDetailsContext";
import { buildOrderContextForProduct, defaultColorForProduct, defaultSizeForProduct } from "../utils/productOrder";

type Props = { product: Product; index?: number };

export default function ProductCard({ product: p, index = 0 }: Props) {
  const { addToCart } = useCart();
  const { openCheckout } = useCheckout();
  const { openProductDetails } = useProductDetails();

  const colorOptions = useMemo(() => (p.colors?.length ? p.colors : [p.color]), [p]);
  const sizeOptions = useMemo(() => (p.sizes?.length ? p.sizes : []), [p]);

  const [selectedColor, setSelectedColor] = useState(() => defaultColorForProduct(p));
  const [selectedSize, setSelectedSize] = useState(() => defaultSizeForProduct(p));

  const displayImg = useMemo(() => {
    const map = p.colorImages;
    if (map && selectedColor && map[selectedColor]) {
      return normalizePublicImagePath(map[selectedColor]);
    }
    return normalizePublicImagePath(p.img);
  }, [p, selectedColor]);

  const out = Number(p.stock) === 0;
  
  // Calculate a staggered delay based on index (if provided), or default to simple animation
  const staggerDelay = `${0.1 * index}s`;

  const handleSingleBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openCheckout(buildOrderContextForProduct(p, selectedColor, selectedSize));
  };

  return (
    <div 
      className={`product-card${out ? " out-of-stock" : ""}`}
      style={{
        animationDelay: staggerDelay,
        backgroundColor: "#FFFFFF"
      }}
    >
      <div 
        className="product-img-holder block relative w-full overflow-hidden rounded-t-[12px] cursor-pointer" 
        style={{ aspectRatio: "4/5" }}
        onClick={() => openProductDetails(p.id)}
      >
        <Image src={displayImg} alt={p.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-500 hover:scale-105" />
      </div>
      
      <div className="product-details p-info p-4">
        <h3 
          className="p-name text-[1rem] font-semibold mb-[10px] text-[#1a1a1a] cursor-pointer hover:text-[#b67e7d] transition-colors inline-block"
          onClick={() => openProductDetails(p.id)}
        >
          {p.name}
        </h3>
        <p className="p-meta text-sm text-[#6b7280] mb-1">Color: {selectedColor}</p>
        <p className="p-price text-[1.1rem] font-bold text-[#b67e7d] mb-3">TK-{p.price}</p>

        {colorOptions.length > 1 && (
          <div className="size-selector" style={{ marginTop: 8, marginBottom: 4 }} aria-label="Color">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`text-xs px-3 py-1 rounded-md border font-medium transition-colors ${selectedColor === c ? "border-[#17402a] bg-[#17402a] text-white" : "border-gray-300 text-[#1a1a1a] bg-white hover:border-[#17402a]"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(c);
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {sizeOptions.length > 0 && (
          <div className="size-selector" id={`sizes-prod-${p.id}`} style={{ marginTop: 8, marginBottom: 4 }} aria-label="Size">
            <span style={{ fontSize: 12, color: "var(--text-secondary,#888)", marginRight: 8, fontWeight: 500 }}>Size:</span>
            {sizeOptions.map((sz) => (
              <button
                key={sz}
                type="button"
                className={`inline-block mr-2 px-3 py-1 rounded-md text-xs font-medium transition-all ${selectedSize === sz ? "active bg-[#d4af37] text-black border-[#d4af37]" : "border border-gray-300 text-[#1a1a1a] hover:border-[#d4af37]"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(sz);
                }}
              >
                {sz}
              </button>
            ))}
          </div>
        )}

        <div className="button-group flex flex-col sm:flex-row gap-[10px] mt-[16px] w-full">
          {out ? (
            <button type="button" className="action-btn notify-btn w-full sm:flex-1 opacity-60 bg-gray-300 text-gray-600 cursor-not-allowed py-3 rounded-full font-bold uppercase text-xs" disabled>
              Out of stock
            </button>
          ) : (
            <>
              <button
                type="button"
                className="action-btn buy-btn w-full sm:flex-1 py-[12px] rounded-full font-bold tracking-widest text-[10px] text-[#d4af37] transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md active:scale-95 uppercase border border-[#1a432e]"
                style={{ background: '#1a432e' }}
                onClick={handleSingleBuy}
              >
                Buy Now
              </button>
              <button
                type="button"
                className="action-btn cart-btn w-full sm:flex-1 py-[12px] rounded-full font-bold tracking-widest text-[10px] text-[#1a432e] transition-all duration-300 hover:-translate-y-1 hover:bg-[#1a432e] hover:text-[#d4af37] shadow-sm hover:shadow-md active:scale-95 uppercase border border-[#d4af37]"
                style={{ background: 'transparent' }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToCart(p, { color: selectedColor, size: selectedSize });
                }}
              >
                Add to Cart
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
