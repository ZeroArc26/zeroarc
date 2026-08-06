import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function InventoryTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Trend</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex h-64 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
          <TrendingUp className="h-8 w-8" />
          <p className="text-sm font-medium">Coming Soon</p>
          <p className="max-w-xs text-xs">
            Stock trend history will appear here once stock-movement
            tracking is built.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}