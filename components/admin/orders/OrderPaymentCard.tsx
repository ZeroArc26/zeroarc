interface Props {
  payment: {
    method?: string;
    status?: string;
    transactionId?: string;
  };

  total: number;
}


export default function OrderPaymentCard({
  payment,
  total,
}: Props) {

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

      <h2 className="text-xl font-bold text-white">
        Payment Details
      </h2>


      <div className="mt-6 grid gap-5 sm:grid-cols-2">


        {/* Payment Method */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">

          <p className="text-xs text-zinc-500">
            Payment Method
          </p>

          <p className="mt-2 text-sm font-semibold capitalize text-white">
            {payment.method || "N/A"}
          </p>

        </div>



        {/* Payment Status */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">

          <p className="text-xs text-zinc-500">
            Payment Status
          </p>

          <p
            className={`mt-2 text-sm font-semibold capitalize ${
              payment.status === "paid"
                ? "text-green-400"
                : payment.status === "failed"
                ? "text-red-400"
                : "text-yellow-400"
            }`}
          >
            {payment.status || "Pending"}
          </p>

        </div>



        {/* Transaction ID */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">

          <p className="text-xs text-zinc-500">
            Transaction ID
          </p>

          <p className="mt-2 break-all text-sm text-white">
            {payment.transactionId || "N/A"}
          </p>

        </div>



        {/* Total Amount */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">

          <p className="text-xs text-zinc-500">
            Total Amount
          </p>

          <p className="mt-2 text-lg font-bold text-white">
            ₹{total}
          </p>

        </div>


      </div>

    </div>
  );
}