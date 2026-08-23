import bwipjs from "bwip-js";

/**
 * Renders a real, scannable Code128 barcode server-side and returns it
 * as a base64 PNG data URI — ready to drop into an @react-pdf/renderer
 * <Image src={...} /> element.
 *
 * Used by the Invoice and Shipping Label PDFs to print each order
 * item's real product barcode (same barcode used by the POS scanner).
 */
export async function generateBarcodeDataUrl(
  value: string,
  options?: { height?: number; width?: number }
): Promise<string | null> {
  if (!value) return null;

  try {
    const png = await bwipjs.toBuffer({
      bcid: "code128",
      text: value,
      scale: 3,
      height: options?.height ?? 10, // mm
      width: options?.width,
      includetext: true,
      textxalign: "center",
      textsize: 9,
    });

    return `data:image/png;base64,${png.toString("base64")}`;
  } catch (err) {
    console.error("generateBarcodeDataUrl failed for", value, err);
    return null;
  }
}
