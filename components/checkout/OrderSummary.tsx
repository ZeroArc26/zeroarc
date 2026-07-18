"use client"; 

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cartStore";
import { useRouter } from "next/navigation";

export default function OrderSummary() {
  const router = useRouter();

const clearCart = useCartStore((state) => state.clearCart);
  const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalPrice = useCartStore((state) => state.getTotalPrice());

  const shipping = totalPrice > 999 ? 0 : 99;
  const grandTotal = totalPrice + shipping;
  const handlePayment = async () => {

  if (items.length === 0) {
    toast.error("Your cart is empty.");
    return;
  }

  try {
    const response = await fetch("/api/razorpay/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: grandTotal,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create order");
    }

    const order = await response.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "ZEROARC",
      description: "Premium Anime Streetwear",
      order_id: order.id,

      handler: async function (response: any) {
  try {
    const verifyResponse = await fetch("/api/razorpay/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response),
    });

    const result = await verifyResponse.json();

    const orderData = {
  orderId: `ZA-${Date.now()}`,
  paymentId: response.razorpay_payment_id,
  razorpayOrderId: response.razorpay_order_id,

  customer: {
    name: "Guest",
    email: "",
    phone: "",
  },

  items,

  subtotal: totalPrice,
  shipping,
  total: grandTotal,
};

    if (result.success) {
  toast.success("Payment Verified Successfully 🎉");

  const saveOrder = await fetch("/api/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(orderData),
});

const savedOrder = await saveOrder.json();

if (!savedOrder.success) {
  toast.error("Failed to save order.");
  return;
}
  
  clearCart();

  router.push("/payment-success");
} else {
      toast.error("Payment Verification Failed");
    }
  } catch (error) {
    console.error(error);

    toast.error("Verification Error");
  }
},

      theme: {
        color: "#7C3AED",
      },
    };

    const razorpay = new (window as any).Razorpay(options);

    razorpay.open();
  } catch (error) {
    console.error(error);

    toast.error("Unable to start payment.");
  }
};
  if (!mounted) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
      <div className="h-8 w-44 animate-pulse rounded bg-zinc-800" />

      <div className="mt-8 space-y-5">
        <div className="h-5 animate-pulse rounded bg-zinc-800" />
        <div className="h-5 animate-pulse rounded bg-zinc-800" />
        <div className="h-5 animate-pulse rounded bg-zinc-800" />
      </div>

      <div className="mt-8 h-14 animate-pulse rounded-2xl bg-zinc-800" />
    </div>
  );
}

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
      <h2 className="mb-6 text-2xl font-bold text-white">
        Order Summary
      </h2>

      <div className="space-y-4">

        <div className="flex justify-between text-zinc-400">
          <span>Items</span>
          <span>{totalItems}</span>
        </div>

        <div className="flex justify-between text-zinc-400">
          <span>Subtotal</span>
          <span>₹{totalPrice}</span>
        </div>

        <div className="flex justify-between text-zinc-400">
          <span>Shipping</span>

          <span>
            {shipping === 0 ? "FREE" : `₹${shipping}`}
          </span>
        </div>

        <div className="border-t border-zinc-800 pt-4">
          <div className="flex justify-between text-xl font-bold text-white">
            <span>Total</span>
            <span>₹{grandTotal}</span>
          </div>
        </div>

      </div>

      <button
  onClick={handlePayment}
  disabled={items.length === 0}
  className={`mt-8 w-full rounded-2xl py-4 font-semibold transition ${
    items.length === 0
      ? "cursor-not-allowed bg-zinc-700 text-zinc-400"
      : "bg-purple-600 text-white hover:bg-purple-500"
  }`}
>
  {items.length === 0
    ? "Cart is Empty"
    : `Pay ₹${grandTotal}`}
</button>
    </div>
  );
}