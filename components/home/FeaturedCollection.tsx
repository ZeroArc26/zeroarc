"use client";

import { useEffect, useState } from "react";

import SectionHeading from "@/components/ui/SectionHeading";
import Container from "@/components/layout/Container";
import ProductCard from "@/components/products/ProductCard";

interface Product {
  _id: string;
  title: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  bestseller?: boolean;
  newArrival?: boolean;
}

export default function FeaturedCollection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");

        const data = await res.json();

        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-[#09090B]">
        <Container>
          <SectionHeading
            badge="FEATURED COLLECTION"
            title="Our Best Sellers"
            description="Discover premium oversized anime streetwear crafted for dreamers, creators and legends."
            center
          />

          <div className="mt-16 text-center text-zinc-400">
            Loading products...
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-24 bg-[#09090B]">
      <Container>
        <SectionHeading
          badge="FEATURED COLLECTION"
          title="Our Best Sellers"
          description="Discover premium oversized anime streetwear crafted for dreamers, creators and legends."
          center
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}