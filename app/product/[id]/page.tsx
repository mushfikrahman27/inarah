import { PRODUCTS } from "../../../data/products";
import ProductDetailClient from "./ProductDetailClient";
import RelatedProducts from "../../../components/RelatedProducts";
import BackButton from "../../../components/BackButton";
import Breadcrumbs from "../../../components/Breadcrumbs";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === Number(id));
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} | INARAH`,
    description: product.description ?? "Experience premium quality and curated luxury.",
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = Number(id);
  const product = PRODUCTS.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 p-8 bg-[#0a0a0a] text-white">
        <p>Product not found.</p>
        <BackButton className="text-[#d4af37] underline" />
      </div>
    );
  }

  return (
    <div className="product-detail-route min-h-screen bg-[#0a0a0a] text-white pb-16">
      <div className="details-container max-w-7xl mx-auto px-4 md:px-8 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <BackButton />
          <div className="sm:hidden">
            <Breadcrumbs className="text-xs" />
          </div>
          <div className="hidden sm:block">
            <Breadcrumbs />
          </div>
        </div>

        {/* Client Component for Interactive Sections (Image Gallery, Swatches, Add to Cart) */}
        <ProductDetailClient product={product} />

        {/* Natively Server-Side Rendered Description, Features, and Layout for optimal SEO */}
        <div className="max-w-4xl mx-auto mt-12 mb-20 border-t border-white/5 pt-10">
          <h2 className="text-2xl font-serif text-white mb-6">Product Details</h2>
          <p className="det-description text-[#a0a0a0] leading-relaxed mb-8 text-lg">
            {product.description ?? 'Experience premium quality and sophisticated design. This exquisite piece combines elegance with modern functionality, crafted carefully to upgrade your lifestyle.'}
          </p>

          <div className="product-features mb-8">
            <ul className="list-none p-0 grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="flex items-center text-[#ccc] text-[0.95rem] bg-white/5 p-4 rounded-lg">
                <span className="text-[#d4af37] mr-3 text-lg">✦</span>
                <span className="font-medium min-w-[80px]">Design:</span> 
                <span className="text-[#a0a0a0]">Premium {product.color} Finish</span>
              </li>
              <li className="flex items-center text-[#ccc] text-[0.95rem] bg-white/5 p-4 rounded-lg">
                <span className="text-[#d4af37] mr-3 text-lg">✦</span>
                <span className="font-medium min-w-[80px]">Category:</span> 
                <span className="text-[#a0a0a0]">{product.category} / {product.subCategory}</span>
              </li>
              <li className="flex items-center text-[#ccc] text-[0.95rem] bg-white/5 p-4 rounded-lg">
                <span className="text-[#d4af37] mr-3 text-lg">✦</span>
                <span className="font-medium min-w-[80px]">Target:</span> 
                <span className="text-[#a0a0a0]">Modern Individuals</span>
              </li>
            </ul>
          </div>

          <div className="det-extra-section border-t border-white/5 pt-8">
            <h3 className="text-xs tracking-widest text-[#666] mb-4 font-semibold uppercase">Care Instructions</h3>
            <p className="text-[#777] text-sm leading-relaxed">{product.care ?? 'Handle with care. Store in a cool, dry place to maintain pristine condition.'}</p>
          </div>
        </div>

        {/* You May Also Like - SSR Related Products */}
        <RelatedProducts currentProduct={product} />
        
      </div>
    </div>
  );
}
