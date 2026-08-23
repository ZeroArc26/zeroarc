"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Camera, Trash2, ShoppingBag, Loader2 } from "lucide-react";

import CameraScanner from "./CameraScanner";
import ReceiptModal from "./ReceiptModal";

interface LookupVariant {
  color: string;
  colorHex?: string;
  size: string;
  stock: number;
  price: number;
}

interface LookupProduct {
  _id: string;
  title: string;
  image: string;
  sellingPrice: number;
  variants: LookupVariant[];
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

export default function POSTerminal() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [barcodeInput, setBarcodeInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const [lookedUpProduct, setLookedUpProduct] = useState<LookupProduct | null>(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedQty, setSelectedQty] = useState(1);

  const [cart, setCart] = useState<CartLine[]>([]);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi" | "card">("cash");

  const [completing, setCompleting] = useState(false);
  const [receipt, setReceipt] = useState<{ order: any; orderId: string } | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function lookupBarcode(code: string) {
    if (!code.trim()) return;

    setScanning(true);
    try {
      const res = await fetch(`/api/pos/lookup-product?barcode=${encodeURIComponent(code.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Product not found for this barcode.");
        setLookedUpProduct(null);
        return;
      }

      setLookedUpProduct(data.product);
      setSelectedColor(data.product.variants?.[0]?.color || "");
      setSelectedSize("");
      setSelectedQty(1);
    } catch (err) {
      toast.error("Lookup failed. Check your connection.");
    } finally {
      setScanning(false);
      setBarcodeInput("");
      inputRef.current?.focus();
    }
  }

  function handleBarcodeKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      lookupBarcode(barcodeInput);
    }
  }

  const availableColors = Array.from(
    new Set((lookedUpProduct?.variants ?? []).map((v) => v.color))
  );
  const sizesForColor = (lookedUpProduct?.variants ?? []).filter(
    (v) => v.color === selectedColor
  );
  const activeVariant = (lookedUpProduct?.variants ?? []).find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  function addToCart() {
    if (!lookedUpProduct || !activeVariant) {
      toast.error("Select a color and size first.");
      return;
    }
    if (activeVariant.stock < selectedQty) {
      toast.error(`Only ${activeVariant.stock} in stock.`);
      return;
    }

    const key = `${lookedUpProduct._id}-${selectedColor}-${selectedSize}`;

    setCart((prev) => {
      const existing = prev.find((l) => l.key === key);
      if (existing) {
        return prev.map((l) =>
          l.key === key ? { ...l, quantity: l.quantity + selectedQty } : l
        );
      }
      return [
        ...prev,
        {
          key,
          productId: lookedUpProduct._id,
          title: lookedUpProduct.title,
          image: lookedUpProduct.image,
          color: selectedColor,
          size: selectedSize,
          price: activeVariant.price || lookedUpProduct.sellingPrice,
          quantity: selectedQty,
          stock: activeVariant.stock,
        },
      ];
    });

    toast.success("Added to sale");
    setLookedUpProduct(null);
  }

  function removeLine(key: string) {
    setCart((prev) => prev.filter((l) => l.key !== key));
  }

  function updateQty(key: string, qty: number) {
    setCart((prev) =>
      prev.map((l) => (l.key === key ? { ...l, quantity: Math.max(1, qty) } : l))
    );
  }

  const subtotal = cart.reduce((sum, l) => sum + l.price * l.quantity, 0);

  async function completeSale() {
    if (!cart.length) {
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
          customerName,
          customerPhone,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to complete sale.");
      }

      setReceipt({ order: data.order, orderId: data.orderId });
      setCart([]);
      setCustomerName("");
      setCustomerPhone("");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setCompleting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
      {/* LEFT: Scan + product lookup */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <label className="mb-2 block text-sm font-semibold text-zinc-300">
            Scan Barcode
          </label>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              onKeyDown={handleBarcodeKeyDown}
              placeholder="Scan with USB scanner or type barcode + Enter"
              className="flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
              autoFocus
            />
            <button
              onClick={() => setShowCamera(true)}
              className="flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-3 text-sm font-semibold text-zinc-300 hover:bg-zinc-800"
            >
              <Camera className="h-4 w-4" />
              Camera
            </button>
          </div>
          {scanning && (
            <p className="mt-2 flex items-center gap-2 text-xs text-zinc-400">
              <Loader2 className="h-3 w-3 animate-spin" /> Looking up product...
            </p>
          )}
        </div>

        {lookedUpProduct && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="mb-4 flex items-center gap-4">
              {lookedUpProduct.image && (
                <img
                  src={lookedUpProduct.image}
                  alt={lookedUpProduct.title}
                  className="h-16 w-16 rounded-lg object-cover"
                />
              )}
              <div>
                <p className="font-bold text-white">{lookedUpProduct.title}</p>
                <p className="text-sm text-zinc-400">₹{lookedUpProduct.sellingPrice}</p>
              </div>
            </div>

            <div className="mb-3">
              <p className="mb-1.5 text-xs font-semibold text-zinc-400">Color</p>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setSelectedColor(color);
                      setSelectedSize("");
                    }}
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${
                      selectedColor === color
                        ? "border-violet-500 bg-violet-500/10 text-violet-300"
                        : "border-zinc-700 text-zinc-300"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <p className="mb-1.5 text-xs font-semibold text-zinc-400">Size</p>
              <div className="flex flex-wrap gap-2">
                {sizesForColor.map((v) => (
                  <button
                    key={v.size}
                    disabled={v.stock <= 0}
                    onClick={() => setSelectedSize(v.size)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40 ${
                      selectedSize === v.size
                        ? "border-violet-500 bg-violet-500/10 text-violet-300"
                        : "border-zinc-700 text-zinc-300"
                    }`}
                  >
                    {v.size} ({v.stock})
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4 flex items-center gap-3">
              <p className="text-xs font-semibold text-zinc-400">Qty</p>
              <input
                type="number"
                min={1}
                value={selectedQty}
                onChange={(e) => setSelectedQty(Math.max(1, Number(e.target.value)))}
                className="w-20 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-white outline-none focus:border-violet-500"
              />
            </div>

            <button
              onClick={addToCart}
              disabled={!activeVariant}
              className="w-full rounded-xl bg-violet-600 py-2.5 text-sm font-bold text-white hover:bg-violet-700 disabled:opacity-50"
            >
              Add to Sale
            </button>
          </div>
        )}
      </div>

      {/* RIGHT: Cart + checkout */}
      <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <h3 className="flex items-center gap-2 font-bold text-white">
          <ShoppingBag className="h-4 w-4" /> Current Sale ({cart.length})
        </h3>

        <div className="max-h-64 space-y-2 overflow-y-auto">
          {cart.length === 0 ? (
            <p className="py-6 text-center text-sm text-zinc-500">No items scanned yet</p>
          ) : (
            cart.map((line) => (
              <div
                key={line.key}
                className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{line.title}</p>
                  <p className="text-xs text-zinc-500">
                    {line.color} / {line.size} • ₹{line.price}
                  </p>
                </div>
                <input
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={(e) => updateQty(line.key, Number(e.target.value))}
                  className="mx-2 w-14 rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-center text-sm text-white"
                />
                <button
                  onClick={() => removeLine(line.key)}
                  className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-zinc-800 pt-3">
          <div className="flex justify-between text-sm font-bold text-white">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <p className="mt-0.5 text-[11px] text-zinc-500">GST included in price</p>
        </div>

        <div className="space-y-2 border-t border-zinc-800 pt-3">
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Customer name"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
          />
          <input
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="Customer phone"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex gap-2">
          {(["cash", "upi", "card"] as const).map((method) => (
            <button
              key={method}
              onClick={() => setPaymentMethod(method)}
              className={`flex-1 rounded-lg border py-2 text-xs font-semibold uppercase ${
                paymentMethod === method
                  ? "border-violet-500 bg-violet-500/10 text-violet-300"
                  : "border-zinc-700 text-zinc-400"
              }`}
            >
              {method}
            </button>
          ))}
        </div>

        <button
          onClick={completeSale}
          disabled={completing || !cart.length}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50"
        >
          {completing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Complete Sale
        </button>
      </div>

      {showCamera && (
        <CameraScanner
          onScan={(code) => {
            setShowCamera(false);
            setBarcodeInput(code);
            lookupBarcode(code);
          }}
          onClose={() => setShowCamera(false)}
        />
      )}

      {receipt && (
        <ReceiptModal
          order={receipt.order}
          orderId={receipt.orderId}
          onClose={() => setReceipt(null)}
        />
      )}
    </div>
  );
}
