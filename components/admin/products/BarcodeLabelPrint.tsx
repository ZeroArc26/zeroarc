"use client";

import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import { Download } from "lucide-react";

interface LabelData {
  key: string;
  code: string;
  title: string;
  subtitle: string;
  price: number;
}

function BarcodeLabel({ label }: { label: LabelData }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current && label.code) {
      try {
        JsBarcode(svgRef.current, label.code, {
          format: "CODE128",
          width: 1.6,
          height: 40,
          fontSize: 12,
          margin: 4,
          displayValue: true,
          background: "transparent",
        });
      } catch (err) {
        console.error("Barcode render failed for", label.code, err);
      }
    }
  }, [label.code]);

  function downloadPng() {
    const svg = svgRef.current;
    if (!svg) return;

    const svgString = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      // Upscale for a crisp, print-ready PNG (Canva-friendly).
      const scale = 4;
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Transparent background — no fill here, so the PNG keeps its
      // alpha channel. Note: since the bars themselves are black,
      // this barcode will be invisible on a dark/black tag background
      // — place it on a white/light area of the design.
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = `${label.title.replace(/\s+/g, "-").toLowerCase()}-barcode.png`;
      a.click();
    };
    img.src = url;
  }

  return (
    <div
      id="barcode-label-print"
      className="flex w-[220px] flex-col items-center gap-1 rounded-lg border border-zinc-300 bg-white p-3 print:break-inside-avoid"
    >
      <p className="w-full truncate text-center text-xs font-bold text-zinc-900">
        {label.title}
      </p>
      <p className="text-[10px] text-zinc-500">{label.subtitle}</p>
      <svg ref={svgRef} />
      <p className="text-xs font-semibold text-zinc-900">₹{label.price}</p>

      <button
        onClick={downloadPng}
        className="mt-1 flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-[11px] font-semibold text-zinc-600 hover:bg-zinc-50 print:hidden"
      >
        <Download className="h-3 w-3" />
        Download PNG
      </button>
    </div>
  );
}

interface ProductForLabel {
  basicInfo?: { title?: string };
  pricing?: { sellingPrice?: number };
  inventory?: { barcode?: string };
  variants?: { color: string }[];
}

export default function BarcodeLabelPrint({ product }: { product: ProductForLabel }) {
  const colorNames: string[] = Array.from(
    new Set((product?.variants || []).map((v) => v.color))
  );

  const productLabel: LabelData | null = product?.inventory?.barcode
    ? {
        key: "product",
        code: product.inventory.barcode,
        title: product.basicInfo?.title,
        subtitle: colorNames.length ? `All colors: ${colorNames.join(", ")}` : "All variants",
        price: product.pricing?.sellingPrice,
      }
    : null;

  return (
    <div className="space-y-6">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #barcode-label-print,
          #barcode-label-print * {
            visibility: visible;
          }
          #barcode-label-print {
            position: fixed;
            top: 20px;
            left: 20px;
          }
        }
      `}</style>

      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-xl font-bold text-white">Barcode Label</h1>
          <p className="text-sm text-zinc-400">{product.basicInfo?.title}</p>
        </div>
        <button
          onClick={() => window.print()}
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
        >
          Print Label
        </button>
      </div>

      {productLabel ? (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400 print:hidden">
            One barcode per product — covers every color/size. Scan this at
            the POS, then pick color/size manually.
          </p>
          <BarcodeLabel label={productLabel} />
        </div>
      ) : (
        <p className="text-sm text-zinc-400">
          No barcode found on this product yet. Open it in the admin editor —
          a barcode is auto-generated under Inventory.
        </p>
      )}
    </div>
  );
}
