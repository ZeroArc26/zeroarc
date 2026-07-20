import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductCard from "@/components/products/ProductCard";

export default async function ShopPage() {
  await connectDB();

  const products = await Product.find({
    active: true,
  }).lean();

  return (
    <main className="min-h-screen bg-black pt-28">

      <div className="mx-auto max-w-7xl px-6">

        <h1 className="mb-10 text-5xl font-black text-white">
          Shop
        </h1>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {products.map((product: any) => (
            <ProductCard
              key={product._id.toString()}
              product={{
                ...product,
                _id: product._id.toString(),
              }}
            />
          ))}

        </div>

      </div>

    </main>
  );
}