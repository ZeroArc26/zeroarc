import PageHeader from "@/components/admin/shared/PageHeader";
import CouponsPageClient from "@/components/admin/coupons/CouponsPageClient";
import { getCoupons } from "@/lib/actions/coupons/getCoupons";

export default async function CouponsPage() {
  const result = await getCoupons({ limit: 100 });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Coupons"
        description="Create and manage discount codes for checkout."
      />

      <CouponsPageClient coupons={result.data || []} />
    </div>
  );
}