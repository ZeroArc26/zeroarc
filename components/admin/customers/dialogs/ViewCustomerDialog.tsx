"use client";

import {
  Calendar,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  Wallet,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";

import { ICustomer } from "@/models/Customer";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";

interface ViewCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: ICustomer | null;
}

export default function ViewCustomerDialog({
  open,
  onOpenChange,
  customer,
}: ViewCustomerDialogProps) {
  if (!customer) return null;

  const initials = customer.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (date?: Date | string) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
  style={{ width: "1200px", maxWidth: "1200px" }}
  className="max-h-[92vh] overflow-y-auto rounded-[28px] p-0 border-0 shadow-2xl"
>

        {/* Header */}

        <DialogHeader className="sticky top-0 z-20 border-b bg-card/95 px-8 py-6 backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <DialogTitle className="text-2xl font-bold">
            Customer Details
          </DialogTitle>

          <p className="text-sm text-muted-foreground">
            View complete customer information.
          </p>
        </DialogHeader>

        <div className="space-y-6 p-8 lg:p-10">

          {/* Customer Hero */}

<div className="rounded-3xl border bg-card p-8 shadow-sm">

  <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

    {/* Left */}

    <div className="flex items-center gap-6">

      <Avatar
        size="lg"
        className="size-24 border"
      >
        <AvatarImage src={customer.avatar} />

        <AvatarFallback className="text-3xl font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div>

        <h2 className="text-3xl font-bold tracking-tight">
          {customer.name}
        </h2>

        <p className="mt-2 text-base text-muted-foreground">
          {customer.email}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">

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
            Customer
          </Badge>

        </div>

      </div>

    </div>

    {/* Right */}

    <div className="flex gap-4">

      <div className="min-w-[150px] rounded-2xl border bg-muted/40 p-5">

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShoppingBag className="h-4 w-4" />
          Orders
        </div>

        <p className="mt-3 text-3xl font-bold">
          {customer.totalOrders}
        </p>

      </div>

      <div className="min-w-[180px] rounded-2xl border bg-muted/40 p-5">

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Wallet className="h-4 w-4" />
          Lifetime Spend
        </div>

        <p className="mt-3 text-2xl font-bold">
          {formatCurrency(customer.totalSpent)}
        </p>

      </div>

    </div>

  </div>

</div>

                    {/* Information Grid */}

<div className="grid gap-6 lg:grid-cols-2">

  {/* Contact Information */}

  <div className="rounded-3xl border bg-card p-7 shadow-sm">

    <div className="mb-7 flex items-center gap-3">

      <div className="rounded-xl bg-primary/10 p-3">
        <UserCircle2 className="h-5 w-5 text-primary" />
      </div>

      <div>
        <h3 className="text-lg font-semibold">
          Contact Information
        </h3>

        <p className="text-sm text-muted-foreground">
          Customer communication details
        </p>
      </div>

    </div>

    <div className="space-y-6">

      <div className="flex items-start gap-4">

        <div className="rounded-xl bg-primary/10 p-3">
          <Mail className="h-5 w-5 text-primary" />
        </div>

        <div className="min-w-0 flex-1">

          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Email Address
          </p>

          <p className="mt-1 break-all text-base font-medium">
            {customer.email}
          </p>

        </div>

      </div>

      <div className="flex items-start gap-4">

        <div className="rounded-xl bg-primary/10 p-3">
          <Phone className="h-5 w-5 text-primary" />
        </div>

        <div>

          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Phone Number
          </p>

          <p className="mt-1 text-base font-medium">
            {customer.phone}
          </p>

        </div>

      </div>

    </div>

  </div>

  {/* Address */}

  <div className="rounded-3xl border bg-card p-7 shadow-sm">

    <div className="mb-7 flex items-center gap-3">

      <div className="rounded-xl bg-primary/10 p-3">
        <MapPin className="h-5 w-5 text-primary" />
      </div>

      <div>

        <h3 className="text-lg font-semibold">
          Address
        </h3>

        <p className="text-sm text-muted-foreground">
          Shipping & billing address
        </p>

      </div>

    </div>

    <div className="space-y-3">

      <p className="text-base font-semibold">
        {customer.address.address || "Address not available"}
      </p>

      <p className="text-muted-foreground">
        {customer.address.city || "-"},{" "}
        {customer.address.state || "-"}
      </p>

      <p className="text-muted-foreground">
        {customer.address.pincode || "-"}
      </p>

      <Badge
        variant="secondary"
        className="mt-2"
      >
        {customer.address.country}
      </Badge>

    </div>

  </div>

</div>

          {/* Account Overview */}

<div className="rounded-3xl border bg-card p-7 shadow-sm">

  <div className="mb-7 flex items-center gap-3">

    <div className="rounded-xl bg-primary/10 p-3">
      <ShieldCheck className="h-5 w-5 text-primary" />
    </div>

    <div>
      <h3 className="text-lg font-semibold">
        Account Overview
      </h3>

      <p className="text-sm text-muted-foreground">
        Customer activity and account information
      </p>
    </div>

  </div>

  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

    {/* Status */}

    <div className="rounded-2xl border bg-muted/30 p-5">

      <p className="text-sm text-muted-foreground">
        Status
      </p>

      <div className="mt-3">

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

      </div>

    </div>

    {/* Orders */}

    <div className="rounded-2xl border bg-muted/30 p-5">

      <p className="text-sm text-muted-foreground">
        Total Orders
      </p>

      <h4 className="mt-3 text-2xl font-bold">
        {customer.totalOrders}
      </h4>

    </div>

    {/* Revenue */}

    <div className="rounded-2xl border bg-muted/30 p-5">

      <p className="text-sm text-muted-foreground">
        Lifetime Spend
      </p>

      <h4 className="mt-3 text-2xl font-bold">
        {formatCurrency(customer.totalSpent)}
      </h4>

    </div>

    {/* Joined */}

    <div className="rounded-2xl border bg-muted/30 p-5">

      <p className="text-sm text-muted-foreground">
        Joined On
      </p>

      <h4 className="mt-3 text-lg font-semibold">
        {formatDate(customer.createdAt)}
      </h4>

    </div>

    {/* Last Order */}

    <div className="rounded-2xl border bg-muted/30 p-5">

      <p className="text-sm text-muted-foreground">
        Last Order
      </p>

      <h4 className="mt-3 text-lg font-semibold">
        {formatDate(customer.lastOrderAt)}
      </h4>

    </div>

    {/* Updated */}

    <div className="rounded-2xl border bg-muted/30 p-5">

      <p className="text-sm text-muted-foreground">
        Last Updated
      </p>

      <h4 className="mt-3 text-lg font-semibold">
        {formatDate(customer.updatedAt)}
      </h4>

    </div>

  </div>

</div>

                    {/* Footer */}

          <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t bg-card/95 px-8 py-6 backdrop-blur sm:flex-row sm:justify-end">

            <button
  type="button"
  onClick={() => onOpenChange(false)}
  className="inline-flex h-11 items-center justify-center rounded-xl border px-6 text-sm font-medium transition-all hover:bg-muted hover:shadow-md"
>
              Close
            </button>

          </div>

        </div>

      </DialogContent>

    </Dialog>
  );
}