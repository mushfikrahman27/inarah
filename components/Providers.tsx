"use client";

import type { ReactNode } from "react";
import { CartProvider } from "../context/CartContext";
import { CheckoutProvider } from "../context/CheckoutContext";
import { ProductCatalogProvider } from "../context/ProductCatalogContext";
import { SearchProvider } from "../context/SearchContext";
import { ProductDetailsProvider } from "../context/ProductDetailsContext";
import { ToastProvider, useToast } from "../context/ToastContext";
import CartDrawer from "./CartDrawer";
import ProductDetails from "./ProductDetails";
import { ToastContainer } from "./Toast";

function ToastComponents() {
  const { toasts, removeToast } = useToast();
  return <ToastContainer toasts={toasts} onRemove={removeToast} />;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <SearchProvider>
        <ProductCatalogProvider>
          <ProductDetailsProvider>
            <CartProvider>
              <CheckoutProvider>
                {children}
                <CartDrawer />
                <ProductDetails />
                <ToastComponents />
              </CheckoutProvider>
            </CartProvider>
          </ProductDetailsProvider>
        </ProductCatalogProvider>
      </SearchProvider>
    </ToastProvider>
  );
}
