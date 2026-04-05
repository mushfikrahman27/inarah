import type { Product } from "../data/products";
import { effectivePriceForFilter } from "../data/products";
import type { OrderContext } from "./orderService";

/** Aligns with `triggerOrderFlow` / `currentOrderContext` in script.js */
export function buildOrderContextForProduct(
  p: Product,
  selectedColor: string,
  selectedSize: string,
): OrderContext {
  const price = effectivePriceForFilter(p);
  return {
    type: "single",
    items: [
      {
        productId: p.id,
        productName: p.name,
        productSize: selectedSize || "N/A",
        price,
        color: selectedColor,
      },
    ],
    totalPrice: price,
  };
}

export function defaultColorForProduct(p: Product): string {
  const list = p.colors?.length ? p.colors : [p.color];
  return list[0] || "Black";
}

export function defaultSizeForProduct(p: Product): string {
  const s = p.sizes?.filter(Boolean);
  return s?.length ? s[0]! : "N/A";
}
