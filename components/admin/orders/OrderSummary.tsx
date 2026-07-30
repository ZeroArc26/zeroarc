import {
  CalendarDays,
  CreditCard,
  Package,
  Truck,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  order: any;
}

export default function OrderSummary({
  order,
}: Props) {

    const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

  return (
    <Card>

      <CardHeader>

        <CardTitle>
          Order Summary
        </CardTitle>

      </CardHeader>

      <CardContent>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Order Number */}

          <div className="rounded-xl border p-4">

            <Package className="mb-3 h-5 w-5 text-primary" />

            <p className="text-xs text-muted-foreground">
              Order Number
            </p>

            <h3 className="mt-1 font-semibold">
              {order.orderInfo.orderNumber}
            </h3>

          </div>

          {/* Order Date */}

          <div className="rounded-xl border p-4">

            <CalendarDays className="mb-3 h-5 w-5 text-primary" />

            <p className="text-xs text-muted-foreground">
              Order Date
            </p>

            <h3 className="mt-1 font-semibold">
              {new Date(order.orderInfo.orderDate).toLocaleDateString(
  "en-IN",
  {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }
)}
            </h3>

          </div>

          {/* Payment */}

          <div className="rounded-xl border p-4">

            <CreditCard className="mb-3 h-5 w-5 text-primary" />

            <p className="text-xs text-muted-foreground">
              Payment
            </p>

            <h3 className="mt-1 font-semibold">
              {order.payment.status}
            </h3>

          </div>

          {/* Delivery */}

          <div className="rounded-xl border p-4">

            <Truck className="mb-3 h-5 w-5 text-primary" />

            <p className="text-xs text-muted-foreground">
              Delivery
            </p>

            <h3 className="mt-1 font-semibold">
              {order.orderInfo.status}
            </h3>

          </div>

        </div>

        {/* ==========================================
    EXTRA ORDER STATS
========================================== */}

<div className="mt-6 grid gap-4 sm:grid-cols-3">

  {/* Grand Total */}

  <div className="rounded-xl border p-4">

    <p className="text-xs text-muted-foreground">
      Grand Total
    </p>

    <h2 className="mt-2 text-2xl font-bold">
      {currency.format(order.pricing.grandTotal)}
    </h2>

  </div>

  {/* Total Products */}

  <div className="rounded-xl border p-4">

    <p className="text-xs text-muted-foreground">
      Products
    </p>

    <h2 className="mt-2 text-2xl font-bold">
      {order.items.length}
    </h2>

  </div>

  {/* Total Quantity */}

  <div className="rounded-xl border p-4">

    <p className="text-xs text-muted-foreground">
      Total Quantity
    </p>

    <h2 className="mt-2 text-2xl font-bold">
      {order.items.reduce(
        (
          total: number,
          item: {
            quantity: number;
          }
        ) => total + item.quantity,
        0
      )}
    </h2>

  </div>

</div>

{/* ==========================================
    STATUS BADGES
========================================== */}

<div className="mt-6 flex flex-wrap gap-3">

  <span className="rounded-full border px-3 py-1 text-sm font-medium">
    Order: {order.orderInfo.status}
  </span>

  <span className="rounded-full border px-3 py-1 text-sm font-medium">
    Payment: {order.payment.status}
  </span>

  <span className="rounded-full border px-3 py-1 text-sm font-medium">
    {order.payment.method}
  </span>

</div>

      </CardContent>

    </Card>
  );
}