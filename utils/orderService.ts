/**
 * WhatsApp / Messenger order helpers — consolidated from `website/script.js`
 * (ORDER REDIRECTION ENGINE, SOCIAL_CONFIG, `createOrderInRTDB` payload shape).
 *
 * Canonical message bodies (see `buildWhatsAppURL` / `getOrderDetails` in script.js ~L1814–1860):
 * - WhatsApp: `*New Order from Website*` + `--------------------------` separators + `Please confirm ...`
 * - Messenger clipboard (plain text, no markdown asterisks): same content minus `*` on the title line.
 *
 * Legacy quick-buy from product card (`handleSingleBuy` ~L1084–1088): `Hello! I want to Buy: ${name} (Color: ${color}), Total Price: TK ${price}`
 */

export const SOCIAL_CONFIG = {
  whatsappNumber: "8801636441108",
  messengerLink: "https://m.me/inarah_mb",
} as const;

export const WA_NUMBER = "8801636441108";
export const MESSENGER_LINK = "https://m.me/inarah_mb";

export type OrderChannel = "whatsapp" | "messenger" | "direct";

/** Matches `currentOrderContext.items` in script.js */
export type OrderContextItem = {
  productId: string | number;
  productName: string;
  productSize?: string;
  price: number | string;
  color?: string;
};

export type OrderContext = {
  type: "single" | "cart";
  items: OrderContextItem[];
  totalPrice: number;
};

export function generateOrderId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const time = now
    .toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" })
    .replace(/:/g, "");
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `ORD-${year}${month}${day}-${time}-${random}`;
}

/** Same normalization as `getOrderDetails` in script.js (price fallback 1500). */
function normalizeItemPrice(price: number | string): number {
  const n = parseInt(String(price).replace(/[^0-9.]/g, ""), 10);
  return Number.isFinite(n) && n > 0 ? n : 1500;
}

/**
 * Mirrors `getOrderDetails(customerName, customerPhone, customerAddress)` in script.js
 * (uses `currentOrderContext` there; we pass `ctx` explicitly).
 */
export function getOrderDetails(
  ctx: OrderContext,
  customerName: string,
  customerPhone: string,
  customerAddress: string,
) {
  const items = ctx.items.map((it) => ({
    name: it.productName,
    color: it.color || "Black",
    price: normalizeItemPrice(it.price),
  }));
  const totalPrice = items.reduce((s, it) => s + it.price, 0);

  let productLines = "";
  if (items.length === 1) {
    productLines = `Product: ${items[0].name}\nColor: ${items[0].color}\nPrice: ${items[0].price} TK`;
  } else {
    productLines = items.map((it, i) => `${i + 1}. ${it.name} (${it.color}) — ${it.price} TK`).join("\n");
    productLines += `\nTotal: ${totalPrice} TK`;
  }

  const custSection =
    customerName && customerPhone
      ? `\nCustomer: ${customerName}\nPhone: ${customerPhone}${customerAddress ? "\nAddress: " + customerAddress : ""}`
      : "";

  return { productLines, totalPrice, custSection, items };
}

/** Plain-text block for Messenger clipboard (no markdown asterisks on title line). */
export function buildMessengerOrderText(ctx: OrderContext): string {
  const d = getOrderDetails(ctx, "", "", "");
  return `New Order from Website
--------------------------
${d.productLines}${d.custSection}
--------------------------
Please confirm availability and delivery. Thank you!`;
}

/**
 * Exact `message` template from `buildWhatsAppURL` in script.js (lines ~1852–1857).
 */
export function buildWhatsAppMessage(
  ctx: OrderContext,
  customerName: string,
  customerPhone: string,
  customerAddress: string,
): string | null {
  const details = getOrderDetails(ctx, customerName, customerPhone, customerAddress);
  if (!details) return null;
  return `*New Order from Website*
--------------------------
${details.productLines}${details.custSection}
--------------------------
Please confirm availability and delivery. Thank you!`;
}

/** `https://wa.me/{number}?text=...` — same as script `buildWhatsAppURL` return. */
export function buildWhatsAppWaMeUrl(
  ctx: OrderContext,
  customerName: string,
  customerPhone: string,
  customerAddress: string,
): string | null {
  const msg = buildWhatsAppMessage(ctx, customerName, customerPhone, customerAddress);
  if (!msg) return null;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

/** `https://api.whatsapp.com/send?phone=...&text=...` — used in `openOrderOptions` (~L1041). */
export function buildWhatsAppApiUrl(encodedMessage: string): string {
  return `https://api.whatsapp.com/send?phone=${SOCIAL_CONFIG.whatsappNumber}&text=${encodedMessage}`;
}

/**
 * Same as `openOrderOptions` with `encodeURIComponent(fullMessage)` for WhatsApp.
 */
export function buildWhatsAppApiUrlFromContext(
  ctx: OrderContext,
  customerName: string,
  customerPhone: string,
  customerAddress: string,
): string | null {
  const msg = buildWhatsAppMessage(ctx, customerName, customerPhone, customerAddress);
  if (!msg) return null;
  return buildWhatsAppApiUrl(encodeURIComponent(msg));
}

/**
 * Messenger: copy message, toast, then open m.me (script `copyAndRedirectMessenger` ~L1056–1072).
 */
export async function copyAndRedirectMessenger(
  message: string,
  options?: {
    messengerLink?: string;
    delayMs?: number;
    onToast?: (msg: string) => void;
  },
): Promise<void> {
  const link = options?.messengerLink ?? MESSENGER_LINK;
  const delayMs = options?.delayMs ?? 1200;

  try {
    await navigator.clipboard.writeText(message);
    options?.onToast?.("Order details copied! Please paste it in Messenger.");
  } catch {
    window.open(link, "_blank");
    return;
  }

  await new Promise((r) => setTimeout(r, delayMs));
  window.open(link, "_blank");
}

/** Payload for RTDB `orders` push (aligned with `saveOrderInBackground` in script.js ~L1864–1882). */
export function buildOrderPayloadForRtdb(
  channel: OrderChannel,
  ctx: OrderContext,
  customerName: string,
  customerPhone: string,
  customerAddress: string,
) {
  return {
    channel,
    customerName: customerName || "",
    phone: customerPhone || "",
    address: customerAddress || "",
    items: ctx.items.map((it) => ({
      productId: it.productId,
      name: it.productName,
      price: normalizeItemPrice(it.price),
      color: it.color || "Black",
    })),
    total: ctx.totalPrice,
    createdAt: Date.now(),
    status: "pending" as const,
  };
}

/** Opens WhatsApp in a new tab (quick order — no customer form). Matches `handleWhatsAppOrder` (~L1903–1913). */
export function openWhatsAppOrder(ctx: OrderContext): void {
  const url = buildWhatsAppWaMeUrl(ctx, "", "", "");
  if (url) window.open(url, "_blank");
}

/** Matches `handleMessengerOrder` (~L1916–1921) — no pre-fill; opens `MESSENGER_LINK`. */
export function openMessengerOrder(): void {
  window.open(MESSENGER_LINK, "_blank");
}

/**
 * Legacy `handleSingleBuy` / `openOrderOptions` message (~L1088) — not used by the new modal engine,
 * exported for parity with older flows.
 */
export function buildLegacyCardOrderMessage(name: string, color: string, priceDisplay: string): string {
  return `Hello! I want to Buy: ${name} (Color: ${color}), Total Price: TK ${priceDisplay}`;
}
