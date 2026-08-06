export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return map[status] || status;
}

export function statusStyle(status: string): string {
  switch (status) {
    case "delivered":
      return "bg-emerald-100 text-emerald-700";
    case "shipped":
      return "bg-violet-100 text-violet-700";
    case "processing":
    case "confirmed":
      return "bg-amber-100 text-amber-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-zinc-100 text-zinc-700";
  }
}