import { notFound } from "next/navigation";

import Container from "@/components/layout/Container";
import ProductInfo from "@/components/products/ProductInfo";
import { FEATURED_PRODUCTS } from "@/constants/products";
import ProductGallery from "@/components/products/ProductGallery";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const product = FEATURED_PRODUCTS.find(
    (item) => item.slug === slug
  );

  if (!product) {
    notFound();
  }

  // First variant ki image dikhao
  const previewImage =
    product.variants && product.variants.length > 0
      ? product.variants[0].image
      : "/images/products/placeholder.png";

  return (
    <main className="min-h-screen bg-[#09090B] py-32 text-white">
      <Container className="grid gap-16 lg:grid-cols-2">

        <ProductGallery
  variants={product.variants}
/>
        <ProductInfo product={product} />

      </Container>
    </main>
  );
}