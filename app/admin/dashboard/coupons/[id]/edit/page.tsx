import { notFound } from "next/navigation";

import PageHeader from "@/components/admin/shared/PageHeader";
import CouponForm from "@/components/admin/coupons/CouponForm";
import { getCouponById } from "@/lib/actions/coupons/getCouponById";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCouponPage({ params }: Props) {
  const { id } = await params;
  const result = await getCouponById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const coupon = result.data;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Edit Coupon"
        description={`Editing ${coupon.code}`}
        backHref="/admin/dashboard/coupons"
      />

      <CouponForm
        mode="edit"
        couponId={coupon._id}
        initialData={{
          code: coupon.code,
          description: coupon.description,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          minOrderValue: coupon.minOrderValue,
          maxDiscountAmount: coupon.maxDiscountAmount,
          usageLimit: coupon.usageLimit,
          perCustomerLimit: coupon.perCustomerLimit,
          expiryDate: coupon.expiryDate
            ? new Date(coupon.expiryDate).toISOString().slice(0, 10)
            : "",
          isActive: coupon.isActive,
        }}
      />
    </div>
  );
}