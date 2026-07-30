import DashboardSection from "@/components/admin/shared/DashboardSection";
import { getTopProducts } from "@/lib/actions/dashboard/getTopProducts";


export default async function TopProducts() {
  const products = await getTopProducts();

  return (
    <DashboardSection
      title="Top Products"
      description="Best selling products this month."
    >
      <div className="space-y-5">
        {products.length === 0 ? (
          <p className="text-sm text-zinc-500">
            No products available yet.
          </p>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4 transition-all duration-300 hover:border-violet-500/30 hover:bg-zinc-900"
            >
              {/* Product Image */}

              <div className="h-14 w-14 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-800">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>


              {/* Product Info */}

              <div className="flex-1">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-white">
                    {product.name}
                  </h3>

                  <span className="font-semibold text-white">
                    ₹{product.price}
                  </span>
                </div>


                <div className="mt-1 flex items-center justify-between text-sm text-zinc-400">
                  <span>
                    {product.sold} Sold
                  </span>

                  <span>
                    {product.stock} In Stock
                  </span>
                </div>


                {/* Progress Bar */}

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-violet-500 transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        (product.sold / 150) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </DashboardSection>
  );
}