export function generateInvoiceNumber(
  count: number
) {

  const year = new Date()
    .getFullYear();


  const serial =
    String(count + 1)
      .padStart(6, "0");


  return (
    `INV-ZA-${year}-${serial}`
  );

}