"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { OrderContext } from "../utils/orderService";
import CheckoutModal from "../components/CheckoutModal";

type CheckoutContextValue = {
  openCheckout: (ctx: OrderContext) => void;
  closeCheckout: () => void;
  pendingOrder: OrderContext | null;
  isOpen: boolean;
};

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [pendingOrder, setPendingOrder] = useState<OrderContext | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openCheckout = useCallback((ctx: OrderContext) => {
    setPendingOrder(ctx);
    setIsOpen(true);
  }, []);

  const closeCheckout = useCallback(() => {
    setIsOpen(false);
    setPendingOrder(null);
  }, []);

  const value = useMemo(
    () => ({ openCheckout, closeCheckout, pendingOrder, isOpen }),
    [openCheckout, closeCheckout, pendingOrder, isOpen],
  );

  return (
    <CheckoutContext.Provider value={value}>
      {children}
      <CheckoutModal />
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used within CheckoutProvider");
  return ctx;
}
