import { FeaturedProduct } from "@/types/featured-product";

export const FEATURED_PRODUCTS: FeaturedProduct[] = [
  {
    id: 1,

    slug: "arc-beginning",

    name: "Arc Beginning",

    price: 999,

    originalPrice: 1299,

    tag: "BEST SELLER",

    category: "Oversized T-Shirt",

    collectionName: "ZeroArc Originals",

    sizes: ["S", "M", "L", "XL"],

    variants: [
      {
        id: "VAR001",
        sku: "ZA-AB-BLK",
        color: "Black",
        image: "/images/products/arc-beginning/arc-beginning-black.webp",
        stock: 25,
      },
      {
        id: "VAR002",
        sku: "ZA-AB-WHT",
        color: "White",
        image: "/images/products/arc-beginning/arc-beginning-white.webp",
        stock: 12,
      },
    ],

    rating: 4.9,

    reviews: 254,

    description:
      "Arc Beginning represents the first step of every dream. Designed for creators who believe every journey starts with one bold decision.",

    features: [
      "240 GSM Premium Cotton",
      "Oversized Fit",
      "High Quality DTG Print",
      "Pre-Shrunk Fabric",
      "Breathable & Soft",
    ],

    fabric: "100% Premium Cotton (240 GSM)",

    fit: "Oversized",

    featured: true,

    newArrival: true,
  },

  {
    id: 2,

    slug: "shadow-within",

    name: "Shadow Within",

    price: 1099,

    originalPrice: 1399,

    tag: "LIMITED",

    category: "Oversized T-Shirt",

    collectionName: "ZeroArc Originals",

    sizes: ["S", "M", "L", "XL"],

    variants: [
      {
        id: "VAR003",
        sku: "ZA-SW-BLK",
        color: "Black",
        image: "/images/products/shadow-within/shadow-within-black.webp",
        stock: 20,
      },
    ],

    rating: 4.8,

    reviews: 143,

    description:
      "Shadow Within reminds you that every person carries hidden strength waiting to be discovered.",

    features: [
      "240 GSM Premium Cotton",
      "Oversized Fit",
      "Premium DTG Print",
      "Fade Resistant",
      "Soft Finish",
    ],

    fabric: "100% Premium Cotton (240 GSM)",

    fit: "Oversized",

    featured: true,

    newArrival: false,
  },
    {
    id: 3,

    slug: "chaos-control",

    name: "Chaos Control",

    price: 1199,

    originalPrice: 1499,

    tag: "NEW",

    category: "Oversized T-Shirt",

    collectionName: "ZeroArc Originals",

    sizes: ["S", "M", "L", "XL"],

    variants: [
      {
        id: "VAR004",
        sku: "ZA-CC-BLK",
        color: "Black",
        image: "/images/products/chaos-control/chaos-control-black.webp",
        stock: 18,
      },
      {
        id: "VAR005",
        sku: "ZA-CC-PUR",
        color: "Purple",
        image: "/images/products/chaos-control/chaos-control-purple.webp",
        stock: 10,
      },
    ],

    rating: 4.9,

    reviews: 198,

    description:
      "Chaos Control is built for those who remain calm even when everything around them feels out of control.",

    features: [
      "240 GSM Premium Cotton",
      "Oversized Fit",
      "Premium DTG Print",
      "Ultra Soft Fabric",
      "Long Lasting Print",
    ],

    fabric: "100% Premium Cotton (240 GSM)",

    fit: "Oversized",

    featured: true,

    newArrival: true,
  },

  {
    id: 4,

    slug: "future-unknown",

    name: "Future Unknown",

    price: 999,

    originalPrice: 1299,

    tag: "TRENDING",

    category: "Oversized T-Shirt",

    collectionName: "ZeroArc Originals",

    sizes: ["S", "M", "L", "XL"],

    variants: [
      {
        id: "VAR006",
        sku: "ZA-FU-BLK",
        color: "Black",
        image: "/images/products/future-unknown/future-unknown-black.webp",
        stock: 30,
      },
      {
        id: "VAR007",
        sku: "ZA-FU-BEI",
        color: "Beige",
        image: "/images/products/future-unknown/future-unknown-beige.webp",
        stock: 14,
      },
      {
        id: "VAR008",
        sku: "ZA-FU-WHT",
        color: "White",
        image: "/images/products/future-unknown/future-unknown-white.webp",
        stock: 8,
      },
    ],

    rating: 4.7,

    reviews: 127,

    description:
      "Future Unknown is made for dreamers who aren't afraid to step into the unknown and create their own path.",

    features: [
      "240 GSM Premium Cotton",
      "Oversized Fit",
      "Premium DTG Print",
      "Pre-Shrunk Fabric",
      "Comfort Stretch Neck",
    ],

    fabric: "100% Premium Cotton (240 GSM)",

    fit: "Oversized",

    featured: false,

    newArrival: true,
  },
];