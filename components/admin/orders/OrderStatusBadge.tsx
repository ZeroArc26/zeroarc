import { cn } from "@/lib/utils";


type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";


interface Props {
  status: OrderStatus;
}


export default function OrderStatusBadge({
  status,
}: Props) {


  const styles = {

    pending:
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",


    confirmed:
      "bg-blue-500/10 text-blue-400 border-blue-500/20",


    processing:
      "bg-violet-500/10 text-violet-400 border-violet-500/20",


    shipped:
      "bg-orange-500/10 text-orange-400 border-orange-500/20",


    delivered:
      "bg-green-500/10 text-green-400 border-green-500/20",


    cancelled:
      "bg-red-500/10 text-red-400 border-red-500/20",

  };


  return (

    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium capitalize",
        styles[status]
      )}
    >

      {status}

    </span>

  );

}