import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#09090B] px-6">

      <div className="w-full max-w-xl rounded-3xl border border-zinc-800 bg-zinc-900/50 p-10 text-center shadow-2xl">

        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10">

          <CheckCircle2
            size={60}
            className="text-green-400"
          />

        </div>

        <h1 className="mt-8 text-4xl font-black text-white">
          Payment Successful
        </h1>

        <p className="mt-4 text-zinc-400">
          Thank you for shopping with ZEROARC.
          <br />
          Your order has been received successfully.
        </p>

        <div className="mt-10 space-y-4">

          <Link
            href="/shop"
            className="block rounded-2xl bg-purple-600 py-4 font-semibold text-white transition hover:bg-purple-500"
          >
            Continue Shopping
          </Link>

          <button
            disabled
            className="w-full cursor-not-allowed rounded-2xl border border-zinc-700 py-4 font-semibold text-zinc-500"
          >
            View Orders (Coming Soon)
          </button>

        </div>

      </div>

    </main>
  );
}