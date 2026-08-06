"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import {
  couponSchema,
  type CouponFormInput,
  type CouponFormValues,
} from "@/lib/validations/coupon.schema";

import { createCoupon } from "@/lib/actions/coupons/createCoupon";
import { updateCoupon } from "@/lib/actions/coupons/updateCoupon";

interface CouponFormProps {
  mode?: "create" | "edit";
  couponId?: string;
  initialData?: Partial<CouponFormInput>;
}

export default function CouponForm({
  mode = "create",
  couponId,
  initialData,
}: CouponFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CouponFormInput, any, CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: initialData?.code || "",
      description: initialData?.description || "",
      discountType: initialData?.discountType || "percentage",
      discountValue: initialData?.discountValue ?? 10,
      minOrderValue: initialData?.minOrderValue ?? 0,
      maxDiscountAmount: initialData?.maxDiscountAmount,
      usageLimit: initialData?.usageLimit,
      perCustomerLimit: initialData?.perCustomerLimit ?? 1,
      expiryDate: initialData?.expiryDate || "",
      isActive: initialData?.isActive ?? true,
    },
  });

  const discountType = watch("discountType");
  const isActive = watch("isActive");

  async function onSubmit(values: CouponFormValues) {
    setSubmitting(true);
    try {
      const result =
        mode === "edit" && couponId
          ? await updateCoupon(couponId, values)
          : await createCoupon(values);

      if (!result.success) {
        alert(result.message);
        return;
      }

      router.push("/admin/dashboard/coupons");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-white">Coupon Code</Label>
          <Input
            {...register("code")}
            placeholder="ZERO300"
            className="border-zinc-700 bg-zinc-950 uppercase text-white"
          />
          {errors.code && (
            <p className="text-sm text-red-500">{errors.code.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-white">Description (internal note)</Label>
          <Input
            {...register("description")}
            placeholder="Launch week promo"
            className="border-zinc-700 bg-zinc-950 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Discount Type</Label>
          <Select
            value={discountType}
            onValueChange={(v) => setValue("discountType", v as "percentage" | "fixed")}
          >
            <SelectTrigger className="border-zinc-700 bg-zinc-950 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage (%)</SelectItem>
              <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-white">
            Discount Value {discountType === "percentage" ? "(%)" : "(₹)"}
          </Label>
          <Input
            type="number"
            step="any"
            {...register("discountValue", { valueAsNumber: true })}
            className="border-zinc-700 bg-zinc-950 text-white"
          />
          {errors.discountValue && (
            <p className="text-sm text-red-500">{errors.discountValue.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-white">Minimum Order Value (₹)</Label>
          <Input
            type="number"
            {...register("minOrderValue", { valueAsNumber: true })}
            className="border-zinc-700 bg-zinc-950 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">
            Max Discount Cap (₹) {discountType === "fixed" && "— optional for fixed"}
          </Label>
          <Input
            type="number"
            {...register("maxDiscountAmount", { valueAsNumber: true })}
            placeholder="Leave blank for no cap"
            className="border-zinc-700 bg-zinc-950 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Total Usage Limit</Label>
          <Input
            type="number"
            {...register("usageLimit", { valueAsNumber: true })}
            placeholder="Leave blank for unlimited"
            className="border-zinc-700 bg-zinc-950 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Per-Customer Limit</Label>
          <Input
            type="number"
            {...register("perCustomerLimit", { valueAsNumber: true })}
            placeholder="Leave blank for unlimited"
            className="border-zinc-700 bg-zinc-950 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Expiry Date</Label>
          <Input
            type="date"
            {...register("expiryDate")}
            className="border-zinc-700 bg-zinc-950 text-white"
          />
        </div>

        <div className="flex items-center gap-3 pt-7">
          <Switch
            checked={isActive}
            onCheckedChange={(v) => setValue("isActive", v)}
          />
          <Label className="text-white">Active</Label>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-zinc-800 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/dashboard/coupons")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting} className="bg-violet-600 hover:bg-violet-500">
          {submitting ? "Saving..." : mode === "edit" ? "Update Coupon" : "Create Coupon"}
        </Button>
      </div>
    </form>
  );
}