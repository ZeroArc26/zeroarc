import {
  Boxes,
  PackageCheck,
  AlertTriangle,
  PackageX,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface InventoryStatsProps {
  totalSkus: number;
  totalUnits: number;
  lowStock: number;
  outOfStock: number;
}

export default function InventoryStats({
  totalSkus,
  totalUnits,
  lowStock,
  outOfStock,
}: InventoryStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

          <CardTitle className="text-sm font-medium">
            Total SKUs
          </CardTitle>

          <Boxes className="h-5 w-5 text-primary" />

        </CardHeader>

        <CardContent>

          <div className="text-3xl font-bold">
            {totalSkus.toLocaleString()}
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm text-emerald-600">

            <TrendingUp className="h-4 w-4" />

            Active inventory

          </div>

        </CardContent>
      </Card>

            {/* Card 2 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Stock Units
          </CardTitle>

          <PackageCheck className="h-5 w-5 text-primary" />
        </CardHeader>

        <CardContent>
          <div className="text-3xl font-bold">
            {totalUnits.toLocaleString()}
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm text-emerald-600">
            <TrendingUp className="h-4 w-4" />
            Available units
          </div>
        </CardContent>
      </Card>

      {/* Card 3 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Low Stock
          </CardTitle>

          <AlertTriangle className="h-5 w-5 text-yellow-500" />
        </CardHeader>

        <CardContent>
          <div className="text-3xl font-bold">
            {lowStock.toLocaleString()}
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm text-yellow-600">
            <AlertTriangle className="h-4 w-4" />
            Needs attention
          </div>
        </CardContent>
      </Card>

      {/* Card 4 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Out of Stock
          </CardTitle>

          <PackageX className="h-5 w-5 text-red-500" />
        </CardHeader>

        <CardContent>
          <div className="text-3xl font-bold">
            {outOfStock.toLocaleString()}
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
            <TrendingDown className="h-4 w-4" />
            Immediate action required
          </div>
        </CardContent>
      </Card>
    </div>
  );
}