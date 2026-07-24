import ProductRow, { Product } from "./ProductRow";

type ProductTableProps = {
  products: Product[];
};

export default function ProductTable({
  products,
}: ProductTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-zinc-900">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Image
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Product
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Category
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Price
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Stock
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Status
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <ProductRow
                key={product._id}
                product={product}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}