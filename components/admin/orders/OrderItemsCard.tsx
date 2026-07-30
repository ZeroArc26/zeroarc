interface OrderItem {
  name: string;
  image?: string;
  sku?: string;
  hsnCode?: string;
  quantity: number;
  price: number;
  totalAmount: number;
}


interface Props {
  items: OrderItem[];
}


export default function OrderItemsCard({
  items,
}: Props) {

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

      <h2 className="text-xl font-bold text-white">
        Order Items
      </h2>


      <div className="mt-6 space-y-4">

        {items.map((item, index) => (

          <div
            key={index}
            className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4"
          >

            {/* Product Info */}

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-800 text-xl">
                👕
              </div>


              <div>

                <h3 className="font-semibold text-white">
                  {item.name}
                </h3>


                <div className="mt-1 space-y-1 text-xs text-zinc-500">

                  {item.sku && (
                    <p>
                      SKU: {item.sku}
                    </p>
                  )}


                  {item.hsnCode && (
                    <p>
                      HSN: {item.hsnCode}
                    </p>
                  )}

                </div>

              </div>

            </div>



            {/* Price */}

            <div className="text-right">

              <p className="text-sm text-zinc-400">
                Qty: {item.quantity}
              </p>


              <p className="mt-1 font-semibold text-white">
                ₹{item.totalAmount}
              </p>

            </div>


          </div>

        ))}

      </div>

    </div>
  );
}