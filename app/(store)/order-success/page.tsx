"use client";

import { Suspense } from "react";
import OrderSuccessContent from "./OrderSuccessContent";

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-white text-zinc-500">
          Loading...
        </main>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}