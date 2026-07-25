import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({
  children,
  className,
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}