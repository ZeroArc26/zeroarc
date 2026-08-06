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

import PseudoBarcode from "./PseudoBarcode";

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
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoImage: {
    width: 55,
    height: 55,
  },
  logoCircle: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    borderWidth: 2,
    borderColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  brandName: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
  },
  brandTagline: {
    fontSize: 7.5,
    letterSpacing: 2,
    color: "#444444",
    marginTop: 2,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 5,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  contactText: {
    fontSize: 7.5,
    color: "#333333",
  },
  labelBox: {
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 6,
    width: 170,
    overflow: "hidden",
  },
  labelBoxTitleBar: {
    backgroundColor: "#000000",
    paddingVertical: 6,
    alignItems: "center",
  },
  labelBoxTitleText: {
    color: "#ffffff",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
  },
  labelBoxBody: {
    padding: 10,
  },
  labelBoxLabel: {
    fontSize: 6.5,
    color: "#888888",
    marginBottom: 2,
  },
  labelBoxValue: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
  },
  sectionDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    marginVertical: 12,
  },
  tagBadge: {
    backgroundColor: "#000000",
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  tagBadgeText: {
    color: "#ffffff",
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
  },
  twoColRow: {
    flexDirection: "row",
    gap: 16,
  },
  colHalf: {
    flex: 1,
  },
  iconTagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  iconSquare: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  boldName: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
  },
  bodyLine: {
    fontSize: 8.5,
    color: "#333333",
    marginBottom: 2,
  },
  courierName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
  },
  awbLabel: {
    fontSize: 6.5,
    color: "#888888",
    marginBottom: 1,
  },
  awbValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
  },
  packageDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  packageDetailLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#333333",
  },
  packageDetailValue: {
    fontSize: 8,
    color: "#333333",
  },
  addressDashLine: {
    fontSize: 8,
    color: "#cccccc",
    marginBottom: 3,
  },
  table: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 6,
    overflow: "hidden",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f2eefc",
    paddingVertical: 5,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: "#eeeeee",
  },
  th: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#333333",
  },
  td: {
    fontSize: 7.5,
    color: "#333333",
  },
  colProduct: { width: "40%", paddingHorizontal: 6 },
  colSku: { width: "18%", paddingHorizontal: 6 },
  colQty: { width: "12%", paddingHorizontal: 6 },
  colSize: { width: "15%", paddingHorizontal: 6 },
  colColor: { width: "15%", paddingHorizontal: 6 },
  careRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  careItem: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 6,
    alignItems: "center",
    paddingVertical: 8,
    gap: 4,
  },
  careLabel: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
  },
  trackRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 6,
    padding: 10,
    gap: 14,
  },
  trackQrCol: {
    alignItems: "center",
    gap: 4,
  },
  trackTextCol: {
    gap: 2,
  },
  trackTitle: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
  },
  trackSub: {
    fontSize: 6.5,
    color: "#888888",
    marginTop: 4,
  },
  trackValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  trackBarcodeCol: {
    flex: 1,
    alignItems: "center",
  },
  codRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 6,
    padding: 10,
  },
  codLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rupeeCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  codAmountBox: {
    alignItems: "flex-end",
  },
  codAmountValue: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
  },
  codAmountSub: {
    fontSize: 7,
    color: "#666666",
    marginTop: 1,
  },
  statusBadge: {
    backgroundColor: "#000000",
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 10,
    marginTop: 4,
  },
  statusBadgeText: {
    color: "#ffffff",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  footer: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#000000",
    paddingVertical: 8,
  },
  footerText: {
    color: "#ffffff",
    fontSize: 8,
    letterSpacing: 1,
    fontFamily: "Helvetica-Bold",
  },
  footerSub: {
    color: "#cccccc",
    fontSize: 6.5,
    letterSpacing: 1,
    marginTop: 2,
  },
});

function formatCurrency(n: number) {
  return `Rs. ${Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// ---- Icons ----
function IconPin({ size = 12, color = "#ffffff" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2C7.6 2 4 5.6 4 10c0 6 8 12 8 12s8-6 8-12c0-4.4-3.6-8-8-8z"
        fill={color}
      />
      <Circle cx="12" cy="10" r="3" fill="#000000" />
    </Svg>
  );
}

function IconStore({ size = 12, color = "#ffffff" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M3 9l1.5-5h15L21 9" stroke={color} strokeWidth={1.6} fill="none" />
      <Path d="M4 9v11h16V9" stroke={color} strokeWidth={1.6} fill="none" />
      <Path d="M9 20v-6h6v6" stroke={color} strokeWidth={1.6} fill="none" />
    </Svg>
  );
}

function IconTruckSolid({ size = 14, color = "#ffffff" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x="2" y="7" width="12" height="8" fill={color} />
      <Path d="M14 10h4l3 3v2h-7v-5z" fill={color} />
      <Circle cx="6" cy="17" r="1.8" fill={color} />
      <Circle cx="17" cy="17" r="1.8" fill={color} />
    </Svg>
  );
}

function IconGlobe({ size = 9 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="9" stroke="#333333" strokeWidth={1.5} fill="none" />
      <Line x1="3" y1="12" x2="21" y2="12" stroke="#333333" strokeWidth={1.2} />
      <Path d="M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" stroke="#333333" strokeWidth={1.2} fill="none" />
    </Svg>
  );
}

function IconPhone({ size = 9 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M6 3h3l1.5 4-2 1.5a12 12 0 006 6l1.5-2 4 1.5v3c0 1.1-1 2-2.2 1.8C10.5 18 6 13.5 4.2 6.2 4 5 4.9 3 6 3z"
        fill="#333333"
      />
    </Svg>
  );
}

function IconFragile({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2v8M12 10c-3 0-5 2-5 5v5h10v-5c0-3-2-5-5-5z"
        stroke="#000000"
        strokeWidth={1.4}
        fill="none"
      />
      <Path d="M9 2h6M12 2l-1.5 4M12 2l1.5 4" stroke="#000000" strokeWidth={1.2} fill="none" />
    </Svg>
  );
}

function IconUmbrella({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M2 12a10 10 0 0120 0H2z"
        stroke="#000000"
        strokeWidth={1.4}
        fill="none"
      />
      <Line x1="12" y1="12" x2="12" y2="20" stroke="#000000" strokeWidth={1.4} />
      <Path d="M12 20c0 1-1 2-2 2" stroke="#000000" strokeWidth={1.4} fill="none" />
    </Svg>
  );
}

function IconArrowsUp({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Line x1="9" y1="21" x2="9" y2="6" stroke="#000000" strokeWidth={1.5} />
      <Line x1="15" y1="21" x2="15" y2="6" stroke="#000000" strokeWidth={1.5} />
      <Path d="M6 9l3-5 3 5M12 9l3-5 3 5" stroke="#000000" strokeWidth={1.5} fill="none" />
    </Svg>
  );
}

function IconBrokenGlass({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M7 3h10l-1.5 9a3.5 3.5 0 01-7 0L7 3z"
        stroke="#000000"
        strokeWidth={1.4}
        fill="none"
      />
      <Line x1="12" y1="15" x2="12" y2="21" stroke="#000000" strokeWidth={1.4} />
      <Line x1="8" y1="21" x2="16" y2="21" stroke="#000000" strokeWidth={1.4} />
    </Svg>
  );
}

function IconRupee({ size = 14 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Line x1="6" y1="5" x2="18" y2="5" stroke="#000000" strokeWidth={1.5} />
      <Line x1="6" y1="9" x2="18" y2="9" stroke="#000000" strokeWidth={1.5} />
      <Path d="M9 5c4 0 4 4 0 4H6l8 10" stroke="#000000" strokeWidth={1.5} fill="none" />
    </Svg>
  );
}

function IconHeart({ size = 10 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 21s-7-4.4-9.5-8.8C.7 8.6 2.6 5 6.2 5c2 0 3.4 1 4.8 2.7C12.4 6 13.8 5 15.8 5c3.6 0 5.5 3.6 3.7 7.2C19 16.6 12 21 12 21z"
        fill="#ffffff"
      />
    </Svg>
  );
}

interface ShippingLabelDocumentProps {
  order: any;
  qrDataUrl: string;
  logoDataUrl?: string;
  company: {
    name: string;
    tagline: string;
    website: string;
    phone: string;
    email: string;
    gstin: string;
    state: string;
    address?: {
      line1: string;
      line2: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
  };
}

export default function ShippingLabelDocument({
  order,
  qrDataUrl,
  logoDataUrl,
  company,
}: ShippingLabelDocumentProps) {
  const label = order.shippingLabel || {};
  const receiver = label.receiver || {};
  const dims = label.dimensions || {};
  const isPrepaid = order.payment?.method !== "cod";

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
              <Text style={styles.brandName}>{company.name.replace(" CO.", "")}</Text>
              <Text style={styles.brandTagline}>{company.tagline}</Text>

              <View style={styles.contactRow}>
                <View style={styles.contactItem}>
                  <IconGlobe />
                  <Text style={styles.contactText}>{company.website}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.labelBox}>
            <View style={styles.labelBoxTitleBar}>
              <Text style={styles.labelBoxTitleText}>SHIPMENT LABEL</Text>
            </View>
            <View style={styles.labelBoxBody}>
              <Text style={styles.labelBoxLabel}>ORDER ID</Text>
              <Text style={styles.labelBoxValue}>
                #{order.orderInfo?.orderNumber}
              </Text>
              <Text style={styles.labelBoxLabel}>DATE</Text>
              <Text style={[styles.labelBoxValue, { marginBottom: 0 }]}>
                {new Date(order.orderInfo?.orderDate).toLocaleDateString(
                  "en-IN",
                  { day: "2-digit", month: "long", year: "numeric" }
                )}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionDivider} />

        {/* Ship To / Courier Partner */}
        <View style={styles.twoColRow}>
          <View style={styles.colHalf}>
            <View style={styles.iconTagRow}>
              <View style={styles.iconSquare}>
                <IconPin />
              </View>
              <Text style={styles.tagBadgeText}>{""}</Text>
            </View>
            <View style={[styles.tagBadge, { marginTop: -30, marginLeft: 34 }]}>
              <Text style={styles.tagBadgeText}>SHIP TO:</Text>
            </View>
            <Text style={styles.boldName}>{receiver.name || order.customer?.name}</Text>
            <Text style={styles.bodyLine}>{receiver.phone || order.customer?.phone}</Text>
            <Text style={styles.bodyLine}>{receiver.address}</Text>
            <Text style={styles.bodyLine}>
              {receiver.city}, {receiver.state} - {receiver.pincode}
            </Text>
          </View>

          <View style={styles.colHalf}>
            <View style={styles.iconTagRow}>
              <View style={styles.iconSquare}>
                <IconTruckSolid />
              </View>
              <Text style={styles.bodyLine}>COURIER PARTNER</Text>
            </View>
            <Text style={styles.courierName}>{label.courierPartner || "To be assigned"}</Text>
            <Text style={styles.awbLabel}>AWB NO.</Text>
            <Text style={styles.awbValue}>{label.awbNumber || "Pending"}</Text>
            {label.awbNumber && (
              <PseudoBarcode value={label.awbNumber} width={220} height={36} />
            )}
          </View>
        </View>

        <View style={styles.sectionDivider} />

        {/* From / Package Details */}
        <View style={styles.twoColRow}>
          <View style={styles.colHalf}>
            <View style={styles.iconTagRow}>
              <View style={styles.iconSquare}>
                <IconStore />
              </View>
              <Text style={styles.bodyLine}>FROM:</Text>
            </View>
            <Text style={styles.boldName}>{company.name}</Text>
            <Text style={styles.bodyLine}>GSTIN : {company.gstin}</Text>
            <Text style={styles.bodyLine}>Phone : {company.phone}</Text>
            <Text style={styles.bodyLine}>Website : {company.website}</Text>
            <Text style={[styles.bodyLine, { marginTop: 4, fontFamily: "Helvetica-Bold" }]}>
              ADDRESS :
            </Text>
            {company.address?.line1 ? (
              <>
                <Text style={styles.bodyLine}>{company.address.line1}</Text>
                {company.address.line2 && (
                  <Text style={styles.bodyLine}>{company.address.line2}</Text>
                )}
                <Text style={styles.bodyLine}>
                  {company.address.city}, {company.address.state} - {company.address.pincode}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.addressDashLine}>
                  -----------------------------------------
                </Text>
                <Text style={styles.addressDashLine}>
                  -----------------------------------------
                </Text>
              </>
            )}
          </View>

          <View style={styles.colHalf}>
            <View style={styles.tagBadge}>
              <Text style={styles.tagBadgeText}>PACKAGE DETAILS</Text>
            </View>
            <View style={styles.packageDetailRow}>
              <Text style={styles.packageDetailLabel}>WEIGHT</Text>
              <Text style={styles.packageDetailValue}>
                {label.weight ? `${label.weight} KG` : "-"}
              </Text>
            </View>
            <View style={styles.packageDetailRow}>
              <Text style={styles.packageDetailLabel}>DIMENSIONS</Text>
              <Text style={styles.packageDetailValue}>
                {dims.length ? `${dims.length} x ${dims.width} x ${dims.height} CM` : "-"}
              </Text>
            </View>
            <View style={styles.packageDetailRow}>
              <Text style={styles.packageDetailLabel}>ITEMS</Text>
              <Text style={styles.packageDetailValue}>
                {(order.items || []).reduce((s: number, i: any) => s + i.quantity, 0)}
              </Text>
            </View>
            <View style={styles.packageDetailRow}>
              <Text style={styles.packageDetailLabel}>PACKAGE TYPE</Text>
              <Text style={styles.packageDetailValue}>
                {label.packageType || "Poly Mailer"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionDivider} />

        {/* Items in package */}
        <View style={styles.tagBadge}>
          <Text style={styles.tagBadgeText}>ITEM(S) IN PACKAGE</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.th, styles.colProduct]}>PRODUCT NAME</Text>
            <Text style={[styles.th, styles.colSku]}>SKU</Text>
            <Text style={[styles.th, styles.colQty]}>QTY</Text>
            <Text style={[styles.th, styles.colSize]}>SIZE</Text>
            <Text style={[styles.th, styles.colColor]}>COLOR</Text>
          </View>

          {(order.items || []).map((item: any, i: number) => (
            <View style={styles.tableRow} key={i}>
              <Text style={[styles.td, styles.colProduct]}>{item.name}</Text>
              <Text style={[styles.td, styles.colSku]}>{item.sku || "-"}</Text>
              <Text style={[styles.td, styles.colQty]}>{item.quantity}</Text>
              <Text style={[styles.td, styles.colSize]}>{item.size || "-"}</Text>
              <Text style={[styles.td, styles.colColor]}>{item.color || "-"}</Text>
            </View>
          ))}
        </View>

        {/* Handle with care */}
        <View style={{ marginTop: 14 }}>
          <View style={styles.tagBadge}>
            <Text style={styles.tagBadgeText}>HANDLE WITH CARE</Text>
          </View>
          <View style={styles.careRow}>
            <View style={styles.careItem}>
              <IconFragile />
              <Text style={styles.careLabel}>FRAGILE</Text>
            </View>
            <View style={styles.careItem}>
              <IconUmbrella />
              <Text style={styles.careLabel}>KEEP DRY</Text>
            </View>
            <View style={styles.careItem}>
              <IconArrowsUp />
              <Text style={styles.careLabel}>THIS SIDE UP</Text>
            </View>
            <View style={styles.careItem}>
              <IconBrokenGlass />
              <Text style={styles.careLabel}>DO NOT DROP</Text>
            </View>
          </View>
        </View>

        {/* Track your order */}
        <View style={{ marginTop: 14 }}>
          <View style={styles.tagBadge}>
            <Text style={styles.tagBadgeText}>TRACK YOUR ORDER</Text>
          </View>
          <View style={styles.trackRow}>
            <View style={styles.trackQrCol}>
              {qrDataUrl && <Image src={qrDataUrl} style={{ width: 60, height: 60 }} />}
            </View>

            <View style={styles.trackTextCol}>
              <Text style={styles.trackTitle}>SCAN TO TRACK</Text>
              <Text style={styles.trackTitle}>YOUR ORDER</Text>
              <Text style={styles.trackSub}>Tracking ID</Text>
              <Text style={styles.trackValue}>{label.trackingId || "Pending"}</Text>
            </View>

            <View style={styles.trackBarcodeCol}>
              {label.trackingId && (
                <PseudoBarcode value={label.trackingId} width={220} height={34} />
              )}
              <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", marginTop: 4 }}>
                {label.trackingId}
              </Text>
            </View>
          </View>
        </View>

        {/* COD / Payment amount */}
        <View style={styles.codRow}>
          <View style={styles.codLeft}>
            <View style={styles.rupeeCircle}>
              <IconRupee />
            </View>
            <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold" }}>
              {isPrepaid ? "PREPAID" : "COD AMOUNT"}
            </Text>
          </View>

          <View style={styles.codAmountBox}>
            <Text style={styles.codAmountValue}>
              {formatCurrency(order.pricing?.grandTotal)}
            </Text>
            <Text style={styles.codAmountSub}>
              ({isPrepaid ? "PREPAID" : "CASH ON DELIVERY"})
            </Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>
                {isPrepaid ? (order.payment?.status || "").toUpperCase() : "PENDING"}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <IconHeart />
          <View style={{ alignItems: "center" }}>
            <Text style={styles.footerText}>THANK YOU FOR CHOOSING ZEROARC</Text>
            <Text style={styles.footerSub}>{company.tagline}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}