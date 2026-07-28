import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  badge?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  action,
  backHref,
  backLabel = "Back",
  badge,
}: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-transparent to-cyan-500/5" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          {backHref && (
            <Link
              href={backHref}
              className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
            >
              <ArrowLeft size={16} />
              {backLabel}
            </Link>
          )}

          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black tracking-tight text-white">
              {title}
            </h1>

            {badge}
          </div>

          {description && (
            <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-400">
              {description}
            </p>
          )}
        </div>

        {action && (
          <div className="flex flex-wrap gap-3">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}