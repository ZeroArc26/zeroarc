import {
  Document,
  Page,
  Text,
  View,
  Image,
} from "@react-pdf/renderer";

import { styles } from "./styles";
import { COMPANY } from "./constants";
import type { InvoiceData } from "./types";

interface Props {
  invoice: InvoiceData;
}

export default function InvoiceTemplate({
  invoice,
}: Props) {
  return (
    <Document>

      <Page
        size="A4"
        style={styles.page}
      >

        {/* ==========================================
            HEADER
        =========================================== */}

        <View style={styles.header}>

          <Text style={styles.companyName}>
            {COMPANY.name}
          </Text>

          <Text style={styles.invoiceTitle}>
            GST TAX INVOICE
          </Text>

          <Text style={styles.companyInfo}>
            GSTIN : {COMPANY.gstin}
          </Text>

          <Text style={styles.companyInfo}>
            Website : {COMPANY.website}
          </Text>

          <Text style={styles.companyInfo}>
            Email : {COMPANY.email}
          </Text>

          <Text style={styles.companyInfo}>
            Phone : {COMPANY.phone}
          </Text>

        </View>

        {/* ==========================================
            INVOICE DETAILS
        =========================================== */}

        <View
          style={[
            styles.section,
            styles.row,
          ]}
        >

          {/* Left */}

          <View style={styles.column}>

            <Text style={styles.heading}>
              Invoice Information
            </Text>

            <Text style={styles.text}>
              Invoice No :
              {" "}
              {invoice.invoiceNumber}
            </Text>

            <Text style={styles.text}>
              Invoice Date :
              {" "}
              {new Date(
                invoice.invoiceDate
              ).toLocaleDateString()}
            </Text>

            <Text style={styles.text}>
              Order No :
              {" "}
              {invoice.orderNumber}
            </Text>

            <Text style={styles.text}>
              Order Date :
              {" "}
              {new Date(
                invoice.orderDate
              ).toLocaleDateString()}
            </Text>

          </View>

          {/* Right */}

          <View style={styles.column}>

            <Text style={styles.heading}>
              Bill To
            </Text>

            <Text style={styles.text}>
              {invoice.customer.name}
            </Text>

            <Text style={styles.text}>
              {invoice.customer.phone}
            </Text>

            <Text style={styles.text}>
              {invoice.customer.email}
            </Text>

            <Text style={styles.text}>
              {
                invoice.customer
                  .billingAddress
                  .address
              }
            </Text>

            <Text style={styles.text}>
              {
                invoice.customer
                  .billingAddress
                  .city
              }
              {" "}
              -
              {" "}
              {
                invoice.customer
                  .billingAddress
                  .pincode
              }
            </Text>

            <Text style={styles.text}>
              {
                invoice.customer
                  .billingAddress
                  .state
              }
            </Text>

          </View>

        </View>

        {/* ==========================================
            SHIPPING ADDRESS
        =========================================== */}

        <View style={styles.section}>

          <Text style={styles.heading}>
            Ship To
          </Text>

          <Text style={styles.text}>
            {invoice.customer.name}
          </Text>

          <Text style={styles.text}>
            {
              invoice.customer
                .shippingAddress
                .address
            }
          </Text>

          <Text style={styles.text}>
            {
              invoice.customer
                .shippingAddress
                .city
            }
            {" "}
            -
            {" "}
            {
              invoice.customer
                .shippingAddress
                .pincode
            }
          </Text>

          <Text style={styles.text}>
            {
              invoice.customer
                .shippingAddress
                .state
            }
          </Text>

          <Text style={styles.text}>
            {
              invoice.customer
                .shippingAddress
                .country
            }
          </Text>

        </View>

        {/* ==========================================
    PRODUCTS TABLE
========================================== */}

<View style={styles.section}>

  <Text style={styles.heading}>
    Products
  </Text>

  {/* Table Header */}

  <View style={styles.tableHeader}>

    <Text
      style={[
        styles.cell,
        { flex: 0.5, fontWeight: "bold" },
      ]}
    >
      #
    </Text>

    <Text
      style={[
        styles.cell,
        { flex: 2.6, fontWeight: "bold" },
      ]}
    >
      Product
    </Text>

    <Text
      style={[
        styles.cell,
        { flex: 1, fontWeight: "bold" },
      ]}
    >
      HSN
    </Text>

    <Text
      style={[
        styles.cell,
        { flex: 0.8, fontWeight: "bold" },
      ]}
    >
      Qty
    </Text>

    <Text
      style={[
        styles.cell,
        { flex: 1.2, fontWeight: "bold" },
      ]}
    >
      Price
    </Text>

    <Text
      style={[
        styles.cell,
        { flex: 1, fontWeight: "bold" },
      ]}
    >
      GST
    </Text>

    <Text
      style={[
        styles.cell,
        { flex: 1.4, fontWeight: "bold" },
      ]}
    >
      Total
    </Text>

  </View>

  {/* Table Rows */}

  {invoice.items.map((item, index) => (

    <View
      key={`${item.sku}-${index}`}
      style={styles.tableRow}
    >

      <Text
        style={[
          styles.cell,
          { flex: 0.5 },
        ]}
      >
        {index + 1}
      </Text>

      <Text
        style={[
          styles.cell,
          { flex: 2.6 },
        ]}
      >
        {item.name}
      </Text>

      <Text
        style={[
          styles.cell,
          { flex: 1 },
        ]}
      >
        {item.hsnCode}
      </Text>

      <Text
        style={[
          styles.cell,
          { flex: 0.8 },
        ]}
      >
        {item.quantity}
      </Text>

      <Text
        style={[
          styles.cell,
          { flex: 1.2 },
        ]}
      >
        ₹{item.price.toFixed(2)}
      </Text>

      <Text
        style={[
          styles.cell,
          { flex: 1 },
        ]}
      >
        {item.gstRate}%
      </Text>

      <Text
        style={[
          styles.cell,
          { flex: 1.4 },
        ]}
      >
        ₹{item.totalAmount.toFixed(2)}
      </Text>

    </View>

  ))}

</View>

{/* ==========================================
    PRICING SUMMARY
========================================== */}

<View style={styles.summary}>

  <View style={styles.summaryRow}>
    <Text>Subtotal</Text>
    <Text>
      ₹{invoice.pricing.subtotal.toFixed(2)}
    </Text>
  </View>

  <View style={styles.summaryRow}>
    <Text>Discount</Text>
    <Text>
      ₹{invoice.pricing.discount.toFixed(2)}
    </Text>
  </View>

  <View style={styles.summaryRow}>
    <Text>Taxable Amount</Text>
    <Text>
      ₹{invoice.pricing.taxableAmount.toFixed(2)}
    </Text>
  </View>

  <View style={styles.summaryRow}>
    <Text>CGST</Text>
    <Text>
      ₹{invoice.pricing.cgst.toFixed(2)}
    </Text>
  </View>

  <View style={styles.summaryRow}>
    <Text>SGST</Text>
    <Text>
      ₹{invoice.pricing.sgst.toFixed(2)}
    </Text>
  </View>

  <View style={styles.summaryRow}>
    <Text>IGST</Text>
    <Text>
      ₹{invoice.pricing.igst.toFixed(2)}
    </Text>
  </View>

  <View style={styles.summaryRow}>
    <Text>Total Tax</Text>
    <Text>
      ₹{invoice.pricing.totalTax.toFixed(2)}
    </Text>
  </View>

  <View
    style={[
      styles.summaryRow,
      styles.total,
    ]}
  >
    <Text>Grand Total</Text>

    <Text>
      ₹{invoice.pricing.grandTotal.toFixed(2)}
    </Text>
  </View>

</View>

    {/* ==========================================
    QR + SIGNATURE
========================================== */}

<View
  style={[
    styles.section,
    styles.row,
    {
      marginTop: 32,
      alignItems: "flex-end",
    },
  ]}
>

  {/* QR */}

  <View style={styles.column}>

    <Text style={styles.heading}>
      Scan for Invoice
    </Text>

    {invoice.tracking.qrCode ? (
      <Image
        src={invoice.tracking.qrCode}
        style={{
          width: 90,
          height: 90,
        }}
      />
    ) : (
      <View
        style={{
          width: 90,
          height: 90,
          borderWidth: 1,
          borderColor: "#000",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 8,
          }}
        >
          QR CODE
        </Text>
      </View>
    )}

  </View>

  {/* Signature */}

  <View
    style={[
      styles.column,
      {
        alignItems: "flex-end",
      },
    ]}
  >

    <Text style={styles.heading}>
      Authorized Signatory
    </Text>

    {invoice.seller.signature ? (
      <Image
        src={invoice.seller.signature}
        style={{
          width: 120,
          height: 45,
          objectFit: "contain",
        }}
      />
    ) : (
      <View
        style={{
          width: 120,
          height: 45,
        }}
      />
    )}

    <Text
      style={{
        marginTop: 6,
        fontSize: 9,
      }}
    >
      For {COMPANY.name}
    </Text>

  </View>

</View>

{/* ==========================================
    TERMS
========================================== */}

<View style={styles.section}>

  <Text style={styles.heading}>
    Terms & Conditions
  </Text>

  <Text style={styles.text}>
    • Goods once sold will not be taken back unless
    covered under the official return policy.
  </Text>

  <Text style={styles.text}>
    • Please preserve this invoice for warranty,
    exchange and return purposes.
  </Text>

  <Text style={styles.text}>
    • Subject to local jurisdiction only.
  </Text>

</View>

{/* ==========================================
    FOOTER
========================================== */}

<View style={styles.footer}>

  <Text>
    Thank you for shopping with {COMPANY.name}
  </Text>

  <Text>
    Wear Your Next Arc
  </Text>

  <Text>
    {COMPANY.website}
  </Text>

  <Text
    render={({ pageNumber, totalPages }) =>
      `Page ${pageNumber} of ${totalPages}`
    }
    fixed
  />

</View>


      </Page>

    </Document>
  );
}