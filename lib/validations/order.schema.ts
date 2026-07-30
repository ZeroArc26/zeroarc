import { z } from "zod";


// =========================
// ADDRESS SCHEMA
// =========================

const addressSchema = z.object({

  address: z.string().min(1),

  city: z.string().min(1),

  state: z.string().min(1),

  pincode: z.string().min(1),

  country: z
    .string()
    .default("India"),

});


// =========================
// ORDER INFO
// =========================

const orderInfoSchema = z.object({

  orderNumber: z
    .string()
    .min(1),


  status: z.enum([
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ]),


  source: z.enum([
    "website",
    "admin",
  ]),


  orderDate: z
    .coerce
    .date()
    .optional(),

});


// =========================
// CUSTOMER
// =========================

const customerSchema = z.object({

  userId: z
    .string()
    .optional(),


  name: z
    .string()
    .min(2),


  email: z
    .string()
    .email(),


  phone: z
    .string()
    .min(10),


  billingAddress:
    addressSchema,

});


// =========================
// ORDER ITEMS
// =========================

const orderItemSchema = z.object({

  productId: z
    .string()
    .optional(),


  name: z
    .string()
    .min(1),


  image: z
    .string()
    .optional(),


  sku: z
    .string()
    .optional(),


  hsnCode: z
    .string()
    .optional(),


  quantity: z
    .number()
    .min(1),


  price: z
    .number()
    .min(0),


  gstRate: z
    .number()
    .min(0)
    .default(0),


  gstAmount: z
    .number()
    .min(0)
    .default(0),


  totalAmount: z
    .number()
    .min(0),

});


// =========================
// PRICING
// =========================

const pricingSchema = z.object({

  subtotal: z
    .number()
    .min(0),


  discount: z
    .number()
    .min(0)
    .default(0),


  taxableAmount: z
    .number()
    .min(0),


  cgst: z
    .number()
    .min(0)
    .default(0),


  sgst: z
    .number()
    .min(0)
    .default(0),


  igst: z
    .number()
    .min(0)
    .default(0),


  totalTax: z
    .number()
    .min(0)
    .default(0),


  grandTotal: z
    .number()
    .min(0),

});


// =========================
// PAYMENT
// =========================

const paymentSchema = z.object({

  method: z.enum([
    "upi",
    "card",
    "cod",
    "netbanking",
  ]),


  status: z.enum([
    "pending",
    "paid",
    "failed",
    "refunded",
  ]),


  transactionId: z
    .string()
    .optional(),

});


// =========================
// CUSTOMER INVOICE
// =========================

const customerInvoiceSchema = z.object({

  invoiceNumber: z
    .string()
    .optional(),


  invoiceDate: z
    .coerce
    .date()
    .optional(),


  sellerDetails: z.object({

    brandName: z
      .string()
      .default("ZeroArc"),


    legalName: z
      .string()
      .optional(),


    gstNumber: z
      .string()
      .optional(),


    panNumber: z
      .string()
      .optional(),


    address: z
      .string()
      .optional(),

  })
  .optional(),


  taxBreakup: z.object({

    subtotal: z.number(),

    discount: z.number(),

    taxableAmount: z.number(),

    cgst: z.number(),

    sgst: z.number(),

    igst: z.number(),

    total: z.number(),

  })
  .optional(),


  tracking: z.object({

    trackingId: z
      .string()
      .optional(),


    qrCodeUrl: z
      .string()
      .optional(),

  })
  .optional(),

});


// =========================
// SHIPPING LABEL
// =========================

const shippingLabelSchema = z.object({

  shippingId: z
    .string()
    .optional(),


  trackingId: z
    .string()
    .optional(),


  receiver: z.object({

    name: z.string(),

    phone: z.string(),

    address: z.string(),

    city: z.string(),

    state: z.string(),

    pincode: z.string(),

  })
  .optional(),


  items: z.array(

    z.object({

      name: z.string(),

      quantity: z.number(),

    })

  )
  .optional(),


  warehouse: z.object({

    name: z.string(),

    address: z.string(),

    phone: z.string(),

  })
  .optional(),


  qrCodeUrl: z
    .string()
    .optional(),

});


// =========================
// TIMELINE
// =========================

const timelineSchema = z.object({

  event: z.string(),


  date: z
    .coerce
    .date()
    .optional(),

});


// =========================
// ADMIN NOTES
// =========================

const adminNoteSchema = z.object({

  message: z.string(),


  createdBy: z.string(),


  createdAt: z
    .coerce
    .date()
    .optional(),

});


// =========================
// FINAL ORDER SCHEMA
// =========================

export const orderSchema = z.object({

  orderInfo:
    orderInfoSchema,


  customer:
    customerSchema,


  items: z
    .array(orderItemSchema)
    .min(1),


  pricing:
    pricingSchema,


  payment:
    paymentSchema,


  customerInvoice:
    customerInvoiceSchema
    .optional(),


  shippingLabel:
    shippingLabelSchema
    .optional(),


  timeline:
    z.array(timelineSchema)
    .optional(),


  adminNotes:
    z.array(adminNoteSchema)
    .optional(),

});


// Type Export

export type OrderFormValues =
  z.infer<typeof orderSchema>;