import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function getTopProducts() {
  await connectDB();

  const products = await Product.find()
    .sort({
      soldCount: -1,
    })
    .limit(5)
    .lean();

  return products.map((product: any) => ({
    id: String(product._id),

    name: product.basicInfo.title,

    price: product.pricing.sellingPrice,

    sold: product.soldCount ?? 0,

    stock: product.inventory.quantity,

    image:
      product.images?.find(
        (img: any) => img.isCover
      )?.url ||
      product.images?.[0]?.url ||
      "/products/default.webp",
  }));
}