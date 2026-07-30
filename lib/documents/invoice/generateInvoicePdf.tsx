import { pdf } from "@react-pdf/renderer";

import InvoiceTemplate from "./InvoiceTemplate";

import type { InvoiceData } from "./types";

/* ============================================================
   TYPES
============================================================ */

export interface GenerateInvoicePdfOptions {
  fileName?: string;
}

export interface GeneratedInvoicePdf {
  blob: Blob;
  fileName: string;
}

/* ============================================================
   HELPERS
============================================================ */

function getInvoiceFileName(
  invoice: InvoiceData,
  options?: GenerateInvoicePdfOptions
): string {
  if (options?.fileName) {
    return options.fileName;
  }

  return `${invoice.invoiceNumber}.pdf`;
}

/* ============================================================
   CREATE PDF DOCUMENT
============================================================ */

function createInvoiceDocument(
  invoice: InvoiceData
) {
  return (
    <InvoiceTemplate
      invoice={invoice}
    />
  );
}

/* ============================================================
   GENERATE PDF INSTANCE
============================================================ */

export async function generateInvoicePdf(
  invoice: InvoiceData
) {
  try {
    const instance = pdf(
      createInvoiceDocument(invoice)
    );

    return instance;
  } catch (error) {
    console.error(
      "[Invoice PDF] Failed to create PDF instance",
      error
    );

    throw new Error(
      "Failed to create invoice PDF."
    );
  }
}

/* ============================================================
   GENERATE BLOB
============================================================ */

export async function generateInvoiceBlob(
  invoice: InvoiceData
): Promise<Blob> {
  try {
    const instance =
      await generateInvoicePdf(invoice);

    return await instance.toBlob();
  } catch (error) {
    console.error(
      "[Invoice PDF] Failed to generate Blob",
      error
    );

    throw new Error(
      "Failed to generate invoice Blob."
    );
  }
}

/* ============================================================
   ARRAY BUFFER
============================================================ */

export async function generateInvoiceArrayBuffer(
  invoice: InvoiceData
): Promise<ArrayBuffer> {
  try {
    const blob =
      await generateInvoiceBlob(invoice);

    return await blob.arrayBuffer();
  } catch (error) {
    console.error(
      "[Invoice PDF] Failed to generate ArrayBuffer",
      error
    );

    throw new Error(
      "Failed to generate invoice ArrayBuffer."
    );
  }
}

/* ============================================================
   UINT8 ARRAY
============================================================ */

export async function generateInvoiceUint8Array(
  invoice: InvoiceData
): Promise<Uint8Array> {
  try {
    const buffer =
      await generateInvoiceArrayBuffer(invoice);

    return new Uint8Array(buffer);
  } catch (error) {
    console.error(
      "[Invoice PDF] Failed to generate Uint8Array",
      error
    );

    throw new Error(
      "Failed to generate invoice Uint8Array."
    );
  }
}

/* ============================================================
   PREVIEW PDF
============================================================ */

export async function previewInvoicePdf(
  invoice: InvoiceData
): Promise<void> {
  try {
    const blob =
      await generateInvoiceBlob(invoice);

    const url =
      URL.createObjectURL(blob);

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 10000);
  } catch (error) {
    console.error(
      "[Invoice PDF] Failed to preview PDF",
      error
    );

    throw new Error(
      "Failed to preview invoice."
    );
  }
}

/* ============================================================
   DOWNLOAD PDF
============================================================ */

export async function downloadInvoicePdf(
  invoice: InvoiceData
): Promise<void> {
  try {
    const blob =
      await generateInvoiceBlob(invoice);

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      getInvoiceFileName(invoice);

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error(
      "[Invoice PDF] Failed to download PDF",
      error
    );

    throw new Error(
      "Failed to download invoice."
    );
  }
}

/* ============================================================
   SERVER RESPONSE HELPERS
============================================================ */

export async function generateInvoiceResponse(
  invoice: InvoiceData,
  options?: GenerateInvoicePdfOptions
): Promise<Response> {
  const blob = await generateInvoiceBlob(invoice);

  return new Response(blob, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${getInvoiceFileName(
        invoice,
        options
      )}"`,
      "Cache-Control": "no-store",
    },
  });
}

/* ============================================================
   DOWNLOAD RESPONSE
============================================================ */

export async function generateInvoiceDownloadResponse(
  invoice: InvoiceData,
  options?: GenerateInvoicePdfOptions
): Promise<Response> {
  const blob = await generateInvoiceBlob(invoice);

  return new Response(blob, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${getInvoiceFileName(
        invoice,
        options
      )}"`,
      "Cache-Control": "no-store",
    },
  });
}

/* ============================================================
   EXPORTS
============================================================ */

export {
  getInvoiceFileName,
  createInvoiceDocument,
};