import DashboardSection from "@/components/admin/shared/DashboardSection";

interface TopProductsProps {
  products: any[];
}

export default function TopProducts({
  products,
}: TopProductsProps) {
  return (
    <DashboardSection
      title="Top Products"
      description="Best selling products this month."
    >
      <div className="space-y-5">

        {products.length === 0 ? (
          <p className="text-sm text-zinc-400">
            No products found.
          </p>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4 transition-all duration-300 hover:border-violet-500/30 hover:bg-zinc-900"
            >

              {/* Product Image */}
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-violet-500/10 text-lg font-bold text-violet-400">
                👕
              </div>


              {/* Product Info */}
              <div className="flex-1">

                <div className="flex items-center justify-between">

                  <h3 className="font-semibold text-white">
                    {product.basicInfo.title}
                  </h3>


                  <span className="font-semibold text-white">
                    ₹{product.pricing.sellingPrice}
                  </span>

                </div>


                <div className="mt-1 flex items-center justify-between text-sm text-zinc-400">

                  <span>
                    {product.soldCount || 0} Sold
                  </span>


                  <span>
                    {product.inventory.quantity} In Stock
                  </span>

                </div>


                {/* Progress Bar */}
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">

                  <div
                    className="h-full rounded-full bg-violet-500 transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        (product.soldCount || 0) / 1.5,
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