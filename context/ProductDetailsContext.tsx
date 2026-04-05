"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Product } from "../data/products";

type ProductDetailsContextValue = {
  activeProductId: number | null;
  openProductDetails: (id: number) => void;
  closeProductDetails: () => void;
};

const ProductDetailsContext = createContext<ProductDetailsContextValue | null>(null);

export function ProductDetailsProvider({ children }: { children: ReactNode }) {
  const [activeProductId, setActiveProductId] = useState<number | null>(null);

  const openProductDetails = (id: number) => {
    setActiveProductId(id);
  };

  const closeProductDetails = () => {
    setActiveProductId(null);
  };

  return (
    <ProductDetailsContext.Provider value={{ activeProductId, openProductDetails, closeProductDetails }}>
      {children}
    </ProductDetailsContext.Provider>
  );
}

export function useProductDetails() {
  const context = useContext(ProductDetailsContext);
  if (!context) {
    throw new Error("useProductDetails must be used within a ProductDetailsProvider");
  }
  return context;
}
