import { Types } from "mongoose";

interface OrderDocument {
  _id: Types.ObjectId;
  orderInfo: any;
  customer: any;
  items: any[];
  pricing: any;
  payment: any;
  invoiceInfo: any;
  shippingLabel: any;
}

export function buildInvoiceData(order: OrderDocument) {
  return {
    invoiceNumber: order.invoiceInfo.invoiceNumber,
    invoiceDate: order.invoiceInfo.invoiceDate,

    orderNumber: order.orderInfo.orderNumber,
    orderDate: order.orderInfo.orderDate,

    customer: {
      name: order.customer.name,
      email: order.customer.email,
      phone: order.customer.phone,
      billingAddress: order.customer.billingAddress,
      shippingAddress: order.customer.shippingAddress,
    },

    seller: order.invoiceInfo.sellerDetails,

    items: order.items.map((item) => ({
      name: item.name,
      sku: item.sku,
      hsnCode: item.hsnCode,
      quantity: item.quantity,
      price: item.price,
      gstRate: item.gstRate,
      gstAmount: item.gstAmount,
      totalAmount: item.totalAmount,
    })),

    pricing: order.pricing,

    payment: order.payment,

    tracking: {
      trackingId: order.invoiceInfo.tracking?.trackingId,
      qrCode: order.invoiceInfo.tracking?.qrCode,
    },
  };
}