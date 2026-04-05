"use client";

import Image from "next/image";
import { useCart } from "../context/CartContext";
import { useCheckout } from "../context/CheckoutContext";

export default function CartDrawer() {
  const { lines, drawerOpen, setDrawerOpen, removeLine, buildCartOrderContext } = useCart();
  const { openCheckout } = useCheckout();

  if (!drawerOpen) return null;

  return (
    <div
      className={`cart-serial-overlay${drawerOpen ? " active" : ""}`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99998,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        justifyContent: "flex-end",
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
    >
      <button
        type="button"
        style={{
          position: "absolute",
          inset: 0,
          border: "none",
          background: "transparent",
          cursor: "default",
        }}
        aria-label="Close cart backdrop"
        onClick={() => setDrawerOpen(false)}
      />
      <div
        className="cart-serial-content"
        style={{
          position: "relative",
          width: "min(420px, 100%)",
          height: "100%",
          background: "#111",
          color: "#fff",
          padding: 20,
          boxSizing: "border-box",
          overflowY: "auto",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.4)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="close-btn"
          onClick={() => setDrawerOpen(false)}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            color: "#888",
            fontSize: 22,
            cursor: "pointer",
          }}
        >
          ✕
        </button>
        <h3 className="cart-title" style={{ marginTop: 8, marginBottom: 20 }}>
          Selected Items
        </h3>
        {lines.length === 0 ? (
          <p style={{ color: "#888" }}>Your cart is empty.</p>
        ) : (
          <>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {lines.map((line) => (
                <li
                  key={line.id}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    marginBottom: 16,
                    paddingBottom: 16,
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div style={{ position: "relative", width: 55, height: 65, flexShrink: 0 }}>
                    <Image src={line.img} alt="" fill sizes="55px" className="object-cover rounded" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{line.name}</p>
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "#aaa" }}>
                      {line.color} · {line.size}
                    </p>
                    <p style={{ margin: "4px 0 0", fontSize: 13 }}>TK {line.unitPrice}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLine(line.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ff6b6b",
                      cursor: "pointer",
                      fontSize: 18,
                    }}
                    aria-label="Remove item"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="checkout-buy-btn"
              style={{
                width: "100%",
                marginTop: 12,
                padding: 14,
                background: "var(--accent-champagne, #d4af37)",
                color: "#000",
                fontWeight: "bold",
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
              }}
              onClick={() => {
                const ctx = buildCartOrderContext();
                if (!ctx) return;
                setDrawerOpen(false);
                openCheckout(ctx);
              }}
            >
              Buy Now
            </button>
          </>
        )}
      </div>
    </div>
  );
}
