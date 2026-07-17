import Container from "@/components/layout/Container";
import OrderSummary from "@/components/checkout/OrderSummary";
import ShippingForm from "@/components/checkout/ShippingForm";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#09090B] pt-32 pb-20 text-white">
      <Container>

        <div className="mb-12">
          <h1 className="text-5xl font-black">
            Checkout
          </h1>

          <p className="mt-3 text-zinc-400">
            Complete your order securely.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Left Side */}
          <div className="space-y-8 lg:col-span-2">

            <ShippingForm />

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
              <h2 className="mb-6 text-2xl font-bold">
                Payment Method
              </h2>

              <p className="text-zinc-500">
                Razorpay / UPI / Card options.
              </p>
            </div>

          </div>

          {/* Right Side */}
          <div>

            <div className="sticky top-32 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

              <h2 className="mb-6 text-2xl font-bold">
                Order Summary
              </h2>

              <OrderSummary />

            </div>

          </div>

        </div>

      </Container>
    </main>
  );
}