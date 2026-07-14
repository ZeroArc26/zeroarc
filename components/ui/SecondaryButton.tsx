"use client";

import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface SecondaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function SecondaryButton({
  children,
  onClick,
  className = "",
}: SecondaryButtonProps) {
  return (
    <Button
      variant="outline"
      size="lg"
      onClick={onClick}
      className={`h-14 rounded-2xl border-zinc-700 bg-transparent px-8 text-base text-white transition-all duration-300 hover:scale-105 hover:border-purple-500 hover:bg-purple-500/10 ${className}`}
    >
      {children}
    </Button>
  );
}