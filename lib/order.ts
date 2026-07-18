export function generateOrderId() {
  const timestamp = Date.now().toString().slice(-6);

  return `ZA${timestamp}`;
}

export function generateInvoiceNumber() {
  const year = new Date().getFullYear();

  const timestamp = Date.now().toString().slice(-6);

  return `INV-${year}-${timestamp}`;
}

export function getInitialStatusHistory() {
  return [
    {
      status: "processing",
      updatedAt: new Date(),
    },
  ];
}