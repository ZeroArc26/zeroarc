/**
 * DUMMY PRODUCT DATA
 * ------------------------------------------------------------------
 * Shaped EXACTLY like the real MongoDB Product document (basicInfo,
 * pricing, images, variants, publish, etc.) so that swapping this
 * out for a real `Product.find(...)` call before launch is a
 * drop-in replacement — no component changes needed.
 * ------------------------------------------------------------------
 */

export interface DummyProduct {
  _id: string;
  basicInfo: {
    title: string;
    slug: string;
    description: string;
    brand: string;
    category: string;
    audience: "men" | "women" | "unisex";
    tags: string[];
  };
  pricing: {
    sellingPrice: number;
    comparePrice?: number;
  };
  images: { url: string; alt?: string; isCover?: boolean; order?: number }[];
  variants: {
    id: string;
    color: string;
    colorHex?: string;
    size: string;
    sku: string;
    price: number;
    stock: number;
    image?: string;
    isActive?: boolean;
  }[];
  averageRating?: number;
  reviewCount?: number;
  publish?: {
    featured?: boolean;
    status?: "active" | "draft" | "archived";
  };
}

export const DUMMY_PRODUCTS: DummyProduct[] = [
  {
    _id: "dummy-001",
    basicInfo: {
      title: "Arc Beginning",
      slug: "arc-beginning",
      description:
        "Step into the story with the Arc Beginning tee. Inspired by silent warriors and untold legends, this design reflects discipline, loyalty and the power of solitude.",
      brand: "ZeroArc",
      category: "Anime Oversized",
      audience: "men",
      tags: ["anime", "oversized"],
    },
    pricing: { sellingPrice: 999, comparePrice: 1299 },
    images: [{ url: "/images/products/arc-beginning/arc-beginning-black.webp", isCover: true, order: 0 }],
    variants: [
      { id: "v1", color: "Black", colorHex: "#000000", size: "S", sku: "AB-BLK-S", price: 999, stock: 20 },
      { id: "v2", color: "Black", colorHex: "#000000", size: "M", sku: "AB-BLK-M", price: 999, stock: 25 },
      { id: "v3", color: "Black", colorHex: "#000000", size: "L", sku: "AB-BLK-L", price: 999, stock: 18 },
      { id: "v4", color: "Black", colorHex: "#000000", size: "XL", sku: "AB-BLK-XL", price: 999, stock: 12 },
    ],
    averageRating: 4.6,
    reviewCount: 128,
    publish: { featured: true, status: "active" },
  },
  {
    _id: "dummy-002",
    basicInfo: {
      title: "Chaos Control",
      slug: "chaos-control",
      description:
        "Embrace the storm within. The Chaos Control tee blends bold anime graphics with premium oversized comfort for everyday streetwear domination.",
      brand: "ZeroArc",
      category: "Oversized T-Shirts",
      audience: "men",
      tags: ["oversized", "streetwear"],
    },
    pricing: { sellingPrice: 1199, comparePrice: 1499 },
    images: [{ url: "/images/products/chaos-control/chaos-control-black.webp", isCover: true, order: 0 }],
    variants: [
      { id: "v1", color: "Black", colorHex: "#000000", size: "S", sku: "CC-BLK-S", price: 1199, stock: 15 },
      { id: "v2", color: "Black", colorHex: "#000000", size: "M", sku: "CC-BLK-M", price: 1199, stock: 20 },
      { id: "v3", color: "Black", colorHex: "#000000", size: "L", sku: "CC-BLK-L", price: 1199, stock: 16 },
    ],
    averageRating: 4.7,
    reviewCount: 156,
    publish: { featured: true, status: "active" },
  },
  {
    _id: "dummy-003",
    basicInfo: {
      title: "Future Unknown",
      slug: "future-unknown",
      description:
        "The path ahead is unwritten. Future Unknown captures that liminal anime aesthetic — moody, atmospheric, and endlessly wearable.",
      brand: "ZeroArc",
      category: "Hoodies",
      audience: "men",
      tags: ["hoodie", "anime"],
    },
    pricing: { sellingPrice: 999 },
    images: [{ url: "/images/products/future-unknown/future-unknown-black.webp", isCover: true, order: 0 }],
    variants: [
      { id: "v1", color: "Black", colorHex: "#000000", size: "M", sku: "FU-BLK-M", price: 999, stock: 10 },
      { id: "v2", color: "Black", colorHex: "#000000", size: "L", sku: "FU-BLK-L", price: 999, stock: 14 },
      { id: "v3", color: "Black", colorHex: "#000000", size: "XL", sku: "FU-BLK-XL", price: 999, stock: 9 },
    ],
    averageRating: 4.4,
    reviewCount: 76,
    publish: { featured: false, status: "active" },
  },
  {
    _id: "dummy-004",
    basicInfo: {
      title: "Shadow Within",
      slug: "shadow-within",
      description:
        "Every hero carries a shadow. This piece explores duality through striking monochrome anime linework on 240 GSM premium cotton.",
      brand: "ZeroArc",
      category: "Anime Oversized",
      audience: "unisex",
      tags: ["anime", "limited"],
    },
    pricing: { sellingPrice: 1099, comparePrice: 1399 },
    images: [{ url: "/images/products/shadow-within/shadow-within-black.webp", isCover: true, order: 0 }],
    variants: [
      { id: "v1", color: "Black", colorHex: "#000000", size: "S", sku: "SW-BLK-S", price: 1099, stock: 8 },
      { id: "v2", color: "Black", colorHex: "#000000", size: "M", sku: "SW-BLK-M", price: 1099, stock: 12 },
      { id: "v3", color: "White", colorHex: "#ffffff", size: "M", sku: "SW-WHT-M", price: 1099, stock: 11 },
      { id: "v4", color: "White", colorHex: "#ffffff", size: "L", sku: "SW-WHT-L", price: 1099, stock: 7 },
    ],
    averageRating: 4.3,
    reviewCount: 103,
    publish: { featured: false, status: "active" },
  },
  {
    _id: "dummy-005",
    basicInfo: {
      title: "Red Eclipse",
      slug: "red-eclipse",
      description:
        "A bold crimson-accented anime print for those who like to stand out. Relaxed fit, breathable fabric, built for everyday wear.",
      brand: "ZeroArc",
      category: "Oversized T-Shirts",
      audience: "men",
      tags: ["oversized", "bold"],
    },
    pricing: { sellingPrice: 999 },
    images: [{ url: "/images/products/arc-beginning/arc-beginning-black.webp", isCover: true, order: 0 }],
    variants: [
      { id: "v1", color: "White", colorHex: "#ffffff", size: "M", sku: "RE-WHT-M", price: 999, stock: 10 },
      { id: "v2", color: "White", colorHex: "#ffffff", size: "L", sku: "RE-WHT-L", price: 999, stock: 13 },
    ],
    averageRating: 4.5,
    reviewCount: 98,
    publish: { featured: false, status: "active" },
  },
  {
    _id: "dummy-006",
    basicInfo: {
      title: "Silent Assassin",
      slug: "silent-assassin",
      description:
        "Move in silence. A minimal, moody design paired with an oversized drop-shoulder silhouette for that effortless streetwear edge.",
      brand: "ZeroArc",
      category: "Sweatshirts",
      audience: "men",
      tags: ["sweatshirt", "minimal"],
    },
    pricing: { sellingPrice: 999 },
    images: [{ url: "/images/products/chaos-control/chaos-control-black.webp", isCover: true, order: 0 }],
    variants: [
      { id: "v1", color: "Black", colorHex: "#000000", size: "M", sku: "SA-BLK-M", price: 999, stock: 14 },
      { id: "v2", color: "Black", colorHex: "#000000", size: "L", sku: "SA-BLK-L", price: 999, stock: 12 },
      { id: "v3", color: "Black", colorHex: "#000000", size: "XL", sku: "SA-BLK-XL", price: 999, stock: 9 },
    ],
    averageRating: 4.5,
    reviewCount: 103,
    publish: { featured: false, status: "active" },
  },
  {
    _id: "dummy-007",
    basicInfo: {
      title: "Void Walker",
      slug: "void-walker",
      description:
        "Walk between worlds. A striking full-back anime graphic printed on soft, durable cotton for all-day comfort.",
      brand: "ZeroArc",
      category: "Anime Oversized",
      audience: "men",
      tags: ["anime", "oversized"],
    },
    pricing: { sellingPrice: 999 },
    images: [{ url: "/images/products/future-unknown/future-unknown-black.webp", isCover: true, order: 0 }],
    variants: [
      { id: "v1", color: "Black", colorHex: "#000000", size: "S", sku: "VW-BLK-S", price: 999, stock: 11 },
      { id: "v2", color: "Black", colorHex: "#000000", size: "M", sku: "VW-BLK-M", price: 999, stock: 15 },
    ],
    averageRating: 4.6,
    reviewCount: 119,
    publish: { featured: true, status: "active" },
  },
  {
    _id: "dummy-008",
    basicInfo: {
      title: "Eternal Night",
      slug: "eternal-night",
      description:
        "For those who thrive after dark. A deep, atmospheric anime design paired with premium oversized construction.",
      brand: "ZeroArc",
      category: "Jackets",
      audience: "men",
      tags: ["jacket", "limited"],
    },
    pricing: { sellingPrice: 1499 },
    images: [{ url: "/images/products/shadow-within/shadow-within-black.webp", isCover: true, order: 0 }],
    variants: [
      { id: "v1", color: "Black", colorHex: "#000000", size: "M", sku: "EN-BLK-M", price: 1499, stock: 6 },
      { id: "v2", color: "Black", colorHex: "#000000", size: "L", sku: "EN-BLK-L", price: 1499, stock: 5 },
    ],
    averageRating: 4.4,
    reviewCount: 88,
    publish: { featured: false, status: "active" },
  },
  {
  _id: "dummy-009",
  basicInfo: {
    title: "Limitless Aura",
    slug: "limitless-aura",
    description:
      "A dreamy, pastel-toned anime print designed for an easy, relaxed oversized fit. Soft-touch cotton that feels as good as it looks.",
    brand: "ZeroArc",
    category: "Oversized T-Shirts",
    audience: "women",
    tags: ["oversized", "anime"],
  },
  pricing: { sellingPrice: 999, comparePrice: 1299 },
  images: [{ url: "/images/products/chaos-control/chaos-control-black.webp", isCover: true, order: 0 }],
  variants: [
    { id: "v1", color: "Black", colorHex: "#000000", size: "S", sku: "LA-BLK-S", price: 999, stock: 14 },
    { id: "v2", color: "Black", colorHex: "#000000", size: "M", sku: "LA-BLK-M", price: 999, stock: 18 },
    { id: "v3", color: "White", colorHex: "#ffffff", size: "M", sku: "LA-WHT-M", price: 999, stock: 12 },
  ],
  averageRating: 4.7,
  reviewCount: 156,
  publish: { featured: true, status: "active" },
},
{
  _id: "dummy-010",
  basicInfo: {
    title: "Violet Void",
    slug: "violet-void",
    description:
      "Step into the void with this striking violet-accented anime graphic tee. Relaxed drop-shoulder cut for all-day comfort.",
    brand: "ZeroArc",
    category: "Anime Oversized",
    audience: "women",
    tags: ["anime", "oversized"],
  },
  pricing: { sellingPrice: 999 },
  images: [{ url: "/images/products/future-unknown/future-unknown-black.webp", isCover: true, order: 0 }],
  variants: [
    { id: "v1", color: "White", colorHex: "#ffffff", size: "S", sku: "VV-WHT-S", price: 999, stock: 10 },
    { id: "v2", color: "White", colorHex: "#ffffff", size: "M", sku: "VV-WHT-M", price: 999, stock: 13 },
  ],
  averageRating: 4.4,
  reviewCount: 112,
  publish: { featured: false, status: "active" },
},
{
  _id: "dummy-011",
  basicInfo: {
    title: "Purple Haze",
    slug: "purple-haze",
    description:
      "A hazy, dreamlike anime portrait wrapped around a soft oversized silhouette — comfortable enough for everyday, bold enough to stand out.",
    brand: "ZeroArc",
    category: "Hoodies",
    audience: "women",
    tags: ["hoodie", "anime"],
  },
  pricing: { sellingPrice: 1199 },
  images: [{ url: "/images/products/arc-beginning/arc-beginning-black.webp", isCover: true, order: 0 }],
  variants: [
    { id: "v1", color: "Black", colorHex: "#000000", size: "S", sku: "PH-BLK-S", price: 1199, stock: 9 },
    { id: "v2", color: "Black", colorHex: "#000000", size: "M", sku: "PH-BLK-M", price: 1199, stock: 11 },
  ],
  averageRating: 4.3,
  reviewCount: 76,
  publish: { featured: false, status: "active" },
},
];