"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { deleteCoupon } from "@/lib/actions/coupons/deleteCoupon";

interface Props {
  couponId: string;
  couponCode: string;
}

export default function DeleteCouponDialog({ couponId, couponCode }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const result = await deleteCoupon(couponId);

      if (!result.success) {
        alert(result.message);
        return;
      }

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-500/10">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Coupon</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete <strong>{couponCode}</strong>? This
          cannot be undone.
        </p>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}