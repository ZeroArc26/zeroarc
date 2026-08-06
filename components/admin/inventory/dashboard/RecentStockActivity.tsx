import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

export default function RecentStockActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Stock Activity</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex h-64 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
          <Activity className="h-8 w-8" />
          <p className="text-sm font-medium">Coming Soon</p>
          <p className="max-w-xs text-xs">
            A log of stock changes (who adjusted what, and when) will
            appear here once stock-movement tracking is built.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}