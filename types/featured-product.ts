export interface ProductVariant {
  id: string;
  sku: string;
  color: string;
  image: string;
  stock: number;
}

export interface FeaturedProduct {
  id: number;
  slug: string;
  name: string;
  price: number;
  originalPrice: number;
  tag: string;
  category: string;
  collectionName: string;
  sizes: string[];
  variants: ProductVariant[];
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  fabric: string;
  fit: string;
  featured: boolean;
  newArrival: boolean;
}