"use client";

import { Suspense } from "react";
import OrderSuccessContent from "./OrderSuccessContent";

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-[#09090B] text-white">
          Loading...
        </main>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}