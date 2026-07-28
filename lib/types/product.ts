export type ProductStatus =
  | "draft"
  | "active"
  | "archived";

export type TaxClass =
  | "0"
  | "5"
  | "12"
  | "18"
  | "28";

export type DiscountType =
  | "none"
  | "percentage"
  | "fixed";

export interface ProductImage {
  url: string;
  alt: string;
  isCover: boolean;
  order: number;
}

export interface ProductVariant {
  id: string;

  name: string;

  value: string;

  priceAdjustment: number;

  stock: number;
}

export interface ProductBasicInfo {
  title: string;

  slug: string;

  description: string;

  brand: string;

  category: string;

  tags: string[];
}

export interface ProductPricing {
  sellingPrice: number;

  comparePrice?: number;

  costPrice: number;

  taxClass: TaxClass;

  discountType: DiscountType;

  discountValue: number;
}

export interface ProductInventory {
  sku: string;

  barcode?: string;

  quantity: number;

  lowStockThreshold: number;

  trackInventory: boolean;

  allowBackorders: boolean;
}

export interface ProductSEO {
  metaTitle?: string;

  metaDescription?: string;

  keywords: string[];
}

export interface ProductPublish {
  status: ProductStatus;

  featured: boolean;

  publishedAt?: Date;
}

export interface Product {
  basicInfo: ProductBasicInfo;

  pricing: ProductPricing;

  inventory: ProductInventory;

  images: ProductImage[];

  variants: ProductVariant[];

  seo: ProductSEO;

  publish: ProductPublish;
}