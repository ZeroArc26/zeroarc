import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function getLowStockProducts() {
  await connectDB();

  const products = await Product.find({
    "inventory.quantity": {
      $lte: 10,
    },
  })
    .sort({
      "inventory.quantity": 1,
    })
    .limit(5)
    .lean();

  return products.map((product: any) => ({
    id: String(product._id),

    name: product.basicInfo.title,

    stock: product.inventory.quantity,

    image:
      product.images?.find(
        (img: any) => img.isCover
      )?.url ||
      product.images?.[0]?.url ||
      "/products/default.webp",
  }));
}