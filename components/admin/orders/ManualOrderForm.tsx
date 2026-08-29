"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Search, Upload, Trash2, Loader2, X } from "lucide-react";

interface ProductVariant {
  color: string;
  size: string;
  stock: number;
  price: number;
}

interface SearchProduct {
  _id: string;
  title: string;
  image: string;
  sellingPrice: number;
  variants: ProductVariant[];
}

interface OrderLine {
  key: string;
  productId: string;
  title: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  stock: number;
  customDesignImage?: string;
  uploadingDesign?: boolean;
}

export default function ManualOrderForm() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [lines, setLines] = useState<OrderLine[]>([]);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi" | "card" | "cash">("upi");
  const [paymentStatus, setPaymentStatus] = useState<"paid" | "pending">("paid");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function searchProducts(showErrors: boolean) {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setSearching(true);
    try {
      const res = await fetch(`/api/admin/manual-order/search-products?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success) {
        setResults(data.products);
        setShowDropdown(true);
        if (showErrors && data.products.length === 0) {
          toast.error("No active product found matching that name.");
        }
      } else if (showErrors) {
        toast.error(data.message || "Search failed.");
      }
    } catch {
      if (showErrors) toast.error("Search failed. Check your connection.");
    } finally {
      setSearching(false);
    }
  }

  // Live search: re-search automatically as the admin types, with a short
  // debounce so it doesn't fire on every keystroke.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      searchProducts(false); // silent — no toasts while the admin is still typing
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Close the dropdown when clicking outside it.
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function addLine(product: SearchProduct) {
    const firstVariant = product.variants[0];
    const key = `${product._id}-${crypto.randomUUID()}`;
    setLines((prev) => [
      ...prev,
      {
        key,
        productId: product._id,
        title: product.title,
        color: firstVariant?.color || "",
        size: firstVariant?.size || "",
        price: firstVariant?.price || product.sellingPrice,
        quantity: 1,
        stock: firstVariant?.stock || 0,
      },
    ]);
    setResults([]);
    setQuery("");
    setShowDropdown(false);
  }

  function updateLine(key: string, patch: Partial<OrderLine>) {
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  }

  function removeLine(key: string) {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }

  async function handleDesignUpload(key: string, file: File) {
    updateLine(key, { uploadingDesign: true });
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "manual-order-designs");

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!data.success) throw new Error("Upload failed");

      updateLine(key, { customDesignImage: data.url, uploadingDesign: false });
      toast.success("Design uploaded");
    } catch {
      toast.error("Design upload failed.");
      updateLine(key, { uploadingDesign: false });
    }
  }

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);

  async function handleSubmit() {
    if (!lines.length) {
      toast.error("Add at least one product.");
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error("Customer name and phone are required.");
      return;
    }
    if (!address.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      toast.error("Full shipping address is required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/manual-order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({
            productId: l.productId,
            title: l.title,
            color: l.color,
            size: l.size,
            price: l.price,
            quantity: l.quantity,
            customDesignImage: l.customDesignImage,
          })),
          customerName,
          customerPhone,
          customerEmail,
          shippingAddress: { address, city, state, pincode },
          paymentMethod,
          paymentStatus,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to create order.");

      toast.success(`Order ${data.orderNumber} created`);
      router.push(`/admin/dashboard/orders/${data.orderId}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        {/* Product search */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <h3 className="mb-3 font-bold text-white">Add Product</h3>
          <div ref={searchWrapperRef} className="relative">
            <div className="flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.trim() && setShowDropdown(true)}
                onKeyDown={(e) => e.key === "Enter" && searchProducts(true)}
                placeholder="Search product by name..."
                className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-500"
              />
              <button
                onClick={() => searchProducts(true)}
                disabled={searching}
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-500"
              >
                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Search
              </button>
            </div>

            {showDropdown && (
              <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-72 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl">
                {searching ? (
                  <div className="flex items-center justify-center gap-2 py-4 text-sm text-zinc-400">
                    <Loader2 className="h-4 w-4 animate-spin" /> Searching...
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-1">
                    {results.map((p) => (
                      <button
                        key={p._id}
                        onClick={() => addLine(p)}
                        className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left hover:bg-zinc-800"
                      >
                        {p.image && (
                          <img src={p.image} alt={p.title} className="h-12 w-12 rounded-lg object-cover" />
                        )}
                        <div>
                          <p className="text-sm font-semibold text-white">{p.title}</p>
                          <p className="text-xs text-zinc-400">₹{p.sellingPrice}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="py-4 text-center text-sm text-zinc-500">
                    No active product found matching that name.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Order lines */}
        {lines.map((line) => (
          <div key={line.key} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-semibold text-white">{line.title}</p>
              <button onClick={() => removeLine(line.key)} className="text-zinc-400 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-400">Color</label>
                <input
                  value={line.color}
                  onChange={(e) => updateLine(line.key, { color: e.target.value })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-sm text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-400">Size</label>
                <input
                  value={line.size}
                  onChange={(e) => updateLine(line.key, { size: e.target.value })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-sm text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-400">Qty</label>
                <input
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={(e) => updateLine(line.key, { quantity: Math.max(1, Number(e.target.value)) })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-sm text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-400">Price (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={line.price}
                  onChange={(e) => updateLine(line.key, { price: Number(e.target.value) })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-sm text-white"
                />
              </div>
            </div>

            {/* Custom design upload */}
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-semibold text-zinc-400">
                Custom Design (WhatsApp/Instagram image — optional, background-removed PNG recommended)
              </label>
              {line.customDesignImage ? (
                <div className="flex items-center gap-3">
                  <img
                    src={line.customDesignImage}
                    alt="Custom design"
                    className="h-16 w-16 rounded-lg border border-zinc-800 object-contain"
                  />
                  <button
                    onClick={() => updateLine(line.key, { customDesignImage: undefined })}
                    className="flex items-center gap-1 text-xs font-semibold text-red-500"
                  >
                    <X className="h-3 w-3" /> Remove
                  </button>
                </div>
              ) : (
                <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-dashed border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800">
                  {line.uploadingDesign ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Upload className="h-3.5 w-3.5" />
                  )}
                  Upload design image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleDesignUpload(line.key, file);
                    }}
                  />
                </label>
              )}
            </div>
          </div>
        ))}

        {/* Customer + shipping */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <h3 className="mb-3 font-bold text-white">Customer & Shipping</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer name *"
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500"
            />
            <input
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Phone *"
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500"
            />
            <input
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="Email (optional)"
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 sm:col-span-2"
            />
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address *"
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 sm:col-span-2"
            />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City *"
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500"
            />
            <input
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State *"
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500"
            />
            <input
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Pincode *"
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <h3 className="mb-3 font-bold text-white">Notes</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Design sent via WhatsApp on 25 Aug, customer confirmed placement on front."
            rows={3}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500"
          />
        </div>
      </div>

      {/* Sidebar: payment + submit */}
      <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <h3 className="font-bold text-white">Payment</h3>

        <div className="flex flex-wrap gap-2">
          {(["upi", "card", "cash", "cod"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setPaymentMethod(m)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase ${
                paymentMethod === m
                  ? "border-violet-500 bg-violet-500/10 text-violet-300"
                  : "border-zinc-800 text-zinc-300"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {(["paid", "pending"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setPaymentStatus(s)}
              className={`flex-1 rounded-lg border py-1.5 text-xs font-semibold uppercase ${
                paymentStatus === s
                  ? "border-violet-500 bg-violet-500/10 text-violet-300"
                  : "border-zinc-800 text-zinc-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="border-t border-zinc-800 pt-3">
          <div className="flex justify-between text-sm font-bold text-white">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <p className="mt-0.5 text-[11px] text-zinc-400">GST included in item prices</p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-bold text-white hover:bg-violet-700 disabled:opacity-50"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Create Order
        </button>

        <p className="text-[11px] text-zinc-400">
          Stock is decremented immediately. Invoice and shipping label can be
          generated from the order&apos;s detail page after it&apos;s created — same
          as any online order.
        </p>
      </div>
    </div>
  );
}
