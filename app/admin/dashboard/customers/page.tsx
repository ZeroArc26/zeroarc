import { getCustomers } from "@/lib/actions/customers/getCustomers";
import { ICustomer } from "@/models/Customer";
import { getCustomerStats } from "@/lib/actions/customers/getCustomerStats";

import CustomerHeader from "@/components/admin/customers/CustomerHeader";
import CustomerStats from "@/components/admin/customers/CustomerStats";
import CustomerToolbar from "@/components/admin/customers/CustomerToolbar";
import CustomerTable from "@/components/admin/customers/CustomerTable";

// Admin-only internal page reading live customer data — must never
// serve a cached/stale snapshot.
export const dynamic = "force-dynamic";

type CustomersPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: "active" | "blocked";
    page?: string;
  }>;
};

export default async function CustomersPage({
  searchParams,
}: CustomersPageProps) {

  const params = await searchParams;

const search = params.search ?? "";

const status = params.status;

const page = Number(params.page ?? "1");

const limit = 10;

  const result = await getCustomers({
  search,
  status,
  page,
  limit,
});
  const statsResult = await getCustomerStats();

  const customers: ICustomer[] =
  result.success && result.data
    ? (result.data as ICustomer[])
    : [];

    const pagination =
  result.success && result.pagination
    ? result.pagination
    : {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

    const stats = statsResult.success
  ? statsResult.data
  : {
      totalCustomers: 0,
      newCustomers: 0,
      returningCustomers: 0,
      totalRevenue: 0,
    };

  return (
    <div className="space-y-8">

      <CustomerHeader />

      <CustomerStats
  totalCustomers={stats.totalCustomers}
  newCustomers={stats.newCustomers}
  returningCustomers={stats.returningCustomers}
  totalRevenue={stats.totalRevenue}
/>

      <CustomerToolbar />
          {customers.length === 0 ? (

        <div className="flex min-h-[400px] items-center justify-center rounded-3xl border border-dashed bg-card">

          <div className="space-y-3 text-center">

            <h2 className="text-2xl font-semibold">
              No Customers Found
            </h2>

            <p className="text-muted-foreground">
              Your store doesn't have any customers yet.
            </p>

          </div>

        </div>

      ) : (

        <CustomerTable
  customers={customers}
  pagination={pagination}
/>

      )}

    </div>
  );
}