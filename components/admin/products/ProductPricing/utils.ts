export function calculateProfit(
  sellingPrice: number,
  costPrice: number
) {
  return sellingPrice - costPrice;
}

export function calculateMargin(
  sellingPrice: number,
  costPrice: number
) {
  if (sellingPrice <= 0) return 0;

  return Number(
    (
      ((sellingPrice - costPrice) /
        sellingPrice) *
      100
    ).toFixed(1)
  );
}

export function calculateCustomerSavings(
  sellingPrice: number,
  comparePrice: number
) {
  return Math.max(comparePrice - sellingPrice, 0);
}

export function calculateBreakEvenPrice(
  costPrice: number,
  taxRate: number
) {
  return Number(
    (
      costPrice +
      (costPrice * taxRate) / 100
    ).toFixed(2)
  );
}

export function calculateFinalPrice(
  sellingPrice: number,
  discountType: "percentage" | "fixed",
  discountValue: number
) {
  if (discountType === "percentage") {
    return Math.max(
      sellingPrice -
        (sellingPrice * discountValue) / 100,
      0
    );
  }

  return Math.max(
    sellingPrice - discountValue,
    0
  );
}

export function getMarginStatus(
  margin: number
) {
  if (margin >= 40) {
    return {
      label: "Excellent",
      color: "text-emerald-400",
      progress: 100,
    };
  }

  if (margin >= 25) {
    return {
      label: "Good",
      color: "text-yellow-400",
      progress: 70,
    };
  }

  if (margin >= 15) {
    return {
      label: "Average",
      color: "text-orange-400",
      progress: 45,
    };
  }

  return {
    label: "Low",
    color: "text-red-400",
    progress: 20,
  };
}