"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PRODUCTS as BASE_PRODUCTS, type Product } from "../data/products";

const STORAGE_KEY = "inarah_catalog_extra_products";

function loadExtraFromStorage(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as Product[];
  } catch {
    return [];
  }
}

function nextProductId(existing: Product[]): number {
  const ids = existing.map((p) => (typeof p.id === "number" ? p.id : 0));
  const max = ids.length ? Math.max(...ids) : 0;
  return max + 1;
}

type ProductCatalogContextValue = {
  /** Base (`data/products.ts`) merged with admin-added items from localStorage */
  products: Product[];
  addProduct: (input: Omit<Product, "id">) => Product;
};

const ProductCatalogContext = createContext<ProductCatalogContextValue | null>(null);

export function ProductCatalogProvider({ children }: { children: ReactNode }) {
  const [extra, setExtra] = useState<Product[]>([]);

  useEffect(() => {
    setExtra(loadExtraFromStorage());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(extra));
    } catch {
      // ignore quota / private mode
    }
  }, [extra]);

  const products = useMemo(() => {
    const byId = new Map<number, Product>();
    for (const p of BASE_PRODUCTS) {
      byId.set(p.id, p);
    }
    for (const p of extra) {
      byId.set(p.id, p);
    }
    return Array.from(byId.values()).sort((a, b) => a.id - b.id);
  }, [extra]);

  const addProduct = useCallback(
    (input: Omit<Product, "id">) => {
      const id = nextProductId([...BASE_PRODUCTS, ...extra]);
      const created: Product = { ...input, id };
      setExtra((prev) => [...prev, created]);
      return created;
    },
    [extra],
  );

  const value = useMemo(() => ({ products, addProduct }), [products, addProduct]);

  return <ProductCatalogContext.Provider value={value}>{children}</ProductCatalogContext.Provider>;
}

export function useProductCatalog() {
  const ctx = useContext(ProductCatalogContext);
  if (!ctx) {
    throw new Error("useProductCatalog must be used within ProductCatalogProvider");
  }
  return ctx;
}
