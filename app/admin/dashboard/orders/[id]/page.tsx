import { notFound } from "next/navigation";

import { getOrderById } from "@/lib/actions/orders/getOrderById";

import PageHeader from "@/components/admin/shared/PageHeader";

import OrderCustomerCard from "@/components/admin/orders/OrderCustomerCard";
import OrderItemsCard from "@/components/admin/orders/OrderItemsCard";
import OrderPaymentCard from "@/components/admin/orders/OrderPaymentCard";
import OrderTimeline from "@/components/admin/orders/OrderTimeline";

import OrderActions from "@/components/admin/orders/OrderActions";
import InvoiceActions from "@/components/admin/orders/InvoiceActions";
import OrderSummary from "@/components/admin/orders/OrderSummary";
import ShippingLabelActions from "@/components/admin/orders/ShippingLabelActions";


type Props = {
  params: Promise<{
    id: string;
  }>;
};


export default async function OrderDetailsPage({
  params,
}: Props) {


  const { id } = await params;


  const order = await getOrderById(id);



  if (!order) {
    notFound();
  }



  return (

    <div className="space-y-8">


      {/* Header */}

      <PageHeader

        title={`Order #${order.orderInfo.orderNumber}`}

        description="Manage order details, payment and delivery."

      />

      <OrderSummary order={order} />



      <div className="grid gap-8 xl:grid-cols-3">



        {/* LEFT SIDE */}

        <div className="space-y-8 xl:col-span-2">


          <OrderCustomerCard
            customer={order.customer}
          />



          <OrderItemsCard
            items={order.items}
          />



          <OrderPaymentCard

            payment={order.payment}

            total={
              order.pricing.grandTotal
            }

          />



          <OrderTimeline

            timeline={
              order.timeline || []
            }

          />


        </div>





        {/* RIGHT SIDE */}

        <div className="space-y-8">


          <OrderActions

            orderId={order.id}

            currentStatus={
              order.orderInfo.status
            }

          />



          <InvoiceActions

            orderId={order.id}

          />

          <ShippingLabelActions
  orderId={order.id}
  trackingId={order.shippingLabel?.trackingId}
  hasShippingLabel={!!order.shippingLabel?.awbNumber}
  courierPartner={order.shippingLabel?.courierPartner}
  awbNumber={order.shippingLabel?.awbNumber}
  isProvisionalAwb={order.shippingLabel?.isProvisionalAwb}
/>


        </div>



      </div>


    </div>

  );
}