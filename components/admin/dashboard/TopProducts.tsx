import DashboardSection from "@/components/admin/shared/DashboardSection";

const products = [
  {
    id: 1,
    name: "ZeroArc Oversized Tee",
    price: "₹999",
    sold: 125,
    stock: 42,
  },
  {
    id: 2,
    name: "Naruto Hoodie",
    price: "₹1,499",
    sold: 98,
    stock: 18,
  },
  {
    id: 3,
    name: "Tokyo Street Tee",
    price: "₹799",
    sold: 80,
    stock: 31,
  },
  {
    id: 4,
    name: "Samurai Oversized Tee",
    price: "₹1,199",
    sold: 64,
    stock: 15,
  },
];

export default function TopProducts() {
  return (
    <DashboardSection
      title="Top Products"
      description="Best selling products this month."
    >
      <div className="space-y-5">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4 transition-all duration-300 hover:border-violet-500/30 hover:bg-zinc-900"
          >
            {/* Product Image Placeholder */}
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-violet-500/10 text-lg font-bold text-violet-400">
              👕
            </div>

            {/* Product Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">
                  {product.name}
                </h3>

                <span className="font-semibold text-white">
                  {product.price}
                </span>
              </div>

              <div className="mt-1 flex items-center justify-between text-sm text-zinc-400">
                <span>{product.sold} Sold</span>
                <span>{product.stock} In Stock</span>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-violet-500 transition-all duration-500"
                  style={{
                    width: `${Math.min(product.sold / 1.5, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardSection>
  );
}