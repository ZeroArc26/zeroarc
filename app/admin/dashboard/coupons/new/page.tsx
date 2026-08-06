import PageHeader from "@/components/admin/shared/PageHeader";
import CouponForm from "@/components/admin/coupons/CouponForm";

export default function NewCouponPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Create Coupon"
        description="Set up a new discount code."
        backHref="/admin/dashboard/coupons"
      />

      <CouponForm mode="create" />
    </div>
  );
}