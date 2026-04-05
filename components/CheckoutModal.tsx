"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { useCheckout } from "../context/CheckoutContext";
import { buildWhatsAppWaMeUrl, openMessengerOrder } from "../utils/orderService";

/**
 * Mirrors `socialOrderModal` in `script.js` (~L1700–1735): Complete Your Order → Direct / WhatsApp / Messenger.
 */
export default function CheckoutModal() {
  const { isOpen, closeCheckout, pendingOrder } = useCheckout();
  const [showDirectForm, setShowDirectForm] = useState(false);
  const baseId = useId();

  useEffect(() => {
    if (!isOpen) setShowDirectForm(false);
  }, [isOpen]);
  const nameId = `${baseId}-name`;
  const phoneId = `${baseId}-phone`;
  const addrId = `${baseId}-addr`;

  const handleWhatsApp = useCallback(() => {
    if (!pendingOrder) return;
    const url = buildWhatsAppWaMeUrl(pendingOrder, "", "", "");
    if (url) window.open(url, "_blank");
    closeCheckout();
    setShowDirectForm(false);
  }, [pendingOrder, closeCheckout]);

  const handleMessenger = useCallback(() => {
    /** `handleMessengerOrder` in script (~L1916): open Messenger only (no clipboard). */
    openMessengerOrder();
    closeCheckout();
    setShowDirectForm(false);
  }, [closeCheckout]);

  const [orderStatus, setOrderStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  const submitDirect = useCallback(async () => {
    const name = (document.getElementById(nameId) as HTMLInputElement | null)?.value?.trim() ?? "";
    const phone = (document.getElementById(phoneId) as HTMLInputElement | null)?.value?.trim() ?? "";
    const address = (document.getElementById(addrId) as HTMLTextAreaElement | null)?.value?.trim() ?? "";
    
    if (!name || !phone || !address) {
      [nameId, phoneId, addrId].forEach((id) => {
        const el = document.getElementById(id);
        if (el) (el as HTMLElement).style.border = "2px solid #e53935";
      });
      return;
    }
    if (!pendingOrder) return;

    setOrderStatus("submitting");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          phone,
          address,
          items: pendingOrder.items,
          totalPrice: pendingOrder.totalPrice,
          type: pendingOrder.type
        })
      });

      const data = await response.json();

      if (data.success) {
        setConfirmedOrderId(data.orderId);
        setOrderStatus("success");
      } else {
        throw new Error("Failed to place order.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit order. Please try Order on WhatsApp.");
      setOrderStatus("idle");
    }
  }, [pendingOrder, nameId, phoneId, addrId]);

  if (!isOpen || !pendingOrder) return null;

  const isCart = pendingOrder.type === "cart";
  const itemCount = pendingOrder.items.length;
  const totalPrice = pendingOrder.totalPrice;

  return (
    <div
      className="social-modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.93)",
        zIndex: 2147483647,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        fontFamily: "'Poppins', var(--font-montserrat), sans-serif",
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
    >
      <div
        style={{
          background: "#111",
          padding: 25,
          borderRadius: 15,
          textAlign: "center",
          maxWidth: 390,
          width: "100%",
          border: "1px solid #2a2a2a",
          boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
        }}
      >
        {orderStatus === "success" ? (
          <div id="modal-success-view">
            <h2 style={{ color: "#d4af37", marginBottom: 10 }}>Order Placed!</h2>
            <p style={{ color: "#fff", marginBottom: 10 }}>Thank you, we received your order.</p>
            <p style={{ color: "#d4af37", fontWeight: "bold", margin: "10px 0" }}>Order ID: {confirmedOrderId}</p>
            <p style={{ color: "#aaa", fontSize: 14 }}>We will contact you soon for confirmation.</p>
            <button
              onClick={() => {
                closeCheckout();
                setShowDirectForm(false);
                setOrderStatus("idle");
              }}
              style={{
                marginTop: 20,
                background: "#fff",
                color: "#000",
                padding: "10px 25px",
                borderRadius: 8,
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        ) : !showDirectForm ? (
          <div id="modal-order-options">
            <h3 id="checkout-modal-title" style={{ color: "#fff", margin: "0 0 6px", fontSize: "1.1rem" }}>
              Complete Your Order
            </h3>
            {isCart ? (
              <p style={{ color: "#d4af37", fontSize: "0.8rem", margin: "0 0 18px" }}>
                {itemCount} item(s) • Total: TK {totalPrice}
              </p>
            ) : (
              <p style={{ color: "#aaa", fontSize: "0.8rem", margin: "0 0 18px" }}>Total: TK {totalPrice}</p>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              <button
                type="button"
                onClick={() => setShowDirectForm(true)}
                style={{
                  background: "#d4af37",
                  color: "#000",
                  padding: 14,
                  borderRadius: 10,
                  border: "none",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: 15,
                }}
              >
                Direct Order (Cash on Delivery)
              </button>
              <button
                type="button"
                onClick={handleWhatsApp}
                style={{
                  background: "#25D366",
                  color: "#fff",
                  padding: 13,
                  borderRadius: 10,
                  border: "none",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: 15,
                }}
              >
                Order on WhatsApp
              </button>
              <button
                type="button"
                onClick={handleMessenger}
                style={{
                  background: "#0084FF",
                  color: "#fff",
                  padding: 13,
                  borderRadius: 10,
                  border: "none",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: 15,
                }}
              >
                Order on Messenger
              </button>
            </div>
          </div>
        ) : (
          <div id="modal-direct-form" style={{ textAlign: "left" }}>
            <h3 style={{ color: "#fff", margin: "0 0 15px", textAlign: "center" }}>Shipping Details</h3>
            <label htmlFor={nameId} style={{ color: "#aaa", fontSize: "0.78rem", display: "block", marginBottom: 4 }}>
              Full Name
            </label>
            <input
              id={nameId}
              type="text"
              placeholder="e.g. Rahim Uddin"
              autoComplete="name"
              style={{
                width: "100%",
                padding: 12,
                marginBottom: 12,
                borderRadius: 8,
                border: "1px solid #444",
                background: "#000",
                color: "#fff",
                boxSizing: "border-box",
              }}
            />
            <label htmlFor={phoneId} style={{ color: "#aaa", fontSize: "0.78rem", display: "block", marginBottom: 4 }}>
              Phone Number
            </label>
            <input
              id={phoneId}
              type="tel"
              placeholder="01XXXXXXXXX"
              autoComplete="tel"
              style={{
                width: "100%",
                padding: 12,
                marginBottom: 12,
                borderRadius: 8,
                border: "1px solid #444",
                background: "#000",
                color: "#fff",
                boxSizing: "border-box",
              }}
            />
            <label htmlFor={addrId} style={{ color: "#aaa", fontSize: "0.78rem", display: "block", marginBottom: 4 }}>
              Full Address
            </label>
            <textarea
              id={addrId}
              placeholder="Area / Road / City"
              rows={3}
              autoComplete="street-address"
              style={{
                width: "100%",
                padding: 12,
                marginBottom: 15,
                borderRadius: 8,
                border: "1px solid #444",
                background: "#000",
                color: "#fff",
                boxSizing: "border-box",
                resize: "none",
              }}
            />
            <button
              type="button"
              onClick={submitDirect}
              disabled={orderStatus === "submitting"}
              style={{
                width: "100%",
                background: "#d4af37",
                color: "#000",
                padding: 14,
                borderRadius: 8,
                border: "none",
                fontWeight: "bold",
                cursor: orderStatus === "submitting" ? "not-allowed" : "pointer",
                fontSize: 15,
                opacity: orderStatus === "submitting" ? 0.7 : 1,
              }}
            >
              {orderStatus === "submitting" ? "Placing Order..." : "Confirm Order"}
            </button>
            <button
              type="button"
              onClick={() => setShowDirectForm(false)}
              style={{
                width: "100%",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#ccc",
                padding: 14,
                borderRadius: 10,
                marginTop: 12,
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.3s ease",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.color = "#fff"; 
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                e.currentTarget.style.color = "#ccc"; 
              }}
            >
              ← Back
            </button>
          </div>
        )}

        {orderStatus !== "success" && !showDirectForm && (
          <button
            type="button"
            onClick={() => {
              closeCheckout();
              setShowDirectForm(false);
            }}
            style={{ marginTop: 22, background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 13, textDecoration: "underline" }}
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
}
