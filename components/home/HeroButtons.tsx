"use client";

import { SITE } from "@/constants/site";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";

export default function HeroButtons() {
  return (
    <div className="flex flex-wrap items-center gap-4">
  <PrimaryButton>
    {SITE.buttons.primary}
  </PrimaryButton>

  <SecondaryButton>
    {SITE.buttons.secondary}
  </SecondaryButton>
</div>
  );
}