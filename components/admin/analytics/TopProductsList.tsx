import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  data: { name: string; revenue: number; quantity: number }[];
}

export default function TopProductsList({ data }: Props) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <Card className="border-zinc-800 bg-zinc-900/40">
      <CardHeader>
        <CardTitle className="text-white">Top Products</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <p className="text-sm text-zinc-500">No sales in this range.</p>
        ) : (
          data.map((product, i) => (
            <div key={product.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-white">
                  <span className="text-zinc-500">#{i + 1}</span>
                  {product.name}
                </span>
                <span className="text-zinc-400">
                  ₹{product.revenue.toLocaleString("en-IN")} · {product.quantity} sold
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-violet-500"
                  style={{ width: `${(product.revenue / maxRevenue) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}