import {
  Mail,
  Phone,
  User,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  customer: {
    name: string;
    email?: string;
    phone?: string;

    billingAddress?: {
      address?: string;
      city?: string;
      state?: string;
      pincode?: string;
      country?: string;
    };

    shippingAddress?: {
      address?: string;
      city?: string;
      state?: string;
      pincode?: string;
      country?: string;
    };
  };
}

export default function OrderCustomerCard({
  customer,
}: Props) {
  return (
    <Card>

      <CardHeader>

        <CardTitle>
          Customer Details
        </CardTitle>

      </CardHeader>

      <CardContent className="space-y-6">

        {/* Customer Information */}

        <div className="grid gap-4 md:grid-cols-3">

          {/* Name */}

          <div className="flex items-center gap-3 rounded-xl border p-4">

            <User className="h-5 w-5 text-primary" />

            <div>

              <p className="text-xs text-muted-foreground">
                Name
              </p>

              <p className="font-medium">
                {customer.name}
              </p>

            </div>

          </div>

          {/* Email */}

          <div className="flex items-center gap-3 rounded-xl border p-4">

            <Mail className="h-5 w-5 text-primary" />

            <div>

              <p className="text-xs text-muted-foreground">
                Email
              </p>

              <p className="font-medium">
                {customer.email || "—"}
              </p>

            </div>

          </div>

          {/* Phone */}

          <div className="flex items-center gap-3 rounded-xl border p-4">

            <Phone className="h-5 w-5 text-primary" />

            <div>

              <p className="text-xs text-muted-foreground">
                Phone
              </p>

              <p className="font-medium">
                {customer.phone || "—"}
              </p>

            </div>

          </div>

        </div>

                {/* Addresses */}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* Billing Address */}

          <div className="rounded-xl border p-5">

            <h3 className="mb-4 flex items-center gap-2 font-semibold">

              📍 Billing Address

            </h3>

            <div className="space-y-2 text-sm">

              <p>
                {customer.billingAddress?.address || "—"}
              </p>

              <p>
                {customer.billingAddress?.city || "—"},{" "}
                {customer.billingAddress?.state || "—"}
              </p>

              <p>
                {customer.billingAddress?.pincode || "—"}
              </p>

              <p>
                {customer.billingAddress?.country || "India"}
              </p>

            </div>

          </div>

          {/* Shipping Address */}

          <div className="rounded-xl border p-5">

            <h3 className="mb-4 flex items-center gap-2 font-semibold">

              🚚 Shipping Address

            </h3>

            <div className="space-y-2 text-sm">

              <p>
                {customer.shippingAddress?.address || "—"}
              </p>

              <p>
                {customer.shippingAddress?.city || "—"},{" "}
                {customer.shippingAddress?.state || "—"}
              </p>

              <p>
                {customer.shippingAddress?.pincode || "—"}
              </p>

              <p>
                {customer.shippingAddress?.country || "India"}
              </p>

            </div>

          </div>

        </div>

      </CardContent>

    </Card>

  );
}