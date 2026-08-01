"use client";

import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Save,
  Loader2,
} from "lucide-react";

import { ICustomer } from "@/models/Customer";

import {
  customerSchema,
  type CustomerFormInput,
} from "@/lib/validations/customer.schema";

import { updateCustomer } from "@/lib/actions/customers/updateCustomer";

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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: ICustomer | null;
}

export default function EditCustomerDialog({
  open,
  onOpenChange,
  customer,
}: EditCustomerDialogProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<CustomerFormInput>({
    resolver: zodResolver(customerSchema),

    defaultValues: {
      userId: "",

      name: "",
      email: "",
      phone: "",
      avatar: "",

      address: {
        address: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
      },

      status: "active",

      totalOrders: 0,
      totalSpent: 0,
      lastOrderAt: undefined,
    },
  });

  useEffect(() => {
    if (!customer) return;

    form.reset({
      userId: customer.userId?.toString(),

      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      avatar: customer.avatar || "",

      address: {
        address: customer.address.address,
        city: customer.address.city,
        state: customer.address.state,
        pincode: customer.address.pincode,
        country: customer.address.country,
      },

      status: customer.status,

      totalOrders: customer.totalOrders,
      totalSpent: customer.totalSpent,

      lastOrderAt: customer.lastOrderAt,
    });
  }, [customer, form]);

  if (!customer) return null;

  const initials = customer.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function onSubmit(values: CustomerFormInput) {
  try {
    setLoading(true);

    const validatedValues = customerSchema.parse(values);

    const result = await updateCustomer(
      customer!._id.toString(),
      validatedValues
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
      <DialogContent
  style={{
    width: "1200px",
    maxWidth: "1200px",
  }}
  className="max-h-[92vh] overflow-y-auto rounded-3xl p-0"
>

        <DialogHeader className="border-b px-8 py-6">

          <DialogTitle className="text-2xl font-bold">
            Edit Customer
          </DialogTitle>

          <p className="text-sm text-muted-foreground">
            Update customer information and account details.
          </p>

        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 p-8"
        >

                    {/* Customer Profile */}

        <div className="rounded-3xl border bg-card p-8 shadow-sm">

          <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">

            <div className="flex items-center gap-5">

              <Avatar size="lg" className="size-20">

                <AvatarImage src={form.watch("avatar")} />

                <AvatarFallback className="text-2xl font-semibold">
                  {initials}
                </AvatarFallback>

              </Avatar>

              <div>

                <h2 className="text-2xl font-bold">
                  {form.watch("name") || "Customer"}
                </h2>

                <p className="mt-1 text-muted-foreground">
                  {form.watch("email")}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">

                  <Badge
                    variant={
                      form.watch("status") === "active"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {form.watch("status") === "active"
                      ? "Active"
                      : "Blocked"}
                  </Badge>

                  <Badge variant="outline">
                    Customer
                  </Badge>

                </div>

              </div>

            </div>

            <div className="flex flex-col gap-4 sm:flex-row">

              <div className="min-w-[170px] rounded-2xl border bg-muted/40 p-5">

                <p className="text-sm text-muted-foreground">
                  Total Orders
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  {customer.totalOrders}
                </h3>

              </div>

              <div className="min-w-[220px] rounded-2xl border bg-muted/40 p-5">

                <p className="text-sm text-muted-foreground">
                  Total Spent
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  ₹{customer.totalSpent.toLocaleString("en-IN")}
                </h3>

              </div>

            </div>

          </div>

        </div>

        {/* Personal Information */}

        <div className="rounded-3xl border bg-card p-8 shadow-sm">

          <div className="mb-8 flex items-center gap-2">

            <User className="h-5 w-5 text-primary" />

            <h3 className="text-xl font-semibold">
              Personal Information
            </h3>

          </div>

          <div className="grid gap-6 md:grid-cols-2">

            {/* Name */}

            <div className="space-y-2">

              <label className="text-sm font-medium">
                Full Name
              </label>

              <Input
                placeholder="Enter customer name"
                {...form.register("name")}
              />

              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}

            </div>

            {/* Email */}

            <div className="space-y-2">

              <label className="text-sm font-medium">
                Email Address
              </label>

              <Input
                disabled
                {...form.register("email")}
              />

              <p className="text-xs text-muted-foreground">
                Email address cannot be changed.
              </p>

            </div>

            {/* Phone */}

            <div className="space-y-2">

              <label className="text-sm font-medium">
                Phone Number
              </label>

              <Input
                placeholder="+91XXXXXXXXXX"
                {...form.register("phone")}
              />

              {form.formState.errors.phone && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.phone.message}
                </p>
              )}

            </div>

            {/* Avatar */}

            <div className="space-y-2">

              <label className="text-sm font-medium">
                Avatar URL
              </label>

              <Input
                placeholder="https://..."
                {...form.register("avatar")}
              />

            </div>

          </div>

        </div>

                {/* Address Information */}

        <div className="rounded-3xl border bg-card p-8 shadow-sm">

          <div className="mb-8 flex items-center gap-2">

            <MapPin className="h-5 w-5 text-primary" />

            <h3 className="text-xl font-semibold">
              Address Information
            </h3>

          </div>

          <div className="grid gap-6 md:grid-cols-2">

            {/* Address */}

            <div className="space-y-2 md:col-span-2">

              <label className="text-sm font-medium">
                Street Address
              </label>

              <Input
                placeholder="Street Address"
                {...form.register("address.address")}
              />

            </div>

            {/* City */}

            <div className="space-y-2">

              <label className="text-sm font-medium">
                City
              </label>

              <Input
                placeholder="City"
                {...form.register("address.city")}
              />

            </div>

            {/* State */}

            <div className="space-y-2">

              <label className="text-sm font-medium">
                State
              </label>

              <Input
                placeholder="State"
                {...form.register("address.state")}
              />

            </div>

            {/* Pincode */}

            <div className="space-y-2">

              <label className="text-sm font-medium">
                Pincode
              </label>

              <Input
                placeholder="Pincode"
                {...form.register("address.pincode")}
              />

            </div>

            {/* Country */}

            <div className="space-y-2">

              <label className="text-sm font-medium">
                Country
              </label>

              <Input
                placeholder="Country"
                {...form.register("address.country")}
              />

            </div>

          </div>

        </div>

        {/* Account Settings */}

        <div className="rounded-3xl border bg-card p-8 shadow-sm">

          <div className="mb-8 flex items-center gap-2">

            <Shield className="h-5 w-5 text-primary" />

            <h3 className="text-xl font-semibold">
              Account Settings
            </h3>

          </div>

          <div className="grid gap-6 md:grid-cols-2">

            {/* Status */}

            <div className="space-y-2">

              <label className="text-sm font-medium">
                Customer Status
              </label>

              <select
                {...form.register("status")}
                className="flex h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
              >
                <option value="active">
                  Active
                </option>

                <option value="blocked">
                  Blocked
                </option>
              </select>

            </div>

            {/* Preview */}

            <div className="rounded-2xl border bg-muted/30 p-5">

              <p className="text-sm text-muted-foreground">
                Current Status
              </p>

              <div className="mt-3">

                <Badge
                  variant={
                    form.watch("status") === "active"
                      ? "default"
                      : "destructive"
                  }
                >
                  {form.watch("status") === "active"
                    ? "Active"
                    : "Blocked"}
                </Badge>

              </div>

              <p className="mt-4 text-sm text-muted-foreground">

                {form.watch("status") === "active"
                  ? "Customer can place orders and access the store."
                  : "Customer account is blocked from purchasing."}

              </p>

            </div>

          </div>

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
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>

        </div>

      </form>

    </DialogContent>

  </Dialog>
);
}