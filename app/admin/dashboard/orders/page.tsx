import PageHeader from "@/components/admin/shared/PageHeader";
import OrdersPageClient from "@/components/admin/orders/OrdersPageClient";

import { getOrders } from "@/lib/actions/orders/getOrders";

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Orders"
        description="Manage customer orders, payments and deliveries."
      />

      <OrdersPageClient orders={orders} />
    </div>
  );
}