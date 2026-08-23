"use client";

import { useState } from "react";
import { Printer, Download, X } from "lucide-react";

import ThermalReceipt from "./ThermalReceipt";

interface ReceiptOrder {
  orderNumber: string;
  invoiceNumber: string;
  date: string;
  customer: { name: string; phone: string };
  items: {
    name: string;
    color: string;
    size: string;
    quantity: number;
    price: number;
    totalAmount: number;
  }[];
  pricing: { subtotal: number; totalTax: number; grandTotal: number };
  payment: { method: string };
  soldBy?: string;
}

interface ReceiptModalProps {
  order: ReceiptOrder;
  orderId: string;
  onClose: () => void;
}

export default function ReceiptModal({ order, orderId, onClose }: ReceiptModalProps) {
  const [format, setFormat] = useState<"thermal" | "a4">("thermal");

  function handleThermalPrint() {
    window.print();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 print:static print:bg-white print:p-0">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #thermal-receipt,
          #thermal-receipt * {
            visibility: visible;
          }
          #thermal-receipt {
            position: fixed;
            top: 0;
            left: 0;
            width: 80mm;
            margin: 0;
            padding: 8px;
          }
          @page {
            size: 80mm auto;
            margin: 0;
          }
        }
      `}</style>
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 print:max-h-none print:overflow-visible print:rounded-none print:shadow-none">
        <div className="mb-4 flex items-center justify-between print:hidden">
          <h2 className="text-lg font-bold text-zinc-900">Sale Complete ✅</h2>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-zinc-100">
            <X className="h-5 w-5 text-zinc-500" />
          </button>
        </div>

        <div className="mb-4 flex gap-2 print:hidden">
          <button
            onClick={() => setFormat("thermal")}
            className={`flex-1 rounded-lg border py-2 text-sm font-semibold ${
              format === "thermal"
                ? "border-violet-600 bg-violet-50 text-violet-700"
                : "border-zinc-200 text-zinc-600"
            }`}
          >
            Thermal Receipt
          </button>
          <button
            onClick={() => setFormat("a4")}
            className={`flex-1 rounded-lg border py-2 text-sm font-semibold ${
              format === "a4"
                ? "border-violet-600 bg-violet-50 text-violet-700"
                : "border-zinc-200 text-zinc-600"
            }`}
          >
            A4 Invoice (GST)
          </button>
        </div>

        {format === "thermal" ? (
          <>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 py-4">
              <ThermalReceipt order={order} />
            </div>
            <button
              onClick={handleThermalPrint}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-sm font-bold text-white hover:bg-zinc-800 print:hidden"
            >
              <Printer className="h-4 w-4" />
              Print Receipt
            </button>
          </>
        ) : (
          <div className="print:hidden">
            <p className="mb-4 text-sm text-zinc-500">
              Download the full GST-compliant A4 invoice for this sale — same format used
              for online orders.
            </p>
            <a
              href={`/api/orders/${orderId}/invoice`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-sm font-bold text-white hover:bg-zinc-800"
            >
              <Download className="h-4 w-4" />
              Download A4 Invoice PDF
            </a>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-3 w-full rounded-xl border border-zinc-200 py-2.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 print:hidden"
        >
          Start New Sale
        </button>
      </div>
    </div>
  );
}
