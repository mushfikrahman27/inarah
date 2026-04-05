/**
 * Product catalog from the vanilla site (`script.js` → `fallbackProducts`).
 * Zip uses `images/...`; Next.js serves `public/` at `/`, so canonical paths are `/images/...`.
 */
export type Product = {
  id: number;
  name: string;
  price: string | number;
  color: string;
  colors?: string[];
  /** Color label → image path (`/images/...`) — matches `index.html` + `openProductDetails` gallery in script.js */
  colorImages?: Record<string, string>;
  /** Size options on cards / PDP; script `buildSizeOptionsHTML` can be empty — default one size is OK */
  sizes?: string[];
  img: string;
  category: string;
  subCategory: string;
  description: string;
  care: string;
  stock?: number;
  isActive?: boolean;
};

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Sparkling Clutch Purse",
    price: "TBA",
    color: "Multicolor",
    colors: ["Black", "Diamond Silver", "Golden"],
    colorImages: {
      Black: "/images/BIS-1.png",
      "Diamond Silver": "/images/DIS-1.png",
      Golden: "/images/GIS-1.png",
    },
    sizes: ["One Size"],
    /** Default listing image — matches `index.html` variant map default (`images/BIS-1.png`). */
    img: "/images/BIS-1.png",
    category: "Women",
    subCategory: "PURSE",
    description: "A premium, sparkling clutch purse for the modern individual.",
    care: "Handle with care. Avoid contact with water.",
  },
  {
    id: 2,
    name: "Dual-zip Crossbody Bag",
    price: "TBA",
    color: "Blue",
    colors: ["Blue", "Black"],
    colorImages: {
      Blue: "/images/fbn-55.jpeg",
      Black: "/images/fbc-54.jpeg",
    },
    sizes: ["One Size"],
    img: "/images/fbn-55.jpeg",
    category: "Women",
    subCategory: "HANDBAG",
    description: "Premium dual-zip design with high-quality finish, perfect for daily use and stylish outings.",
    care: "Wipe with a clean, dry cloth to remove dust.",
  },
  {
    id: 3,
    name: "Heart-Shaped Sparkling Clutch Purse",
    price: "TBA",
    color: "Black",
    colors: ["Black", "Pink", "Golden", "Silver"],
    colorImages: {
      Black: "/images/BIH-1.png",
      Pink: "/images/PIH_1.png",
      Golden: "/images/GIH-1.png",
      Silver: "/images/DIH-1.png",
    },
    sizes: ["One Size"],
    img: "/images/BIH-1.png",
    category: "Women",
    subCategory: "PURSE",
    description: "An elegant and eye-catching heart-shaped clutch, featuring a sparkling finish perfect for parties, weddings, and premium events.",
    care: "Handle with care. Avoid contact with water.",
  },
  {
    id: 4,
    name: "Evening Clutch Purse",
    price: "TBA",
    color: "White",
    colors: ["White", "Golden", "Silver"],
    colorImages: {
      White: "/images/MIC-348.png",
      Golden: "/images/MIG-302.png",
      Silver: "/images/MIS-357.png",
    },
    sizes: ["One Size"],
    img: "/images/MIC-348.png",
    category: "Women",
    subCategory: "PURSE",
    description: "A high-end evening clutch designed for luxury events. Features a sophisticated finish that complements formal attire.",
    care: "Handle with care. Avoid contact with water.",
  },
];

export function parsePriceValue(price: string | number): number {
  if (typeof price === "number") return price > 0 ? price : 0;
  const n = parseInt(String(price).replace(/[^0-9.]/g, ""), 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function effectivePriceForFilter(p: Product): number {
  const v = parsePriceValue(p.price);
  return v > 0 ? v : 1500;
}

/** Maps `images/foo.png` or `/images/foo.png` to a public URL for `<Image src>`. */
export function normalizePublicImagePath(path: string): string {
  const p = (path || "").trim();
  if (!p) return "/images/BIS-1.png";
  if (p.startsWith("/")) return p;
  return `/${p.replace(/^\/+/, "")}`;
}
