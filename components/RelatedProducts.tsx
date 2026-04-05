import ProductCard from "./ProductCard";
import { PRODUCTS } from "../data/products";
import type { Product } from "../data/products";

export default function RelatedProducts({ currentProduct }: { currentProduct: Product }) {
  if (!currentProduct) return null;

  const related = PRODUCTS.filter(
    (item) => item.subCategory === currentProduct.subCategory && item.id !== currentProduct.id
  ).slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div className="related-section mt-20 border-t border-white/10 pt-16">
      <h2 className="related-title text-center text-xl font-serif tracking-widest uppercase mb-12 text-white">
        You Might Also Like
      </h2>
      <div className="product-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {related.map((rp) => (
          <ProductCard key={rp.id} product={rp} />
        ))}
      </div>
    </div>
  );
}
