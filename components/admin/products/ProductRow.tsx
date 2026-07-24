import Image from "next/image";
import ProductStatusBadge from "./ProductStatusBadge";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type Product = {
  _id: string;
  title: string;
  category: string;
  price: number;
  stock: number;
  active: boolean;
  images: string[];
};

type ProductRowProps = {
  product: Product;
};

export default function ProductRow({
  product,
}: ProductRowProps) {

    const router = useRouter();

    const handleDelete = async () => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this product?"
  );

  if (!confirmed) return;

  try {
    const res = await fetch(
      `/api/admin/products/${product._id}`,
      {
        method: "DELETE",
      }
    );

    const result = await res.json();

    if (!res.ok) {
      alert(result.message || "Failed to delete product.");
      return;
    }

    alert("✅ Product deleted successfully!");

    router.refresh();
  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  }
};

  return (
    <tr className="border-t border-zinc-800 transition hover:bg-zinc-900/40">
      <td className="px-6 py-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
          <Image
            src={product.images?.[0] || "/placeholder.png"}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>
      </td>

      <td className="px-6 py-4 font-medium">
        {product.title}
      </td>

      <td className="px-6 py-4 text-zinc-400">
        {product.category}
      </td>

      <td className="px-6 py-4">
        ₹{product.price}
      </td>

      <td className="px-6 py-4">
        {product.stock}
      </td>

      <td className="px-6 py-4">
        <ProductStatusBadge active={product.active} />
      </td>

      <td className="px-6 py-4">
        <div className="flex gap-2">
          <button className="rounded-lg border border-zinc-700 px-3 py-1 text-sm transition hover:border-violet-500 hover:text-violet-400">
            View
          </button>

          <Link
  href={`/admin/products/${product._id}/edit`}
  className="rounded-lg border border-zinc-700 px-3 py-1 text-sm transition hover:border-blue-500 hover:text-blue-400"
>
  Edit
</Link>

          <button
  onClick={handleDelete}
  className="rounded-lg border border-red-700 px-3 py-1 text-sm text-red-400 transition hover:bg-red-600 hover:text-white"
>
  Delete
</button>
        </div>
      </td>
    </tr>
  );
}