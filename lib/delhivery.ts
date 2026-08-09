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

export async function trackDelhiveryShipment(waybill: string) {
  const baseUrl = process.env.DELHIVERY_BASE_URL || "https://track.delhivery.com";
  const token = process.env.DELHIVERY_API_TOKEN;

  if (!token) {
    return { success: false, message: "Delhivery API not configured." };
  }

  try {
    const res = await fetch(
      `${baseUrl}/api/v1/packages/json/?waybill=${waybill}`,
      {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: "Failed to fetch tracking info.", raw: data };
    }

    return { success: true, raw: data };
  } catch (error) {
    console.error("Delhivery tracking error:", error);
    return { success: false, message: "Failed to reach Delhivery tracking API." };
  }
}

interface DelhiveryReversePickupInput {
  returnRefNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  customerState: string;
  customerPincode: string;
  returnToName: string;
  returnToAddress: string;
  returnToCity: string;
  returnToState: string;
  returnToPincode: string;
  weightGrams: number;
  dimensions: { length: number; width: number; height: number };
  productsDesc: string;
  quantity: number;
}

export async function createDelhiveryReversePickup(
  input: DelhiveryReversePickupInput
): Promise<DelhiveryResult> {
  const baseUrl = process.env.DELHIVERY_BASE_URL || "https://track.delhivery.com";
  const token = process.env.DELHIVERY_API_TOKEN;
  const pickupLocation = process.env.DELHIVERY_PICKUP_LOCATION;

  if (!token || !pickupLocation) {
    return { success: false, message: "Delhivery API not configured (missing env vars)." };
  }

  // For a reverse pickup, "payment_mode: Pickup" flips the meaning of
  // the fields — name/add/city/state/pin become the PICKUP location
  // (the customer's address), and return_* fields become the DROP
  // (our own warehouse), per Delhivery's B2C docs.
  const shipment = {
    name: input.customerName,
    order: input.returnRefNumber,
    phone: input.customerPhone,
    add: input.customerAddress,
    pin: input.customerPincode,
    city: input.customerCity,
    state: input.customerState,
    payment_mode: "Pickup",
    weight: input.weightGrams,
    shipment_height: input.dimensions.height,
    shipment_width: input.dimensions.width,
    shipment_length: input.dimensions.length,
    products_desc: input.productsDesc,
    quantity: String(input.quantity),
    return_name: input.returnToName,
    return_address: input.returnToAddress,
    return_city: input.returnToCity,
    return_state: input.returnToState,
    return_pin: input.returnToPincode,
    return_country: "India",
    shipping_mode: "Surface",
  };

  const payload = {
    shipments: [shipment],
    pickup_location: { name: pickupLocation },
  };

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

    const packageResult = data?.packages?.[0];

    if (!res.ok || !packageResult || packageResult.status !== "Success") {
      return {
        success: false,
        message:
          packageResult?.remarks?.[0] ||
          data?.rmk ||
          "Delhivery reverse pickup creation failed.",
        raw: data,
      };
    }

    return {
      success: true,
      waybill: packageResult.waybill,
      raw: data,
    };
  } catch (error) {
    console.error("Delhivery reverse pickup error:", error);
    return { success: false, message: "Failed to reach Delhivery API." };
  }
}