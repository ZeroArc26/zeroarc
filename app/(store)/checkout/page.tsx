"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Script from "next/script";
import { toast } from "sonner";
import {
  MapPin,
  Pencil,
  Truck,
  Zap,
  CreditCard,
  Receipt,
  Ticket,
  ShieldCheck,
  RotateCcw,
  Gem,
  Headset,
} from "lucide-react";

import { useCartStore } from "@/stores/cartStore";

import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navbar from "@/components/home/Navbar";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";
import OrderButton from "@/components/checkout/OrderButton";

const SHIPPING_METHODS = [
  { id: "standard" as const, label: "Standard Delivery", meta: "3 – 5 business days", icon: Truck },
  { id: "express" as const, label: "Express Delivery", meta: "1 – 2 business days", icon: Zap },
];

const PAYMENT_METHODS = [
  {
    id: "online",
    label: "Online Payment",
    subtitle: "UPI, Card, Net Banking, Wallets",
    icon: CreditCard,
  },
  { id: "cod", label: "Cash on Delivery", subtitle: "Pay at your doorstep", icon: Receipt },
] as const;

export default function CheckoutPage() {
  const router = useRouter();

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    fetch("/api/settings/public")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStoreSettings(data.shipping);
      })
      .catch(() => {});
  }, []);

  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

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
    useState<(typeof PAYMENT_METHODS)[number]["id"]>("online");

  const [storeSettings, setStoreSettings] = useState<{
    freeShippingThreshold: number;
    standardShippingRate: number;
    expressShippingRate: number;
    codCharge: number;
    codAvailable: boolean;
  } | null>(null);

  const [promoInput, setPromoInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [applyingPromo, setApplyingPromo] = useState(false);
  const [promoError, setPromoError] = useState("");

  const cartItems = mounted ? items : [];
  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const freeShippingThreshold = storeSettings?.freeShippingThreshold ?? 999;
  const baseShippingRate =
    shippingMethod === "express"
      ? storeSettings?.expressShippingRate ?? 149
      : storeSettings?.standardShippingRate ?? 0;
  const codCharge = storeSettings?.codCharge ?? 99;

  const shipping =
    subtotal >= freeShippingThreshold
      ? 0
      : baseShippingRate + (paymentMethod === "cod" ? codCharge : 0);
  const total = Math.max(subtotal + shipping - appliedDiscount, 0);

  // Display-only helper for the shipping method selector below — mirrors
  // the exact same free-shipping-threshold logic used for the real
  // `shipping` total above, just per-method so both options can show
  // their rate. Does not affect `shipping`/`total`/`baseShippingRate`.
  function getShippingMethodRate(methodId: (typeof SHIPPING_METHODS)[number]["id"]) {
    if (subtotal >= freeShippingThreshold) return 0;
    return methodId === "express"
      ? storeSettings?.expressShippingRate ?? 149
      : storeSettings?.standardShippingRate ?? 0;
  }

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

  async function handleApplyPromo() {
    if (!promoInput.trim()) return;

    setApplyingPromo(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: promoInput.trim(),
          subtotal,
          email: formData.email,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setAppliedDiscount(0);
        setAppliedCouponCode("");
        setPromoError(data.message || "Invalid promo code");
        return;
      }

      setAppliedDiscount(data.discount);
      setAppliedCouponCode(data.code);
      setPromoError("");
    } catch (error) {
      console.error(error);
      setPromoError("Failed to apply promo code.");
    } finally {
      setApplyingPromo(false);
    }
  }

  function validateForm() {
    if (
      !formData.fullName ||
      !formData.email ||
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

  async function placeOrder(paymentResult?: {
    razorpayPaymentId: string;
    razorpayOrderId: string;
  }) {
    const [firstName, ...rest] = formData.fullName.trim().split(" ");
    const lastName = rest.join(" ") || firstName;

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
        couponCode: appliedCouponCode || undefined,
        paymentResult,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    toast.success("Order Placed Successfully!");
    setOrderPlaced(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    router.push(`/order-success?orderId=${data.order._id}`);
  }

  async function handleCheckout() {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // ---------------- COD ----------------
      if (paymentMethod === "cod") {
        await placeOrder();
        return;
      }

      // ---------------- Online payment (Razorpay) ----------------
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });

      const razorpayOrder = await orderRes.json();

      if (!razorpayOrder.id) {
        throw new Error("Failed to create payment order.");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "ZeroArc",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#7c3aed" },
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyData.success) {
              toast.error("Payment verification failed.");
              setLoading(false);
              return;
            }

            await placeOrder({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
            });
          } catch (error) {
            console.error(error);
            toast.error("Something went wrong after payment.");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast.error("Payment cancelled.");
          },
        },
      };

      const razorpayWindow = new (window as any).Razorpay(options);
      razorpayWindow.open();
    } catch (error) {
      console.error(error);
      toast.error("Failed to place order.");
      setLoading(false);
    }
  }

  if (!mounted) return null;

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

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
                      Email Address
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="aryan@email.com"
                      className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-violet-500"
                    />
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

              {/* 2. Shipping Method */}
              <div className="rounded-2xl border border-zinc-200 p-6">
                <h2 className="mb-5 flex items-center gap-2 font-bold text-black">
                  <Truck className="h-4 w-4 text-violet-600" />
                  2. Shipping Method
                </h2>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {SHIPPING_METHODS.map(({ id, label, meta, icon: Icon }) => {
                    const rate = getShippingMethodRate(id);

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setShippingMethod(id)}
                        className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                          shippingMethod === id
                            ? "border-violet-600 bg-violet-50"
                            : "border-zinc-200 hover:border-violet-300"
                        }`}
                      >
                        <Icon className="h-5 w-5 shrink-0 text-zinc-600" />
                        <span className="flex-1">
                          <span className="block text-sm font-semibold text-black">
                            {label}
                          </span>
                          <span className="block text-xs text-zinc-500">
                            {meta}
                          </span>
                        </span>
                        <span
                          className={`shrink-0 text-sm font-bold ${
                            rate === 0 ? "text-emerald-600" : "text-black"
                          }`}
                        >
                          {rate === 0 ? "FREE" : `₹${rate}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Payment Method */}
              <div className="rounded-2xl border border-zinc-200 p-6">
<h2 className="mb-5 flex items-center gap-2 font-bold text-black">
  <CreditCard className="h-4 w-4 text-violet-600" />
  2. Payment Method
</h2>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {PAYMENT_METHODS.map(({ id, label, subtitle, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPaymentMethod(id)}
                      className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                        paymentMethod === id
                          ? "border-violet-600 bg-violet-50"
                          : "border-zinc-200 hover:border-violet-300"
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0 text-zinc-600" />
                      <span>
                        <span className="block text-sm font-semibold text-black">
                          {label}
                        </span>
                        <span className="block text-xs text-zinc-500">
                          {subtitle}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>

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
                      disabled={applyingPromo}
                      className="shrink-0 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-60"
                    >
                      {applyingPromo ? "Applying..." : "Apply"}
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

                <OrderButton
                  status={
                    orderPlaced ? "success" : loading ? "loading" : "idle"
                  }
                  onClick={handleCheckout}
                />

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
    </>
  );
}