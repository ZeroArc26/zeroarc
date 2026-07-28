export function calculateAvailableStock(
  stock: number,
  reserved: number
) {
  return Math.max(stock - reserved, 0);
}

export function getStockStatus(stock: number) {
  if (stock <= 0)
    return {
      label: "Out of Stock",
      color: "red",
      progress: 0,
    };

  if (stock <= 10)
    return {
      label: "Critical",
      color: "red",
      progress: 20,
    };

  if (stock <= 50)
    return {
      label: "Low",
      color: "yellow",
      progress: 55,
    };

  return {
    label: "Healthy",
    color: "green",
    progress: 100,
  };
}