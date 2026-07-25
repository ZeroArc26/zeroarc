import { ReactNode } from "react";

interface DashboardSectionProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

export default function DashboardSection({
  title,
  description,
  action,
  children,
}: DashboardSectionProps) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-sm text-zinc-400">
              {description}
            </p>
          )}
        </div>

        {action}
      </div>

      {children}
    </section>
  );
}