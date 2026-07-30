import {
  Download,
  Eye,
  Printer,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  orderId: string;
  trackingId?: string;
  hasShippingLabel?: boolean;
}

export default function ShippingLabelActions({
  orderId,
  trackingId,
  hasShippingLabel = false,
}: Props) {
  return (
    <Card>

      <CardHeader>

        <CardTitle className="flex items-center gap-2">

          <Truck className="h-5 w-5" />

          Shipping Label

        </CardTitle>

      </CardHeader>

      <CardContent className="space-y-4">
                {/* Tracking Information */}

        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-xs font-medium text-muted-foreground">
            Tracking ID
          </p>

          <p className="mt-1 break-all font-mono text-sm">
            {trackingId ?? "Not Generated"}
          </p>
        </div>

        {/* Generate Shipping Label */}

        <Button
          className="w-full"
        >
          Generate Label
        </Button>

        {/* Preview */}

        <Button
          variant="outline"
          className="w-full"
          disabled={!hasShippingLabel}
        >
          <Eye className="mr-2 h-4 w-4" />

          Preview Label
        </Button>

        {/* Download */}

        <Button
          variant="outline"
          className="w-full"
          disabled={!hasShippingLabel}
        >
          <Download className="mr-2 h-4 w-4" />

          Download PDF
        </Button>

        {/* Print */}

        <Button
          variant="outline"
          className="w-full"
          disabled={!hasShippingLabel}
        >
          <Printer className="mr-2 h-4 w-4" />

          Print Label
        </Button>

      </CardContent>

    </Card>
  );
}