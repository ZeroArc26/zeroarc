import Card from "@/components/admin/shared/Card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;

  trend?: string;
  trendUp?: boolean;
}

export default function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendUp,
}: StatsCardProps) {
  return (
  <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/10">
    {/* Top Accent */}
    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 opacity-80" />

    <div className="flex items-start justify-between">
      <div className="space-y-3">
        <p className="text-sm font-medium text-zinc-400">
          {title}
        </p>

        <h2 className="text-4xl font-bold tracking-tight text-white">
          {value}
        </h2>

        <div className="flex items-center gap-2">
          {trend && (
            <span
              className={`rounded-full px-2 py-1 text-xs font-semibold ${
                trendUp
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-red-500/15 text-red-400"
              }`}
            >
              {trend}
            </span>
          )}

          {description && (
            <p className="text-sm text-zinc-500">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-violet-500/10 p-4 transition-all duration-300 group-hover:bg-violet-500/20 group-hover:scale-110">
        <Icon className="h-7 w-7 text-violet-400" />
      </div>
    </div>
  </Card>
);
}