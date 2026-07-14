"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/constants/site";

export default function HeroButtons() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Primary Button */}
      <Button
        size="lg"
        className="h-14 rounded-2xl bg-purple-600 px-8 text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-purple-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.45)]"
      >
        {SITE.buttons.primary}
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>

      {/* Secondary Button */}
      <Button
        variant="outline"
        size="lg"
        className="h-14 rounded-2xl border-zinc-700 bg-transparent px-8 text-base text-white transition-all duration-300 hover:scale-105 hover:border-purple-500 hover:bg-purple-500/10"
      >
        {SITE.buttons.secondary}
      </Button>
    </div>
  );
}