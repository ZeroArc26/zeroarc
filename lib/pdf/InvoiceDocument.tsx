import {
  Document,
  Page,
  View,
  Text,
  Image,
  Svg,
  Path,
  Circle,
  Rect,
  Line,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 22,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#111111",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  logoText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  brandName: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
  },
  brandTagline: {
    fontSize: 8,
    letterSpacing: 2,
    color: "#444444",
    marginTop: 2,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 6,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  contactText: {
    fontSize: 8,
    color: "#333333",
  },
  invoiceBox: {
    backgroundColor: "#000000",
    borderRadius: 6,
    padding: 12,
    width: 190,
  },
  invoiceBoxTitle: {
    color: "#ffffff",
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 1,
  },
  invoiceBoxRow: {
    marginBottom: 6,
  },
  invoiceBoxLabel: {
    color: "#aaaaaa",
    fontSize: 7,
  },
  invoiceBoxValue: {
    color: "#ffffff",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    marginTop: 1,
  },
  gstin: {
    marginTop: 14,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    marginTop: 8,
    marginBottom: 10,
  },
  addressRow: {
    flexDirection: "row",
    gap: 12,
  },
  addressBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 6,
    padding: 10,
  },
  addressBoxHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 6,
  },
  addressBoxTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },
  addressLine: {
    fontSize: 8.5,
    color: "#333333",
    marginBottom: 2,
  },
  qrBox: {
    width: 130,
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
  },
  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 6,
    overflow: "hidden",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f2eefc",
    paddingVertical: 4,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: "#eeeeee",
  },
  th: {
    fontSize: 6.8,
    fontFamily: "Helvetica-Bold",
    color: "#333333",
  },
  td: {
    fontSize: 7.3,
    color: "#333333",
  },
  colNum: { width: "3%", paddingHorizontal: 3 },
  colProduct: { width: "17%", paddingHorizontal: 3 },
  colSku: { width: "9%", paddingHorizontal: 3 },
  colSize: { width: "6%", paddingHorizontal: 3 },
  colColor: { width: "8%", paddingHorizontal: 3 },
  colQty: { width: "5%", paddingHorizontal: 3 },
  colPrice: { width: "10%", paddingHorizontal: 3, textAlign: "right" },
  colDiscount: { width: "8%", paddingHorizontal: 3, textAlign: "right" },
  colTaxable: { width: "11%", paddingHorizontal: 3, textAlign: "right" },
  colTaxPct: { width: "6%", paddingHorizontal: 3, textAlign: "right" },
  colTaxAmt: { width: "9%", paddingHorizontal: 3, textAlign: "right" },
  colTotal: { width: "10%", paddingHorizontal: 3, textAlign: "right" },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  wordsBox: {
    width: "48%",
  },
  totalsBox: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 6,
    overflow: "hidden",
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: "#eeeeee",
  },
  totalsRowFirst: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#000000",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  grandTotalText: {
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },
  packageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 6,
    padding: 10,
  },
  packageCol: {
    width: "32%",
  },
  packageColHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 5,
  },
  packageTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
  },
  packageLine: {
    fontSize: 8,
    color: "#333333",
    marginBottom: 2,
  },
  promiseSection: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#dddddd",
  },
  promiseHeading: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 6,
  },
  promiseRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  promiseItem: {
    alignItems: "center",
    width: "22%",
    gap: 4,
  },
  promiseTitle: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  promiseSub: {
    fontSize: 6.5,
    color: "#666666",
    textAlign: "center",
    marginTop: 2,
  },
  thankYouRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#dddddd",
    borderStyle: "dashed",
  },
  thankYouTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  thankYouSub: {
    fontSize: 7.5,
    color: "#555555",
    marginTop: 2,
  },
  footer: {
    marginTop: 10,
    textAlign: "center",
    backgroundColor: "#000000",
    color: "#ffffff",
    paddingVertical: 6,
  },
  footerLine1: {
    fontSize: 8,
    letterSpacing: 1,
    fontFamily: "Helvetica-Bold",
  },
  footerLine2: {
    fontSize: 6.5,
    letterSpacing: 1.5,
    color: "#cccccc",
    marginTop: 2,
  },
});

function formatCurrency(n: number) {
  return `Rs. ${Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// ---- Number to words (Indian numbering system) ----
const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];
const TENS = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
];

function twoDigitsToWords(n: number): string {
  if (n < 20) return ONES[n];
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return `${TENS[tens]}${ones ? " " + ONES[ones] : ""}`;
}

function threeDigitsToWords(n: number): string {
  const hundred = Math.floor(n / 100);
  const rest = n % 100;
  let str = "";
  if (hundred) str += `${ONES[hundred]} Hundred${rest ? " " : ""}`;
  if (rest) str += twoDigitsToWords(rest);
  return str;
}

function numberToWords(num: number): string {
  const n = Math.floor(num);
  if (n === 0) return "Zero";

  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const rest = n % 1000;

  let words = "";
  if (crore) words += `${threeDigitsToWords(crore)} Crore `;
  if (lakh) words += `${threeDigitsToWords(lakh)} Lakh `;
  if (thousand) words += `${threeDigitsToWords(thousand)} Thousand `;
  if (rest) words += threeDigitsToWords(rest);

  return words.trim();
}

function amountInWords(amount: number) {
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  let str = `${numberToWords(rupees)} Rupees`;
  if (paise > 0) str += ` And ${numberToWords(paise)} Paise`;
  return `${str} Only`;
}

// ---- Simple inline icons (react-pdf svg) ----
function IconPerson({ size = 10 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="8" r="4" fill="#000000" />
      <Path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="#000000" />
    </Svg>
  );
}

function IconPin({ size = 10 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2C7.6 2 4 5.6 4 10c0 6 8 12 8 12s8-6 8-12c0-4.4-3.6-8-8-8z"
        fill="#000000"
      />
      <Circle cx="12" cy="10" r="3" fill="#ffffff" />
    </Svg>
  );
}

function IconBox({ size = 11 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M3 7l9-4 9 4-9 4-9-4z"
        stroke="#000000"
        strokeWidth={1.5}
        fill="none"
      />
      <Path
        d="M3 7v10l9 4 9-4V7"
        stroke="#000000"
        strokeWidth={1.5}
        fill="none"
      />
      <Line x1="12" y1="11" x2="12" y2="21" stroke="#000000" strokeWidth={1.5} />
    </Svg>
  );
}

function IconTruck({ size = 11 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x="2" y="7" width="12" height="8" stroke="#000000" strokeWidth={1.5} fill="none" />
      <Path d="M14 10h4l3 3v2h-7v-5z" stroke="#000000" strokeWidth={1.5} fill="none" />
      <Circle cx="6" cy="17" r="1.6" fill="#000000" />
      <Circle cx="17" cy="17" r="1.6" fill="#000000" />
    </Svg>
  );
}

function IconCalendar({ size = 11 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x="3" y="5" width="18" height="16" rx="2" stroke="#000000" strokeWidth={1.5} fill="none" />
      <Line x1="3" y1="10" x2="21" y2="10" stroke="#000000" strokeWidth={1.5} />
      <Line x1="7" y1="2" x2="7" y2="6" stroke="#000000" strokeWidth={1.5} />
      <Line x1="17" y1="2" x2="17" y2="6" stroke="#000000" strokeWidth={1.5} />
    </Svg>
  );
}

function IconCheck({ size = 14 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="10" fill="#000000" />
      <Path d="M7 12.5l3 3 7-7" stroke="#ffffff" strokeWidth={2} fill="none" />
    </Svg>
  );
}

function IconReturn({ size = 14 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M4 4v6h6M4 10a8 8 0 1 1 2.3 5.7"
        stroke="#000000"
        strokeWidth={1.8}
        fill="none"
      />
    </Svg>
  );
}

function IconHeadset({ size = 14 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M4 13v-1a8 8 0 0 1 16 0v1"
        stroke="#000000"
        strokeWidth={1.8}
        fill="none"
      />
      <Rect x="3" y="13" width="4" height="6" rx="1.5" fill="#000000" />
      <Rect x="17" y="13" width="4" height="6" rx="1.5" fill="#000000" />
    </Svg>
  );
}

function IconShield({ size = 14 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z"
        fill="#000000"
      />
      <Path d="M8.5 12l2.5 2.5 4.5-4.5" stroke="#ffffff" strokeWidth={1.6} fill="none" />
    </Svg>
  );
}

interface InvoiceDocumentProps {
  order: any;
  qrDataUrl?: string;
  logoDataUrl?: string;
  delhiveryLogoDataUrl?: string;
  company: {
    name: string;
    tagline: string;
    website: string;
    phone: string;
    email: string;
    gstin: string;
    state: string;
  };
}

export default function InvoiceDocument({
  order,
  logoDataUrl,
  delhiveryLogoDataUrl,
  company,
}: InvoiceDocumentProps) {
  const address = order.customer?.shippingAddress || {};
  const billing = order.customer?.billingAddress || address;

  const isInterState = (order.pricing?.igst || 0) > 0;
  const taxLabel = isInterState ? "IGST" : "GST";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.brandRow}>
            {logoDataUrl ? (
              <Image src={logoDataUrl} style={styles.logoImage} />
            ) : (
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>ZA</Text>
              </View>
            )}

            <View>
              <Text style={styles.brandName}>{company.name}</Text>
              <Text style={styles.brandTagline}>{company.tagline}</Text>

              <View style={styles.contactRow}>
                <Text style={styles.contactText}>{company.website}</Text>
                <Text style={styles.contactText}>{company.email}</Text>
              </View>
            </View>
          </View>

          <View style={styles.invoiceBox}>
            <Text style={styles.invoiceBoxTitle}>TAX INVOICE</Text>

            <View style={styles.invoiceBoxRow}>
              <Text style={styles.invoiceBoxLabel}>Invoice No.</Text>
              <Text style={styles.invoiceBoxValue}>
                {order.invoiceInfo?.invoiceNumber}
              </Text>
            </View>

            <View style={styles.invoiceBoxRow}>
              <Text style={styles.invoiceBoxLabel}>Invoice Date</Text>
              <Text style={styles.invoiceBoxValue}>
                {new Date(order.orderInfo?.orderDate).toLocaleDateString(
                  "en-IN",
                  { day: "2-digit", month: "long", year: "numeric" }
                )}
              </Text>
            </View>

            <View style={styles.invoiceBoxRow}>
              <Text style={styles.invoiceBoxLabel}>Order ID</Text>
              <Text style={styles.invoiceBoxValue}>
                #{order.orderInfo?.orderNumber}
              </Text>
            </View>

            <View>
              <Text style={styles.invoiceBoxLabel}>Payment Status</Text>
              <Text style={styles.invoiceBoxValue}>
                {(order.payment?.status || "").toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.gstin}>GSTIN : {company.gstin}</Text>

        <View style={styles.divider} />

        {/* Bill To / Ship To / QR */}
        <View style={styles.addressRow}>
          <View style={styles.addressBox}>
            <View style={styles.addressBoxHeader}>
              <IconPerson />
              <Text style={styles.addressBoxTitle}>BILL TO</Text>
            </View>
            <Text style={styles.addressLine}>{order.customer?.name}</Text>
            <Text style={styles.addressLine}>{order.customer?.phone}</Text>
            <Text style={styles.addressLine}>{billing.address}</Text>
            <Text style={styles.addressLine}>
              {billing.city}, {billing.state} - {billing.pincode}
            </Text>
          </View>

          <View style={styles.addressBox}>
            <View style={styles.addressBoxHeader}>
              <IconPin />
              <Text style={styles.addressBoxTitle}>SHIP TO</Text>
            </View>
            <Text style={styles.addressLine}>{order.customer?.name}</Text>
            <Text style={styles.addressLine}>{order.customer?.phone}</Text>
            <Text style={styles.addressLine}>{address.address}</Text>
            <Text style={styles.addressLine}>
              {address.city}, {address.state} - {address.pincode}
            </Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.th, styles.colNum]}>#</Text>
            <Text style={[styles.th, styles.colProduct]}>Product</Text>
            <Text style={[styles.th, styles.colSku]}>SKU</Text>
            <Text style={[styles.th, styles.colSize]}>Size</Text>
            <Text style={[styles.th, styles.colColor]}>Color</Text>
            <Text style={[styles.th, styles.colQty]}>Qty</Text>
            <Text style={[styles.th, styles.colPrice]}>Unit Price</Text>
            <Text style={[styles.th, styles.colDiscount]}>Discount</Text>
            <Text style={[styles.th, styles.colTaxable]}>Taxable Val.</Text>
            <Text style={[styles.th, styles.colTaxPct]}>{taxLabel}%</Text>
            <Text style={[styles.th, styles.colTaxAmt]}>{taxLabel} Amt</Text>
            <Text style={[styles.th, styles.colTotal]}>Total</Text>
          </View>

          {(order.items || []).map((item: any, i: number) => {
            const lineTotal = item.totalAmount ?? item.price * item.quantity;
            const lineTax = item.gstAmount ?? 0;
            const lineTaxable = lineTotal - lineTax;

            return (
              <View style={styles.tableRow} key={i}>
                <Text style={[styles.td, styles.colNum]}>{i + 1}</Text>
                <Text style={[styles.td, styles.colProduct]}>{item.name}</Text>
                <Text style={[styles.td, styles.colSku]}>{item.sku || "-"}</Text>
                <Text style={[styles.td, styles.colSize]}>{item.size || "-"}</Text>
                <Text style={[styles.td, styles.colColor]}>{item.color || "-"}</Text>
                <Text style={[styles.td, styles.colQty]}>{item.quantity}</Text>
                <Text style={[styles.td, styles.colPrice]}>
                  {formatCurrency(item.price)}
                </Text>
                <Text style={[styles.td, styles.colDiscount]}>Rs. 0.00</Text>
                <Text style={[styles.td, styles.colTaxable]}>
                  {formatCurrency(lineTaxable)}
                </Text>
                <Text style={[styles.td, styles.colTaxPct]}>
                  {item.gstRate ?? 18}%
                </Text>
                <Text style={[styles.td, styles.colTaxAmt]}>
                  {formatCurrency(lineTax)}
                </Text>
                <Text style={[styles.td, styles.colTotal]}>
                  {formatCurrency(lineTotal)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Amount in words + Totals */}
        <View style={styles.bottomRow}>
          <View style={styles.wordsBox}>
            <Text
              style={{ fontFamily: "Helvetica-Bold", fontSize: 8, marginBottom: 4 }}
            >
              Amount In Words:
            </Text>
            <Text style={{ fontSize: 8, color: "#333333" }}>
              {amountInWords(order.pricing?.grandTotal || 0)}
            </Text>
          </View>

          <View style={styles.totalsBox}>
            <View style={styles.totalsRowFirst}>
              <Text style={styles.td}>Taxable Value</Text>
              <Text style={styles.td}>
                {formatCurrency(order.pricing?.taxableAmount)}
              </Text>
            </View>

            {isInterState ? (
              <View style={styles.totalsRow}>
                <Text style={styles.td}>Total IGST</Text>
                <Text style={styles.td}>
                  {formatCurrency(order.pricing?.igst)}
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.totalsRow}>
                  <Text style={styles.td}>CGST</Text>
                  <Text style={styles.td}>
                    {formatCurrency(order.pricing?.cgst)}
                  </Text>
                </View>
                <View style={styles.totalsRow}>
                  <Text style={styles.td}>SGST</Text>
                  <Text style={styles.td}>
                    {formatCurrency(order.pricing?.sgst)}
                  </Text>
                </View>
              </>
            )}

            {(order.pricing?.shipping ?? 0) > 0 && (
              <View style={styles.totalsRow}>
                <Text style={styles.td}>Shipping Charges</Text>
                <Text style={styles.td}>
                  {formatCurrency(order.pricing?.shipping)}
                </Text>
              </View>
            )}

            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalText}>GRAND TOTAL</Text>
              <Text style={styles.grandTotalText}>
                {formatCurrency(order.pricing?.grandTotal)}
              </Text>
            </View>

            <View style={styles.totalsRow}>
              <Text style={styles.td}>Payment Method</Text>
              <Text style={[styles.td, { textTransform: "uppercase" }]}>
                {order.payment?.method}
              </Text>
            </View>

            <View style={styles.totalsRow}>
              <Text style={styles.td}>Amount Paid</Text>
              <Text style={styles.td}>
                {formatCurrency(order.pricing?.grandTotal)}
              </Text>
            </View>
          </View>
        </View>

        {/* Package Details */}
        <View style={styles.packageRow}>
          <View style={styles.packageCol}>
            <View style={styles.packageColHeader}>
              <IconBox />
              <Text style={styles.packageTitle}>PACKAGE DETAILS</Text>
            </View>
            <Text style={styles.packageLine}>
              Items: {order.items?.length || 0}
            </Text>
            <Text style={styles.packageLine}>
              Package Type: {order.shippingLabel?.packageType || "Poly Mailer"}
            </Text>
          </View>

          <View style={styles.packageCol}>
            <View style={styles.packageColHeader}>
              {order.shippingLabel?.courierPartner === "Delhivery" && delhiveryLogoDataUrl ? (
                <Image src={delhiveryLogoDataUrl} style={{ width: 40, height: 15 }} />
              ) : (
                <IconTruck />
              )}
              <Text style={styles.packageTitle}>SHIPPED VIA</Text>
            </View>
            <Text style={styles.packageLine}>
              {order.shippingLabel?.courierPartner || "To be assigned"}
            </Text>
            <Text style={styles.packageLine}>
              AWB: {order.shippingLabel?.awbNumber || "Pending"}
            </Text>
          </View>

          <View style={styles.packageCol}>
            <View style={styles.packageColHeader}>
              <IconCalendar />
              <Text style={styles.packageTitle}>SOLD BY</Text>
            </View>
            <Text style={styles.packageLine}>{company.name}</Text>
            <Text style={styles.packageLine}>GSTIN: {company.gstin}</Text>
          </View>
        </View>

        {/* Promise */}
        <View style={styles.promiseSection}>
          <Text style={styles.promiseHeading}>OUR PROMISE</Text>
          <View style={styles.promiseRow}>
            <View style={styles.promiseItem}>
              <IconCheck />
              <Text style={styles.promiseTitle}>Premium Quality</Text>
              <Text style={styles.promiseSub}>Quality you can trust</Text>
            </View>
            <View style={styles.promiseItem}>
              <IconReturn />
              <Text style={styles.promiseTitle}>Easy Returns</Text>
              <Text style={styles.promiseSub}>Hassle free returns</Text>
            </View>
            <View style={styles.promiseItem}>
              <IconHeadset />
              <Text style={styles.promiseTitle}>Customer Support</Text>
              <Text style={styles.promiseSub}>We are here for you</Text>
            </View>
            <View style={styles.promiseItem}>
              <IconShield />
              <Text style={styles.promiseTitle}>Secure Payment</Text>
              <Text style={styles.promiseSub}>Safe & secure checkout</Text>
            </View>
          </View>
        </View>

        {/* Thank You */}
        <View style={styles.thankYouRow}>
          {logoDataUrl && (
            <Image src={logoDataUrl} style={{ width: 46, height: 46 }} />
          )}
          <View>
            <Text style={styles.thankYouTitle}>THANK YOU!</Text>
            <Text style={styles.thankYouSub}>
              We truly appreciate your purchase.
            </Text>
            <Text style={styles.thankYouSub}>
              Your support means the world to us.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerLine1}>
            THANK YOU FOR CHOOSING ZEROARC
          </Text>
          <Text style={styles.footerLine2}>{company.tagline}</Text>
        </View>
      </Page>
    </Document>
  );
}