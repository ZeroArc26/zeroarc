"use client";

import { useState } from "react";

import {
  Trash2,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import { ICustomer } from "@/models/Customer";

import { deleteCustomer } from "@/lib/actions/customers/deleteCustomer";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

interface DeleteCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: ICustomer | null;
}

export default function DeleteCustomerDialog({
  open,
  onOpenChange,
  customer,
}: DeleteCustomerDialogProps) {
  const [loading, setLoading] = useState(false);

  if (!customer) return null;

  const initials = customer.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function handleDelete() {
    try {
      setLoading(true);

      const result = await deleteCustomer(
        customer!._id.toString()
      );

      if (result.success) {
        onOpenChange(false);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-lg rounded-3xl p-0 overflow-hidden">

        <DialogHeader className="border-b px-8 py-6">

          <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-destructive">

            <AlertTriangle className="h-7 w-7" />

            Delete Customer

          </DialogTitle>

          <DialogDescription className="pt-2 text-base">
            This action cannot be undone. Please review the customer details before deleting.
          </DialogDescription>

        </DialogHeader>

        <div className="space-y-6 p-8">

                      {/* Warning Card */}

          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5">

            <div className="flex items-start gap-4">

              <div className="rounded-xl bg-destructive/10 p-3">

                <AlertTriangle className="h-6 w-6 text-destructive" />

              </div>

              <div className="space-y-2">

                <h3 className="text-lg font-semibold text-destructive">
                  Permanent Deletion
                </h3>

                <p className="text-sm leading-6 text-muted-foreground">
                  Deleting this customer will permanently remove their profile
                  from the database. This action cannot be reversed.
                </p>

              </div>

            </div>

          </div>

          {/* Customer Preview */}

          <div className="rounded-3xl border bg-card p-6 shadow-sm">

            <div className="flex items-center gap-5">

              <Avatar className="h-16 w-16">

                <AvatarImage src={customer.avatar} />

                <AvatarFallback className="text-lg font-semibold">
                  {initials}
                </AvatarFallback>

              </Avatar>

              <div className="flex-1">

                <h3 className="text-xl font-bold">
                  {customer.name}
                </h3>

                <p className="mt-1 text-muted-foreground">
                  {customer.email}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">

                  <Badge
                    variant={
                      customer.status === "active"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {customer.status === "active"
                      ? "Active"
                      : "Blocked"}
                  </Badge>

                  <Badge variant="outline">
                    {customer.totalOrders} Orders
                  </Badge>

                </div>

              </div>

            </div>

          </div>

          {/* Information */}

          <div className="rounded-2xl border bg-muted/30 p-5">

            <h4 className="font-semibold">
              Before you continue
            </h4>

            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">

              <li>
                • Customer profile will be permanently deleted.
              </li>

              <li>
                • Customer information cannot be recovered later.
              </li>

              <li>
                • Existing order history should be backed up if required.
              </li>

            </ul>

          </div>

                    {/* Footer */}

          <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">

            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              disabled={loading}
              onClick={handleDelete}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Customer
                </>
              )}
            </Button>

          </div>

        </div>

      </DialogContent>

    </Dialog>
  );
}