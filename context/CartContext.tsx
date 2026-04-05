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
import type { Product } from "../data/products";
import { effectivePriceForFilter, normalizePublicImagePath } from "../data/products";
import type { OrderContext, OrderContextItem } from "../utils/orderService";
import { useToast } from "./ToastContext";

const CART_STORAGE_KEY = "policia_cart";

export type CartLine = {
  id: string;
  productId: number;
  name: string;
  img: string;
  color: string;
  size: string;
  unitPrice: number;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  addToCart: (product: Product, opts: { color: string; size: string }) => void;
  removeLine: (lineId: string) => void;
  buildCartOrderContext: () => OrderContext | null;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadInitialLines(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x) => x && typeof (x as CartLine).productId === "number") as CartLine[];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    setLines(loadInitialLines());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // ignore
    }
  }, [lines]);

  const count = lines.length;

  const addToCart = useCallback((product: Product, opts: { color: string; size: string }) => {
    const unitPrice = effectivePriceForFilter(product);
    const line: CartLine = {
      id: `${product.id}-${opts.color}-${opts.size}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      img: normalizePublicImagePath(product.img),
      color: opts.color,
      size: opts.size,
      unitPrice,
    };
    setLines((prev) => [...prev, line]);
    
    // Show toast notification for successful addition
    addToast(
      `${product.name} (${opts.color}, ${opts.size}) added to cart`,
      "success",
      3000
    );
  }, [addToast]);

  const removeLine = useCallback((lineId: string) => {
    setLines((prev) => prev.filter((l) => l.id !== lineId));
  }, []);

  const buildCartOrderContext = useCallback((): OrderContext | null => {
    if (lines.length === 0) return null;
    const items: OrderContextItem[] = lines.map((l) => ({
      productId: l.productId,
      productName: l.name,
      productSize: l.size,
      price: l.unitPrice,
      color: l.color,
    }));
    const totalPrice = items.reduce((s, it) => {
      const n = typeof it.price === "number" ? it.price : Number(it.price);
      return s + (Number.isFinite(n) ? n : 0);
    }, 0);
    return { type: "cart", items, totalPrice };
  }, [lines]);

  const value = useMemo(
    () => ({
      lines,
      count,
      drawerOpen,
      setDrawerOpen,
      addToCart,
      removeLine,
      buildCartOrderContext,
    }),
    [lines, count, drawerOpen, addToCart, removeLine, buildCartOrderContext],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
