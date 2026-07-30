export interface InvoiceItem {
  name: string;
  sku?: string;
  hsnCode?: string;
  quantity: number;
  price: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: Date;

  orderNumber: string;
  orderDate: Date;

  customer: {
    name: string;
    email?: string;
    phone?: string;

    billingAddress: {
      address: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };

    shippingAddress: {
      address: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
  };

  seller: {
  companyName: string;
  address: string;
  gstin: string;
  pan: string;
  email: string;
  phone: string;
  signature: string;
};

  items: InvoiceItem[];

  pricing: {
    subtotal: number;
    discount: number;
    taxableAmount: number;
    cgst: number;
    sgst: number;
    igst: number;
    totalTax: number;
    grandTotal: number;
  };

  payment: {
    method: string;
    status: string;
    transactionId?: string;
  };

  tracking: {
    trackingId?: string;
    qrCode?: string;
  };
}