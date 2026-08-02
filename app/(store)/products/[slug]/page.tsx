import { notFound } from "next/navigation";

import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";

import Breadcrumb from "@/components/products/Breadcrumb";
import ProductGallery from "@/components/products/ProductGallery";
import ProductInfo from "@/components/products/ProductInfo";
import ProductFeatures from "@/components/products/ProductFeatures";
import ProductTabs from "@/components/products/ProductTabs";
import ProductPromoBanner from "@/components/products/ProductPromoBanner";
import RelatedProducts from "@/components/products/RelatedProducts";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProduct(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/products/slug/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;

  const data = await res.json();
  return data.product;
}

async function getRelatedProducts(category: string, excludeSlug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products`, {
    cache: "no-store",
  });

  if (!res.ok) return [];

  const data = await res.json();

  return (data.products || [])
    .filter(
      (p: any) =>
        p.basicInfo.category === category &&
        p.basicInfo.slug !== excludeSlug
    )
    .slice(0, 5);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(
    product.basicInfo.category,
    product.basicInfo.slug
  );

  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar />
      <Navbar />

      <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-14">
        <Breadcrumb
          category={product.basicInfo.category}
          title={product.basicInfo.title}
        />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <ProductGallery images={product.images} />
            <ProductFeatures />
          </div>

          <ProductInfo product={product} />
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          <ProductTabs description={product.basicInfo.description} />
          <ProductPromoBanner />
        </div>

        <RelatedProducts products={relatedProducts} />
      </div>

      <Newsletter />
      <Footer />
    </main>
  );
}