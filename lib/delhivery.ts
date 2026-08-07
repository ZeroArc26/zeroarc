interface DelhiveryShipmentInput {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMode: "cod" | "prepaid";
  codAmount: number;
  totalAmount: number;
  weightGrams: number;
  dimensions: { length: number; width: number; height: number };
  productsDesc: string;
  quantity: number;
  sellerName: string;
  sellerAddress: string;
}

interface DelhiveryResult {
  success: boolean;
  waybill?: string;
  message?: string;
  raw?: any;
}

export async function createDelhiveryShipment(
  input: DelhiveryShipmentInput
): Promise<DelhiveryResult> {
  const baseUrl = process.env.DELHIVERY_BASE_URL || "https://track.delhivery.com";
  const token = process.env.DELHIVERY_API_TOKEN;
  const pickupLocation = process.env.DELHIVERY_PICKUP_LOCATION;

  if (!token || !pickupLocation) {
    return { success: false, message: "Delhivery API not configured (missing env vars)." };
  }

  const shipment = {
    name: input.customerName,
    order: input.orderNumber,
    phone: input.customerPhone,
    add: input.address,
    pin: input.pincode,
    city: input.city,
    state: input.state,
    payment_mode: input.paymentMode === "cod" ? "COD" : "Prepaid",
    cod_amount: input.paymentMode === "cod" ? input.codAmount : 0,
    total_amount: input.totalAmount,
    weight: input.weightGrams,
    shipment_height: input.dimensions.height,
    shipment_width: input.dimensions.width,
    shipment_length: input.dimensions.length,
    products_desc: input.productsDesc,
    quantity: String(input.quantity),
    seller_name: input.sellerName,
    seller_add: input.sellerAddress,
    shipping_mode: "Surface",
  };

  const payload = {
    shipments: [shipment],
    pickup_location: { name: pickupLocation },
  };

  // NOTE: Delhivery's docs show the body as the literal string
  // "format=json&data={...json...}" — not a pure JSON body, despite
  // the Content-Type header. Following their example exactly.
  const body = `format=json&data=${JSON.stringify(payload)}`;

  try {
    const res = await fetch(`${baseUrl}/api/cmu/create.json`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body,
    });

    const data = await res.json();

    // NOTE: response shape below (data.packages[0].waybill / .status)
    // is the standard Delhivery format — confirm against your actual
    // first test response and adjust if field names differ.
    const packageResult = data?.packages?.[0];

    if (!res.ok || !packageResult || packageResult.status !== "Success") {
      return {
        success: false,
        message:
          packageResult?.remarks?.[0] ||
          data?.rmk ||
          "Delhivery shipment creation failed.",
        raw: data,
      };
    }

    return {
      success: true,
      waybill: packageResult.waybill,
      raw: data,
    };
  } catch (error) {
    console.error("Delhivery API error:", error);
    return { success: false, message: "Failed to reach Delhivery API." };
  }
}