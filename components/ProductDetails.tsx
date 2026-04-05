"use client";

import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import { useProductDetails } from "../context/ProductDetailsContext";
import { useProductCatalog } from "../context/ProductCatalogContext";
import { useCart } from "../context/CartContext";
import { useCheckout } from "../context/CheckoutContext";
import { normalizePublicImagePath } from "../data/products";
import { buildOrderContextForProduct, defaultColorForProduct, defaultSizeForProduct } from "../utils/productOrder";

export default function ProductDetails() {
  const { activeProductId, closeProductDetails } = useProductDetails();
  const { products } = useProductCatalog();
  const { addToCart } = useCart();
  const { openCheckout } = useCheckout();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const product = useMemo(() => {
    if (!activeProductId) return null;
    return products.find(p => p.id === activeProductId) || null;
  }, [activeProductId, products]);

  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isImgTransitioning, setIsImgTransitioning] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedColor(defaultColorForProduct(product));
      setSelectedSize(defaultSizeForProduct(product));
      
      // GA4 & FB Pixel tracking placeholder
      console.log("[Analytics] Facebook Pixel: ViewContent", { content_ids: [product.id], content_type: "product" });
      console.log("[Analytics] GA4: view_item", { items: [{ item_id: product.id, item_name: product.name }] });
    }
  }, [product]);

  const updateProductSelection = (colorName: string) => {
    setIsImgTransitioning(true);
    setTimeout(() => {
      setSelectedColor(colorName);
      setIsImgTransitioning(false);
    }, 150);
  };

  if (!product) {
    return null;
  }

  const colorOptions = product.colors?.length ? product.colors : [product.color];
  const sizeOptions = product.sizes?.length ? product.sizes : [];
  
  const displayImg = (() => {
    const map = product.colorImages;
    if (map && selectedColor && map[selectedColor]) {
      return normalizePublicImagePath(map[selectedColor]);
    }
    return normalizePublicImagePath(product.img);
  })();

  const handleAddToCart = () => {
    addToCart(product, { color: selectedColor, size: selectedSize });
    setToastMessage(`Added ${product.name} to cart!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBuyNow = () => {
    closeProductDetails();
    openCheckout(buildOrderContextForProduct(product, selectedColor, selectedSize));
  };

  const outOfStock = Number(product.stock) === 0;

  return (
    <>
      <div 
        id="productDetailsPage" 
        className={`details-overlay fixed inset-0 z-[99999999] bg-[#0a0a0a] ${activeProductId ? "active" : ""}`}
        style={{ backdropFilter: "blur(10px)", overflowY: "auto" }}
        inert={!activeProductId ? (true as any) : undefined}
      >
        <div className="details-container max-w-6xl mx-auto p-4 md:p-8 min-h-screen flex items-center justify-center">
          <div className="bg-white rounded-[12px] overflow-hidden w-full flex flex-col md:flex-row shadow-[0_4px_12px_rgba(0,0,0,0.1)] relative">
            
            {/* Classy Back Button */}
            <button 
              className="absolute top-4 left-4 md:top-6 md:left-6 z-[100] flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/70 backdrop-blur-md shadow-[0_4px_14px_rgba(0,0,0,0.1)] border border-white/50 text-[#1a1a1a] hover:bg-white hover:scale-105 transition-all duration-300 group"
              onClick={closeProductDetails}
              aria-label="Back"
            >
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Gallery System */}
            <div className="w-full md:w-1/2 bg-[#f5f1e8] p-6 flex flex-col items-center">
              <div className="relative w-full aspect-[4/5] max-w-sm rounded-lg overflow-hidden shadow-lg mb-6 mt-8 md:mt-4">
                <Image 
                  src={displayImg} 
                  alt={product.name} 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={`object-cover transition-opacity duration-300 ${isImgTransitioning ? 'opacity-50' : 'opacity-100'}`} 
                />
              </div>

              {/* Thumbnail Strip */}
              {colorOptions.length > 1 && (
                <div className="thumbnail-strip flex gap-3 overflow-x-auto pb-2 px-2 max-w-full">
                  {colorOptions.map(c => {
                    const thumbImg = (product.colorImages && product.colorImages[c]) 
                                      ? normalizePublicImagePath(product.colorImages[c]) 
                                      : normalizePublicImagePath(product.img);
                    const isActive = selectedColor === c;
                    return (
                      <button 
                        key={c}
                        onClick={() => updateProductSelection(c)}
                        className={`relative w-16 h-20 flex-shrink-0 rounded-md overflow-hidden transition-all duration-300 border-2 ${isActive ? 'border-[#d4af37] scale-110 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'} p-0 bg-transparent cursor-pointer`}
                      >
                        <Image src={thumbImg} alt={c} fill className="object-cover" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-[#1a1a1a] font-serif">{product.name}</h2>
              <p className="text-2xl font-bold text-[#b67e7d] mb-6">TK-{product.price}</p>
              
              <div className="mb-6">
                <p className="text-[#6b7280] text-sm mb-2">Selected Color: <span className="font-semibold text-[#1a1a1a]">{selectedColor}</span></p>
                {colorOptions.length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map(c => (
                      <button 
                        key={c}
                        onClick={() => updateProductSelection(c)}
                        className={`px-4 py-2 rounded-md border text-sm font-medium transition-all ${selectedColor === c ? 'bg-[#17402a] text-white border-[#17402a]' : 'bg-white text-[#1a1a1a] border-gray-300 hover:border-[#17402a]'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {sizeOptions.length > 0 && (
                <div className="mb-8">
                  <p className="text-[#6b7280] text-sm mb-2">Selected Size: <span className="font-semibold text-[#1a1a1a]">{selectedSize || 'None'}</span></p>
                  <div className="flex flex-wrap gap-2">
                    {sizeOptions.map(sz => (
                      <button 
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-4 py-2 rounded-md border text-sm transition-all ${selectedSize === sz ? 'bg-[#d4af37] text-black border-[#d4af37]' : 'bg-white text-[#1a1a1a] border-gray-300 hover:border-[#d4af37]'}`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-auto flex flex-col sm:flex-row gap-4 w-full">
                {outOfStock ? (
                  <button disabled className="w-full py-4 rounded-md font-bold uppercase tracking-wider bg-gray-300 text-gray-500 cursor-not-allowed">
                    Out of Stock
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={handleBuyNow}
                      className="w-full sm:w-1/2 py-4 rounded-md font-bold uppercase tracking-wider text-white transition-transform hover:-translate-y-1 active:scale-95 min-h-[44px]"
                      style={{ background: '#17402a', boxShadow: '0 4px 15px rgba(23,64,42,0.3)' }}
                    >
                      Buy Now
                    </button>
                    <button 
                      onClick={handleAddToCart}
                      className="w-full sm:w-1/2 py-4 rounded-md font-bold uppercase tracking-wider transition-transform hover:-translate-y-1 active:scale-95 min-h-[44px]"
                      style={{ background: '#f5f1e8', color: '#17402a', border: '1px solid #17402a' }}
                    >
                      Add to Cart
                    </button>
                  </>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </div>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[100000000] bg-[#17402a] text-white px-6 py-3 rounded-full shadow-lg transition-all animate-bounce">
          {toastMessage}
        </div>
      )}
    </>
  );
}
