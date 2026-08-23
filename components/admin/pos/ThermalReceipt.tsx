"use client";

interface ReceiptItem {
  name: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  totalAmount: number;
}

interface ReceiptData {
  orderNumber: string;
  invoiceNumber: string;
  date: string;
  customer: { name: string; phone: string };
  items: ReceiptItem[];
  pricing: {
    subtotal: number;
    totalTax: number;
    grandTotal: number;
  };
  payment: { method: string };
  soldBy?: string;
}

export default function ThermalReceipt({ order }: { order: ReceiptData }) {
  return (
    <div
      id="thermal-receipt"
      className="mx-auto w-[300px] bg-white p-3 font-mono text-[11px] text-black print:w-[80mm]"
    >
      <p className="text-center text-sm font-bold">ZEROARC</p>
      <p className="text-center text-[10px]">Wear Your Next Story</p>
      <p className="mt-1 text-center text-[10px]">In-Store Sale Receipt</p>

      <div className="my-2 border-t border-dashed border-black" />

      <p>Order: {order.orderNumber}</p>
      <p>Invoice: {order.invoiceNumber}</p>
      <p>Date: {new Date(order.date).toLocaleString("en-IN")}</p>
      {order.soldBy && <p>Sold by: {order.soldBy}</p>}

      <div className="my-2 border-t border-dashed border-black" />

      <p>Customer: {order.customer.name}</p>
      <p>Phone: {order.customer.phone}</p>

      <div className="my-2 border-t border-dashed border-black" />

      {order.items.map((item, i) => (
        <div key={i} className="mb-1.5">
          <p className="font-semibold">{item.name}</p>
          <div className="flex justify-between">
            <span>
              {item.color}/{item.size} x{item.quantity}
            </span>
            <span>₹{item.totalAmount}</span>
          </div>
        </div>
      ))}

      <div className="my-2 border-t border-dashed border-black" />

      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>₹{order.pricing.subtotal}</span>
      </div>
      <div className="flex justify-between">
        <span>GST (incl.)</span>
        <span>₹{order.pricing.totalTax}</span>
      </div>
      <div className="mt-1 flex justify-between text-sm font-bold">
        <span>TOTAL</span>
        <span>₹{order.pricing.grandTotal}</span>
      </div>

      <p className="mt-1">Payment: {order.payment.method.toUpperCase()}</p>

      <div className="my-2 border-t border-dashed border-black" />

      <p className="text-center text-[10px]">Thank you for shopping with us!</p>
      <p className="text-center text-[10px]">zeroarc.in</p>
    </div>
  );
}
