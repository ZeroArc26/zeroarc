import Link from "next/link";
import { Users, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CustomerHeaderProps {
  showBackButton?: boolean;
}

export default function CustomerHeader({
  showBackButton = false,
}: CustomerHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Users className="h-7 w-7 text-primary" />

          <h1 className="text-3xl font-bold tracking-tight">
            Customers
          </h1>
        </div>

        <p className="text-sm text-muted-foreground">
          Manage customer accounts, view customer details,
          monitor activity, and track customer growth.
        </p>
      </div>

      {showBackButton && (
        <Button asChild variant="outline">
          <Link href="/admin/dashboard/customers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      )}
    </div>
  );
}