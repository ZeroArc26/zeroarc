import Link from "next/link";

import OrderStatusBadge from "./OrderStatusBadge";


interface Order {
  id: string;

  orderNumber: string;

  customer: string;

  total: number;

  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";

  payment: string;

  date: Date;
}


interface Props {
  orders: Order[];
}


export default function OrderTable({
  orders,
}: Props) {


  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40">

      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="border-b border-zinc-800 bg-zinc-950/50">

            <tr className="text-left text-zinc-400">

              <th className="px-6 py-4">
                Order ID
              </th>

              <th className="px-6 py-4">
                Customer
              </th>

              <th className="px-6 py-4">
                Amount
              </th>

              <th className="px-6 py-4">
                Payment
              </th>

              <th className="px-6 py-4">
                Status
              </th>

              <th className="px-6 py-4">
                Date
              </th>

              <th className="px-6 py-4">
                Action
              </th>

            </tr>

          </thead>


          <tbody>

            {orders.map((order) => (

              <tr
                key={order.id}
                className="border-b border-zinc-800 transition hover:bg-zinc-900"
              >

                <td className="px-6 py-4 font-medium text-white">
                  #{order.orderNumber}
                </td>


                <td className="px-6 py-4 text-zinc-300">
                  {order.customer}
                </td>


                <td className="px-6 py-4 font-semibold text-white">
                  ₹{order.total}
                </td>


                <td className="px-6 py-4 capitalize text-zinc-400">
                  {order.payment}
                </td>


                <td className="px-6 py-4">

                  <OrderStatusBadge
                    status={order.status}
                  />

                </td>


                <td className="px-6 py-4 text-zinc-500">
                  {new Date(
                    order.date
                  ).toLocaleDateString("en-IN")}
                </td>


                <td className="px-6 py-4">

                  <Link
                    href={`/admin/dashboard/orders/${order.id}`}
                    className="text-sm font-medium text-violet-400 transition hover:text-violet-300"
                  >
                    View
                  </Link>

                </td>


              </tr>

            ))}

          </tbody>

        </table>

      </div>


      {orders.length === 0 && (

        <div className="p-10 text-center text-zinc-500">
          No orders found.
        </div>

      )}

    </div>
  );
}