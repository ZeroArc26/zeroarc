import PageHeader from "@/components/admin/shared/PageHeader";
import ProductsPageClient from "@/components/admin/products/ProductsPageClient";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export default async function ProductsPage() {
  await connectDB();

  const products = await Product.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Products"
        description="Manage your products, inventory and pricing."
      />

      <ProductsPageClient products={JSON.parse(JSON.stringify(products))} />
    </div>
  );
}