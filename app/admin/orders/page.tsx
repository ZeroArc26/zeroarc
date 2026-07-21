"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Order {
  _id: string;

  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };

  shippingAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };

  products: {
    title: string;
    image: string;
    color: string;
    size: string;
    quantity: number;
    price: number;
  }[];

  totalItems: number;
  subtotal: number;
  shipping: number;
  total: number;

  status: string;

  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const res = await fetch("/api/orders");

      const data = await res.json();

      if (data.success) {
        setOrders(data.orders);
      }

      setLoading(false);
    }

    fetchOrders();
  }, []);

  function getStatusColor(status: string) {
  switch (status) {
    case "Pending":
      return "bg-yellow-500/20 text-yellow-400";

    case "Confirmed":
      return "bg-blue-500/20 text-blue-400";

    case "Packed":
      return "bg-purple-500/20 text-purple-400";

    case "Shipped":
      return "bg-orange-500/20 text-orange-400";

    case "Delivered":
      return "bg-green-500/20 text-green-400";

    case "Cancelled":
      return "bg-red-500/20 text-red-400";

    default:
      return "bg-zinc-700 text-white";
  }
}

  async function updateStatus(
  orderId: string,
  status: string
) 

{
  try {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
      }),
    });

    const data = await res.json();

console.log(data);

if (!data.success) {
  throw new Error("Failed");
}

setOrders((prev) =>
  prev.map((order) =>
    order._id === orderId
      ? data.order
      : order
  )
);

toast.success("Status Updated");

  } catch (error) {
    console.error(error);
    toast.error("Failed to update status");
  }
}

    if (loading) {
    return (
      <main className="min-h-screen bg-[#09090B] py-32 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="text-5xl font-black">
            Orders
          </h1>

          <p className="mt-8 text-zinc-400">
            Loading orders...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090B] py-32 text-white">

      <div className="mx-auto max-w-7xl px-6">

        <h1 className="text-5xl font-black">
          Orders
        </h1>

        <p className="mt-4 text-zinc-400">
          Total Orders: {orders.length}
        </p>

        <div className="mt-12 space-y-8">

          {orders.map((order) => (

            <div
              key={order._id}
              className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8"
            >

              <div className="flex flex-col justify-between gap-8 lg:flex-row">

                {/* LEFT */}

                <div>

                  <h2 className="text-2xl font-bold">
                    {order.customer.firstName} {order.customer.lastName}
                  </h2>

                  <p className="mt-2 text-zinc-400">
                    {order.customer.email}
                  </p>

                  <p className="text-zinc-400">
                    {order.customer.phone}
                  </p>

                  <p className="mt-6 text-zinc-500">
                    {order.shippingAddress.address}
                  </p>

                  <p className="text-zinc-500">
                    {order.shippingAddress.city},
                    {" "}
                    {order.shippingAddress.state}
                  </p>

                  <p className="text-zinc-500">
                    {order.shippingAddress.pincode},
                    {" "}
                    {order.shippingAddress.country}
                  </p>

                </div>

                {/* RIGHT */}

                <div className="text-right">

                  <p className="text-4xl font-black text-purple-400">
                    ₹{order.total}
                  </p>

                  <p className="mt-3 text-zinc-400">
                    {order.totalItems} Item(s)
                  </p>

                  <select
  value={order.status}
  onChange={(e) =>
    updateStatus(order._id, e.target.value)
  }
  className="mt-5 rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-semibold outline-none"
>
  <option>Pending</option>
  <option>Confirmed</option>
  <option>Packed</option>
  <option>Shipped</option>
  <option>Delivered</option>
  <option>Cancelled</option>
</select>

                  <p className="mt-5 text-sm text-zinc-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>

                </div>

              </div>

                              {/* Products */}

                <div className="mt-8 border-t border-zinc-800 pt-8">

                  <h3 className="mb-5 text-xl font-bold">
                    Products
                  </h3>

                  <div className="space-y-4">

                    {order.products.map((product, index) => (

                      <div
                        key={index}
                        className="flex items-center justify-between rounded-2xl bg-zinc-950 p-4"
                      >

                        <div>

                          <h4 className="font-semibold">
                            {product.title}
                          </h4>

                          <p className="mt-1 text-sm text-zinc-500">
                            {product.color} • {product.size}
                          </p>

                        </div>

                        <div className="text-right">

                          <p>
                            Qty: {product.quantity}
                          </p>

                          <p className="font-bold text-purple-400">
                            ₹{product.price}
                          </p>

                        </div>

                      </div>

                    ))}

                  </div>

                </div>

              </div>

            ))}

        </div>

      </div>

    </main>
  );
}