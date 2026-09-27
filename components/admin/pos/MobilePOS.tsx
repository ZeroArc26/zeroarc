"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  ScanBarcode,
  Camera,
  Plus,
  Minus,
  Trash2,
  Loader2,
  Check,
  FileText,
  RotateCcw,
} from "lucide-react";

import CameraScanner from "@/components/admin/pos/CameraScanner";

interface Variant {
  color: string;
  colorHex?: string;
  size: string;
  stock: number;
  price: number;
}

interface LookedUpProduct {
  _id: string;
  title: string;
  image: string;
  sellingPrice: number;
  variants: Variant[];
}

interface CartLine {
  key: string;
  productId: string;
  title: string;
  image: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  stock: number;
}

interface CompletedSale {
  orderId: string;
  orderNumber: string;
  invoiceNumber: string;
  grandTotal: number;
}

const PAYMENT_METHODS = [
  { id: "cash", label: "Cash" },
  { id: "upi", label: "UPI" },
  { id: "card", label: "Card" },
];

function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export default function MobilePOS({ adminName }: { adminName?: string }) {
  const [barcodeInput, setBarcodeInput] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [looking, setLooking] = useState(false);

  const [pendingProduct, setPendingProduct] = useState<LookedUpProduct | null>(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);

  const [cart, setCart] = useState<CartLine[]>([]);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi" | "card">("cash");
  const [completing, setCompleting] = useState(false);
  const [completedSale, setCompletedSale] = useState<CompletedSale | null>(null);

  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const autoScanTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/pos-sw.js").catch(() => {});
    }
    barcodeInputRef.current?.focus();
  }, []);

  // Auto-detect safety net: most Bluetooth/USB scanners send an Enter
  // keystroke after the barcode (already handled by onKeyDown below),
  // but some budget ones don't. Since a scanner "types" a full
  // barcode near-instantly (unlike a human), if the field goes quiet
  // for 300ms right after being filled, treat that as "done scanning"
  // and look it up automatically — no Enter required.
  useEffect(() => {
    if (autoScanTimer.current) clearTimeout(autoScanTimer.current);
    if (!barcodeInput.trim()) return;

    autoScanTimer.current = setTimeout(() => {
      lookupBarcode(barcodeInput);
    }, 300);

    return () => {
      if (autoScanTimer.current) clearTimeout(autoScanTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barcodeInput]);

  async function lookupBarcode(code: string) {
    const trimmed = code.trim();
    if (!trimmed || looking) return;

    setLooking(true);
    try {
      const res = await fetch(`/api/pos/lookup-product?barcode=${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Product not found for that barcode.");
        return;
      }

      const product: LookedUpProduct = data.product;
      setPendingProduct(product);
      setSelectedColor(product.variants[0]?.color || "");
      setSelectedSize(product.variants[0]?.size || "");
      setQty(1);
    } catch (err) {
      console.error("Barcode lookup failed:", err);
      toast.error("Lookup failed. Check your connection.");
    } finally {
      setLooking(false);
      setBarcodeInput("");
      barcodeInputRef.current?.focus();
    }
  }

  const availableColors = pendingProduct
    ? [...new Set(pendingProduct.variants.map((v) => v.color))]
    : [];
  const availableSizes = pendingProduct
    ? pendingProduct.variants.filter((v) => v.color === selectedColor).map((v) => v.size)
    : [];
  const activeVariant = pendingProduct?.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  function addToCart() {
    if (!pendingProduct || !activeVariant) return;

    if (qty > activeVariant.stock) {
      toast.error(`Only ${activeVariant.stock} in stock for ${selectedColor}/${selectedSize}.`);
      return;
    }

    setCart((prev) => [
      ...prev,
      {
        key: `${pendingProduct._id}-${crypto.randomUUID()}`,
        productId: pendingProduct._id,
        title: pendingProduct.title,
        image: pendingProduct.image,
        color: selectedColor,
        size: selectedSize,
        price: activeVariant.price || pendingProduct.sellingPrice,
        quantity: qty,
        stock: activeVariant.stock,
      },
    ]);

    setPendingProduct(null);
    toast.success(`Added ${pendingProduct.title}`);
    // Refocus the barcode field so a Bluetooth/USB scanner (which
    // just "types" into whatever has focus) can keep scanning the
    // next item back-to-back, without the cashier needing to tap
    // the field again after the color/size buttons stole focus.
    setTimeout(() => barcodeInputRef.current?.focus(), 50);
  }

  function removeLine(key: string) {
    setCart((prev) => prev.filter((l) => l.key !== key));
  }

  function updateQty(key: string, delta: number) {
    setCart((prev) =>
      prev.map((l) =>
        l.key === key
          ? { ...l, quantity: Math.max(1, Math.min(l.stock, l.quantity + delta)) }
          : l
      )
    );
  }

  const total = round2(cart.reduce((sum, l) => sum + l.price * l.quantity, 0));

  async function completeSale() {
    if (cart.length === 0) {
      toast.error("Cart is empty.");
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error("Customer name and phone are required.");
      return;
    }

    setCompleting(true);
    try {
      const res = await fetch("/api/pos/complete-sale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((l) => ({
            productId: l.productId,
            title: l.title,
            image: l.image,
            color: l.color,
            size: l.size,
            price: l.price,
            quantity: l.quantity,
          })),
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          paymentMethod,
        }),
      });
      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Failed to complete sale.");
        return;
      }

      setCompletedSale({
        orderId: data.orderId,
        orderNumber: data.orderNumber,
        invoiceNumber: data.invoiceNumber,
        grandTotal: data.order?.pricing?.grandTotal ?? total,
      });
    } catch (err) {
      console.error("Complete sale failed:", err);
      toast.error("Failed to complete sale. Check your connection.");
    } finally {
      setCompleting(false);
    }
  }

  function startNewSale() {
    setCart([]);
    setCustomerName("");
    setCustomerPhone("");
    setPaymentMethod("cash");
    setCompletedSale(null);
    setTimeout(() => barcodeInputRef.current?.focus(), 100);
  }

  if (completedSale) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-6 text-white">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
          <Check className="h-10 w-10" />
        </div>
        <h1 className="mt-6 text-2xl font-black">Sale Complete!</h1>
        <p className="mt-1 text-zinc-400">Order #{completedSale.orderNumber}</p>
        <p className="mt-4 text-3xl font-black text-violet-400">
          ₹{completedSale.grandTotal}
        </p>

        <div className="mt-10 w-full max-w-sm space-y-3">
          <a
            href={`/api/orders/${completedSale.orderId}/invoice`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 py-4 font-bold text-white active:bg-violet-500"
          >
            <FileText className="h-5 w-5" />
            View / Download Invoice
          </a>
          <button
            onClick={startNewSale}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-700 py-4 font-bold text-white active:bg-zinc-900"
          >
            <RotateCcw className="h-5 w-5" />
            New Sale
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 pb-8 text-white">
      <div
        className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/95 px-4 pb-3 backdrop-blur"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)" }}
      >
        <h1 className="text-lg font-black">ZeroArc POS</h1>
        {adminName && <p className="text-xs text-zinc-500">Signed in as {adminName}</p>}
      </div>

      <div className="space-y-4 p-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Scan or type barcode
          </p>
          <div className="flex gap-2">
            <input
              ref={barcodeInputRef}
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lookupBarcode(barcodeInput)}
              placeholder="Barcode..."
              className="flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-violet-500"
              autoComplete="off"
            />
            <button
              onClick={() => setShowCamera(true)}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-600 active:bg-violet-500"
            >
              <Camera className="h-5 w-5" />
            </button>
          </div>
          {looking && (
            <p className="mt-2 flex items-center gap-2 text-sm text-zinc-400">
              <Loader2 className="h-4 w-4 animate-spin" /> Looking up...
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Cart ({cart.length})
          </p>
          {cart.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center text-zinc-500">
              <ScanBarcode className="mb-2 h-8 w-8" />
              <p className="text-sm">Scan a product to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((line) => (
                <div key={line.key} className="flex items-center gap-3 rounded-xl bg-zinc-950 p-3">
                  {line.image && (
                    <img
                      src={line.image}
                      alt={line.title}
                      className="h-14 w-14 shrink-0 rounded-lg object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{line.title}</p>
                    <p className="text-xs text-zinc-500">
                      {line.color} / {line.size} · ₹{line.price}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => updateQty(line.key, -1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-5 text-center text-sm font-bold">{line.quantity}</span>
                    <button
                      onClick={() => updateQty(line.key, 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => removeLine(line.key)}
                      className="ml-1 flex h-7 w-7 items-center justify-center rounded-full text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
                <span className="font-semibold text-zinc-400">Total</span>
                <span className="text-xl font-black text-violet-400">₹{total}</span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Customer & Payment
          </p>
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Customer name"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-violet-500"
          />
          <input
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="Phone number"
            type="tel"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-violet-500"
          />

          <div className="grid grid-cols-3 gap-2">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setPaymentMethod(m.id as "cash" | "upi" | "card")}
                className={`rounded-xl border py-3 text-sm font-semibold ${
                  paymentMethod === m.id
                    ? "border-violet-500 bg-violet-500/10 text-violet-300"
                    : "border-zinc-700 text-zinc-400"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={completeSale}
          disabled={completing || cart.length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 py-4 text-lg font-bold text-white active:bg-violet-500 disabled:opacity-40"
        >
          {completing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            `Complete Sale — ₹${total}`
          )}
        </button>
      </div>

      {pendingProduct && (
        <div className="fixed inset-0 z-30 flex items-end bg-black/70">
          <div
            className="w-full rounded-t-3xl bg-zinc-900 p-5"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)" }}
          >
            <div className="mb-4 flex items-center gap-3">
              {pendingProduct.image && (
                <img
                  src={pendingProduct.image}
                  alt={pendingProduct.title}
                  className="h-16 w-16 rounded-xl object-cover"
                />
              )}
              <div>
                <p className="font-bold">{pendingProduct.title}</p>
                <p className="text-sm text-zinc-400">₹{pendingProduct.sellingPrice}</p>
              </div>
            </div>

            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Color
            </p>
            <div className="mb-4 flex flex-wrap gap-2">
              {availableColors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setSelectedColor(color);
                    const firstSize = pendingProduct.variants.find(
                      (v) => v.color === color
                    )?.size;
                    if (firstSize) setSelectedSize(firstSize);
                  }}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                    selectedColor === color
                      ? "border-violet-500 bg-violet-500/10 text-violet-300"
                      : "border-zinc-700 text-zinc-300"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>

            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Size
            </p>
            <div className="mb-4 flex flex-wrap gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                    selectedSize === size
                      ? "border-violet-500 bg-violet-500/10 text-violet-300"
                      : "border-zinc-700 text-zinc-300"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {activeVariant && (
              <p className="mb-4 text-xs text-zinc-500">{activeVariant.stock} in stock</p>
            )}

            <div className="mb-4 flex items-center justify-between rounded-xl bg-zinc-950 p-3">
              <span className="text-sm font-semibold text-zinc-400">Quantity</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-6 text-center font-bold">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setPendingProduct(null);
                  setTimeout(() => barcodeInputRef.current?.focus(), 50);
                }}
                className="flex-1 rounded-2xl border border-zinc-700 py-3.5 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={addToCart}
                disabled={!activeVariant}
                className="flex-1 rounded-2xl bg-violet-600 py-3.5 font-bold active:bg-violet-500 disabled:opacity-40"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {showCamera && (
        <CameraScanner
          onScan={(code) => {
            setShowCamera(false);
            lookupBarcode(code);
          }}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
}
