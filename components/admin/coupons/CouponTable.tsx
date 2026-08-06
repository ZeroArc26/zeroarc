"use client";

import Link from "next/link";
import { Pencil, Copy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DeleteCouponDialog from "./dialogs/DeleteCouponDialog";

interface CouponRow {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  perCustomerLimit?: number;
  expiryDate?: string;
  isActive: boolean;
}

interface Props {
  coupons: CouponRow[];
}

function isExpired(expiryDate?: string) {
  if (!expiryDate) return false;
  return new Date(expiryDate).getTime() < Date.now();
}

export default function CouponTable({ coupons }: Props) {
  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-zinc-800 bg-zinc-900">
            <tr className="text-left text-sm text-zinc-400">
              <th className="px-6 py-4 font-medium">Code</th>
              <th className="px-6 py-4 font-medium">Discount</th>
              <th className="px-6 py-4 font-medium">Min Order</th>
              <th className="px-6 py-4 font-medium">Usage</th>
              <th className="px-6 py-4 font-medium">Expiry</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                  No coupons found.
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => {
                const expired = isExpired(coupon.expiryDate);
                const exhausted =
                  coupon.usageLimit !== undefined &&
                  coupon.usedCount >= coupon.usageLimit;

                return (
                  <tr
                    key={coupon._id}
                    className="border-b border-zinc-800 transition hover:bg-zinc-900"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-white">
                          {coupon.code}
                        </span>
                        <button
                          onClick={() => copyCode(coupon.code)}
                          className="text-zinc-500 hover:text-violet-400"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-zinc-300">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : `₹${coupon.discountValue}`}
                      {coupon.maxDiscountAmount && (
                        <span className="ml-1 text-xs text-zinc-500">
                          (max ₹{coupon.maxDiscountAmount})
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-zinc-300">
                      ₹{coupon.minOrderValue}
                    </td>

                    <td className="px-6 py-4 text-zinc-300">
                      {coupon.usedCount}
                      {coupon.usageLimit !== undefined ? ` / ${coupon.usageLimit}` : ""}
                      {coupon.perCustomerLimit !== undefined && (
                        <span className="block text-xs text-zinc-500">
                          {coupon.perCustomerLimit}/customer
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-zinc-300">
                      {coupon.expiryDate
                        ? new Date(coupon.expiryDate).toLocaleDateString("en-IN")
                        : "No expiry"}
                    </td>

                    <td className="px-6 py-4">
                      {!coupon.isActive ? (
                        <Badge className="bg-zinc-500/15 text-zinc-400">Inactive</Badge>
                      ) : expired ? (
                        <Badge className="bg-red-500/15 text-red-400">Expired</Badge>
                      ) : exhausted ? (
                        <Badge className="bg-yellow-500/15 text-yellow-400">
                          Limit Reached
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-500/15 text-emerald-400">Active</Badge>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Link href={`/admin/dashboard/coupons/${coupon._id}/edit`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <DeleteCouponDialog couponId={coupon._id} couponCode={coupon.code} />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}