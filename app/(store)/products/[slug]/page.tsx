import { notFound } from "next/navigation";

import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";

import Breadcrumb from "@/components/products/Breadcrumb";
import ProductGalleryAndInfo from "@/components/products/ProductGalleryAndInfo";
import ProductTabs from "@/components/products/ProductTabs";
import ProductPromoBanner from "@/components/products/ProductPromoBanner";
import RelatedProducts from "@/components/products/RelatedProducts";

import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProduct(slug: string) {
  await connectDB();

  const product: any = await Product.findOne({
    "basicInfo.slug": slug,
    "publish.status": "active",
  }).lean();

  if (!product) return null;

  return { ...product, _id: product._id.toString() };
}

async function getRelatedProducts(category: string, excludeSlug: string) {
  await connectDB();

  const raw = await Product.find({
    "publish.status": "active",
    "basicInfo.category": category,
    "basicInfo.slug": { $ne: excludeSlug },
  })
    .limit(5)
    .lean();

  return raw.map((p: any) => ({ ...p, _id: p._id.toString() }));
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
          <ProductGalleryAndInfo product={product} />
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