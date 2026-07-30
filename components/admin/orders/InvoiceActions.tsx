import {
  FileText,
  Truck,
  Download,
  Eye,
} from "lucide-react";

interface Props {
  orderId: string;
}

export default function InvoiceActions({
  orderId,
}: Props) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

      <h2 className="text-xl font-bold text-white">
        Documents
      </h2>

      <p className="mt-2 text-sm text-zinc-400">
        Preview and download printable order documents.
      </p>

      <div className="mt-6 space-y-5">

        {/* Customer Invoice */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 transition-all duration-300 hover:border-violet-500/50 hover:bg-zinc-900">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
              <FileText className="h-6 w-6 text-violet-400" />
            </div>

            <div className="flex-1">

              <h3 className="font-semibold text-white">
                Customer Invoice
              </h3>

              <p className="mt-1 text-sm text-zinc-400">
                GST Tax Invoice for the customer.
              </p>

            </div>

          </div>

          <div className="mt-6 grid gap-3">

            <button
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 px-4 py-3 text-sm font-medium text-white transition hover:border-violet-500 hover:bg-zinc-800"
            >
              <Eye size={18} />
              Preview Invoice
            </button>

            <button
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-violet-500"
            >
              <Download size={18} />
              Download PDF
            </button>

          </div>

        </div>

        {/* Shipping Label */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 transition-all duration-300 hover:border-orange-500/50 hover:bg-zinc-900">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/10">
              <Truck className="h-6 w-6 text-orange-400" />
            </div>

            <div className="flex-1">

              <h3 className="font-semibold text-white">
                Shipping Label
              </h3>

              <p className="mt-1 text-sm text-zinc-400">
                Print-ready courier shipping label.
              </p>

            </div>

          </div>

          <div className="mt-6 grid gap-3">

            <button
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 px-4 py-3 text-sm font-medium text-white transition hover:border-orange-500 hover:bg-zinc-800"
            >
              <Eye size={18} />
              Preview Label
            </button>

            <button
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-orange-500"
            >
              <Download size={18} />
              Download PDF
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}