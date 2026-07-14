"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  showArrow?: boolean;
}

export default function PrimaryButton({
  children,
  onClick,
  className = "",
  showArrow = true,
}: PrimaryButtonProps) {
  return (
    <Button
      size="lg"
      onClick={onClick}
      className={`h-14 rounded-2xl bg-purple-600 px-8 text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-purple-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.45)] ${className}`}
    >
      {children}

      {showArrow && (
        <ArrowRight className="ml-2 h-5 w-5" />
      )}
    </Button>
  );
}