export interface Product {
  _id?: string;

  title: string;
  slug: string;

  description: string;

  price: number;
  comparePrice?: number;

  category: string;
  collection: string;

  images: string[];

  sizes: string[];

  colors: string[];

  stock: number;

  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;

  active?: boolean;
}