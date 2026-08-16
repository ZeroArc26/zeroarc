import ProductForm from "@/components/admin/products/ProductForm";
import AdminProductReviews from "@/components/admin/products/AdminProductReviews";
import { getProductById } from "@/lib/actions/products/getProductById";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: Props) {
  const { id } = await params;

  const product = await getProductById(id);

  if (!product) {
    return (
      <div className="p-10 text-center text-red-500">
        Product not found.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ProductForm
        mode="edit"
        initialData={product}
      />

      <AdminProductReviews productId={id} />
    </div>
  );
}