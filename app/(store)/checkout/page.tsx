"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import {
  MapPin,
  Pencil,
  Truck,
  CreditCard,
  Smartphone,
  Landmark,
  Wallet,
  Receipt,
  Ticket,
  Lock,
  ShieldCheck,
  RotateCcw,
  Gem,
  Headset,
  QrCode,
} from "lucide-react";

import { useCartStore } from "@/stores/cartStore";

import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";

// TODO (before launch): replace this hardcoded promo code with a real
// coupon-validation API call.
const DEMO_PROMO = { code: "ZERO300", discount: 300 };

const SHIPPING_METHODS = [
  { id: "standard", label: "Standard Delivery", meta: "3 – 5 business days", price: 0 },
  { id: "express", label: "Express Delivery", meta: "1 – 2 business days", price: 149 },
] as const;

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", icon: Smartphone },
  { id: "card", label: "Card", icon: CreditCard },
  { id: "netbanking", label: "Net Banking", icon: Landmark },
  { id: "wallets", label: "Wallets", icon: Wallet },
  { id: "cod", label: "COD", icon: Receipt },
] as const;

export default function CheckoutPage() {
  const router = useRouter();

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const [shippingMethod, setShippingMethod] =
    useState<(typeof SHIPPING_METHODS)[number]["id"]>("standard");

  const [paymentMethod, setPaymentMethod] =
    useState<(typeof PAYMENT_METHODS)[number]["id"]>("upi");

  const [upiId, setUpiId] = useState("");

  const [promoInput, setPromoInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");

  const cartItems = mounted ? items : [];
  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = paymentMethod === "cod" ? 99 : 0;
  const total = Math.max(subtotal + shipping - appliedDiscount, 0);

  useEffect(() => {
    if (mounted && cartItems.length === 0) {
      router.push("/cart");
    }
  }, [mounted, cartItems.length, router]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleApplyPromo() {
    if (promoInput.trim().toUpperCase() === DEMO_PROMO.code) {
      setAppliedDiscount(DEMO_PROMO.discount);
      setPromoError("");
    } else {
      setAppliedDiscount(0);
      setPromoError("Invalid promo code");
    }
  }

  function validateForm() {
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      toast.error("Please fill all required fields.");
      return false;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, "").slice(-10))) {
      toast.error("Please enter a valid phone number.");
      return false;
    }

    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(formData.pincode)) {
      toast.error("Please enter a valid pincode.");
      return false;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return false;
    }

    return true;
  }

  async function handleCheckout() {
    if (!validateForm()) return;

    setLoading(true);

    const [firstName, ...rest] = formData.fullName.trim().split(" ");
    const lastName = rest.join(" ") || firstName;

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            firstName,
            lastName,
            email: formData.email,
            phone: formData.phone,
          },
          shippingAddress: {
            address: formData.address,
            landmark: formData.landmark,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            country: formData.country,
          },
          shippingMethod,
          paymentMethod: paymentMethod === "cod" ? "COD" : "ONLINE",
          products: cartItems,
          totalItems,
          subtotal,
          shipping,
          discount: appliedDiscount,
          total,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success("Order Placed Successfully!");
      router.push(`/order-success?orderId=${data.order._id}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to place order.");
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar />
      <Navbar />

      <div className="mx-auto max-w-[1500px] px-6 py-10 md:px-14">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black uppercase text-black">
              Checkout
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Complete your order in 3 simple steps.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {[
              { n: 1, label: "Shipping" },
              { n: 2, label: "Payment" },
              { n: 3, label: "Review" },
            ].map((step, i) => (
              <div key={step.n} className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                      step.n === 1
                        ? "bg-violet-600 text-white"
                        : "border border-zinc-300 text-zinc-400"
                    }`}
                  >
                    {step.n}
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      step.n === 1 ? "text-violet-600" : "text-zinc-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {i < 2 && <div className="h-px w-10 bg-zinc-200" />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          {/* Left column */}
          <div className="space-y-6">
            {/* 1. Shipping Information */}
            <div className="rounded-2xl border border-zinc-200 p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-bold text-black">
                  <MapPin className="h-4 w-4 text-violet-600" />
                  1. Shipping Information
                </h2>
                <button className="flex items-center gap-1 text-sm font-semibold text-violet-600 hover:underline">
                  Edit <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-zinc-500">
                      Full Name
                    </label>
                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Aryan Verma"
                      className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-zinc-500">
                      Phone Number
                    </label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-zinc-500">
                      Pincode
                    </label>
                    <input
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="110016"
                      className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-violet-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-zinc-500">
                    Address
                  </label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="A-23, Green Park Extension"
                    className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-zinc-500">
                    Landmark (Optional)
                  </label>
                  <input
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    placeholder="Near Metro Station"
                    className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-violet-500"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-zinc-500">
                      City
                    </label>
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="New Delhi"
                      className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-zinc-500">
                      State
                    </label>
                    <input
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Delhi"
                      className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-zinc-500">
                      Country
                    </label>
                    <input
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-violet-500"
                    />
                  </div>
                </div>
              </div>
            </div>


            {/* 3. Payment Method */}
            <div className="rounded-2xl border border-zinc-200 p-6">
<h2 className="mb-5 flex items-center gap-2 font-bold text-black">
  <CreditCard className="h-4 w-4 text-violet-600" />
  2. Payment Method
</h2>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPaymentMethod(id)}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition ${
                      paymentMethod === id
                        ? "border-violet-600 bg-violet-50"
                        : "border-zinc-200 hover:border-violet-300"
                    }`}
                  >
                    <Icon className="h-5 w-5 text-zinc-600" />
                    <span className="text-xs font-semibold text-black">
                      {label}
                    </span>
                  </button>
                ))}
              </div>

              {paymentMethod === "upi" && (
                <div className="mt-5">
                  <label className="mb-1.5 block text-xs font-semibold text-zinc-500">
                    UPI ID
                  </label>
                  <div className="relative">
                    <input
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="Enter your UPI ID (e.g. aryan@upi)"
                      className="w-full rounded-xl border border-zinc-300 px-4 py-3 pr-12 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-violet-500"
                    />
                    <QrCode className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  </div>
                </div>
              )}

              {/* Promo code */}
              <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-violet-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white">
                    <Ticket className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-black">
                      Have a promo code?
                    </p>
                    <p className="text-xs text-zinc-500">
                      Enter code to get exciting discounts!
                    </p>
                  </div>
                </div>

                <div className="flex w-full gap-2 sm:w-auto">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Enter promo code"
                    className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-violet-500 sm:w-56"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="shrink-0 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
                  >
                    Apply
                  </button>
                </div>
              </div>
              {promoError && (
                <p className="mt-2 text-xs font-medium text-red-500">
                  {promoError}
                </p>
              )}
            </div>

            {/* Feature strip */}
            <div className="grid grid-cols-2 gap-4 rounded-2xl border border-zinc-200 p-6 sm:grid-cols-4">
              {[
                { icon: ShieldCheck, title: "100% Secure Payments", subtitle: "Safe & trusted transactions" },
                { icon: RotateCcw, title: "Easy Returns", subtitle: "Hassle-free returns within 7 days" },
                { icon: Gem, title: "Premium Quality", subtitle: "Top-notch quality assured" },
                { icon: Headset, title: "24/7 Support", subtitle: "We're here to help you" },
              ].map(({ icon: Icon, title, subtitle }) => (
                <div key={title} className="flex items-start gap-2">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                  <div>
                    <p className="text-xs font-bold text-black">{title}</p>
                    <p className="text-[11px] text-zinc-500">{subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="h-fit rounded-2xl border border-zinc-200 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wide text-black">
                  Order Summary
                </h2>
                <button
                  onClick={() => router.push("/cart")}
                  className="text-xs font-semibold text-violet-600 hover:underline"
                >
                  Edit Cart
                </button>
              </div>

              <div className="max-h-64 space-y-4 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div
                    key={`${item.productId}-${item.color}-${item.size}`}
                    className="flex gap-3"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-black">
                        {item.title}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-black">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-2 border-t border-zinc-200 pt-4 text-sm">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-semibold text-black">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Shipping Charges</span>
                  <span
                    className={`font-semibold ${
                      shipping === 0 ? "text-emerald-600" : "text-black"
                    }`}
                  >
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-zinc-600">
                    <span>Discount</span>
                    <span className="font-semibold text-emerald-600">
                      − ₹{appliedDiscount}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 border-t border-zinc-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black">Total Amount</span>
                  <span className="text-xl font-black text-violet-600">
                    ₹{total}
                  </span>
                </div>
                {appliedDiscount > 0 && (
                  <p className="mt-1 text-xs font-medium text-emerald-600">
                    You saved ₹{appliedDiscount} on this order!
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={loading}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-4 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-50"
              >
                <Lock className="h-4 w-4" />
                {loading ? "Placing Order..." : "Proceed to Payment"}
              </button>

              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-zinc-500">
                <ShieldCheck className="h-3.5 w-3.5 text-violet-600" />
                Your payment details are 100% secure and encrypted
              </p>
            </div>

            {/* Promo banner */}
            <div className="relative min-h-[280px] overflow-hidden rounded-2xl bg-violet-50 p-6">
              <div className="pointer-events-none absolute -right-10 bottom-0 h-[260px] w-56">
                <Image
                  src="/images/checkout/male-model.png"
                  alt=""
                  fill
                  className="object-contain object-bottom"
                />
              </div>

              <div className="relative z-10 max-w-[130px]">
                <h3 className="text-lg font-black uppercase leading-tight text-black">
                  Wear Your <span className="text-violet-600">Next Arc</span>
                </h3>
                <p className="mt-3 text-xs text-zinc-600">
                  Premium Anime Streetwear for Dreamers &amp; Rebels.
                </p>
                <p className="mt-3 text-xs text-zinc-600">
                  Thank you for choosing ZeroArc! 💜
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Newsletter />
      <Footer />
    </main>
  );
}