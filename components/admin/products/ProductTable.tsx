import Card from "@/components/admin/shared/Card";

import ProductRow, { Product } from "./ProductRow";

type ProductTableProps = {
  products: Product[];
};

export default function ProductTable({
  products,
}: ProductTableProps) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-800">
          <thead className="bg-zinc-900/70 backdrop-blur">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Image
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Product
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Category
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Price
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Stock
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Status
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800 bg-zinc-950">
            {products.map((product) => (
              <ProductRow
                key={product._id}
                product={product}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}