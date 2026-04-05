"use client";

import type { Product } from "../data/products";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--text-secondary, #666)", padding: 40 }}>
        No products found in this category.
      </p>
    );
  }

  return (
    <>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </>
  );
}
