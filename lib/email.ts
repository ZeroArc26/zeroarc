import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string
) {
  await resend.emails.send({
    from: "ZeroArc <support@zeroarc.in>",
    to,
    subject: "Reset your ZeroArc password",
    html: `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background-color:#f4f4f5; font-family: 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding: 40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px; width:100%; background-color:#ffffff; border-radius:20px; overflow:hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">

            <!-- Header -->
            <tr>
              <td style="background-color:#ffffff; padding: 32px 40px; text-align:center; border-bottom:1px solid #f0f0f2;">
                <img src="https://zeroarc.in/images/logo/zeroarc-logo1.png" alt="ZeroArc" width="130" style="display:block; margin:0 auto; height:auto;" />
              </td>
            </tr>

            <!-- Accent bar -->
            <tr>
              <td style="height:4px; background:linear-gradient(90deg, #7c3aed, #a855f7, #d946ef);"></td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 40px;">
                <p style="margin:0 0 6px; font-size:12px; font-weight:700; letter-spacing:0.14em; color:#7c3aed; text-transform:uppercase;">
                  Account Security
                </p>

                <h1 style="margin:0 0 16px; font-size:24px; font-weight:800; color:#0a0a0a; line-height:1.3;">
                  Reset your password
                </h1>

                <p style="margin:0 0 28px; font-size:14px; line-height:1.7; color:#52525b;">
                  We received a request to reset the password for your ZeroArc
                  account. Click the button below to choose a new one — this
                  link is valid for the next <strong>1 hour</strong>.
                </p>

                <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 0 28px;">
                  <tr>
                    <td style="border-radius:12px; background-color:#7c3aed;">
                      <a href="${resetUrl}" style="display:inline-block; padding:15px 36px; font-size:14px; font-weight:700; color:#ffffff; text-decoration:none; letter-spacing:0.03em;">Reset Password</a>
                    </td>
                  </tr>
                </table>

                <p style="margin:0 0 4px; font-size:12px; color:#a1a1aa;">
                  Or copy and paste this link into your browser:
                </p>
                <p style="margin:0 0 28px; font-size:12px; color:#7c3aed; word-break:break-all;">
                  ${resetUrl}
                </p>

                <div style="height:1px; background-color:#f0f0f2; margin: 0 0 24px;"></div>

                <p style="margin:0; font-size:12px; line-height:1.7; color:#a1a1aa;">
                  Didn't request this? No action needed — your password will
                  stay exactly as it is, and this link will simply expire.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color:#fafafa; padding: 24px 40px; text-align:center; border-top:1px solid #f0f0f2;">
                <p style="margin:0 0 4px; font-size:11px; font-weight:700; letter-spacing:0.1em; color:#0a0a0a; text-transform:uppercase;">
                  ZeroArc Co.
                </p>
                <p style="margin:0; font-size:11px; color:#a1a1aa;">
                  Premium Anime Streetwear &nbsp;•&nbsp;
                  <a href="https://zeroarc.in" style="color:#a1a1aa; text-decoration:underline;">zeroarc.in</a>
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `,
  });
}
export async function sendContactFormEmail({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  const subjectLabels: Record<string, string> = {
    order: "Order Support",
    returns: "Returns & Exchanges",
    general: "General Inquiry",
    partnership: "Partnership",
  };

  const subjectLabel = subject ? subjectLabels[subject] || subject : "General Inquiry";

  await resend.emails.send({
    from: "ZeroArc Website <support@zeroarc.in>",
    to: "support@zeroarc.in",
    replyTo: email,
    subject: `[Contact Form] ${subjectLabel} — ${name}`,
    html: `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background-color:#f4f4f5; font-family: 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding: 40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px; width:100%; background-color:#ffffff; border-radius:20px; overflow:hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">

            <tr>
              <td style="background-color:#ffffff; padding: 32px 40px; text-align:center; border-bottom:1px solid #f0f0f2;">
                <img src="https://zeroarc.in/images/logo/zeroarc-logo1.png" alt="ZeroArc" width="130" style="display:block; margin:0 auto; height:auto;" />
              </td>
            </tr>

            <tr>
              <td style="height:4px; background:linear-gradient(90deg, #7c3aed, #a855f7, #d946ef);"></td>
            </tr>

            <tr>
              <td style="padding: 40px;">
                <p style="margin:0 0 6px; font-size:12px; font-weight:700; letter-spacing:0.14em; color:#7c3aed; text-transform:uppercase;">
                  New Contact Form Submission
                </p>

                <h1 style="margin:0 0 20px; font-size:22px; font-weight:800; color:#0a0a0a; line-height:1.3;">
                  ${subjectLabel}
                </h1>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 24px;">
                  <tr>
                    <td style="padding: 4px 0; font-size:12px; color:#a1a1aa; width: 90px;">Name</td>
                    <td style="padding: 4px 0; font-size:14px; color:#0a0a0a; font-weight:600;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; font-size:12px; color:#a1a1aa;">Email</td>
                    <td style="padding: 4px 0; font-size:14px; color:#7c3aed;">${email}</td>
                  </tr>
                </table>

                <div style="height:1px; background-color:#f0f0f2; margin: 0 0 20px;"></div>

                <p style="margin:0 0 8px; font-size:12px; font-weight:700; letter-spacing:0.1em; color:#0a0a0a; text-transform:uppercase;">
                  Message
                </p>
                <p style="margin:0; font-size:14px; line-height:1.7; color:#3f3f46; white-space:pre-wrap;">${message}</p>
              </td>
            </tr>

            <tr>
              <td style="background-color:#fafafa; padding: 20px 40px; text-align:center; border-top:1px solid #f0f0f2;">
                <p style="margin:0; font-size:11px; color:#a1a1aa;">
                  Reply directly to this email to respond to ${name}.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `,
  });
}

interface OrderConfirmationItem {
  name: string;
  image?: string;
  color?: string;
  size?: string;
  quantity: number;
  totalAmount: number;
}

interface OrderConfirmationInput {
  to: string;
  customerName: string;
  orderNumber: string;
  orderId: string;
  items: OrderConfirmationItem[];
  subtotal: number;
  shippingCharge?: number;
  grandTotal: number;
  shippingAddress: {
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  paymentMethod?: string;
}

export async function sendOrderConfirmationEmail(input: OrderConfirmationInput) {
  const {
    to,
    customerName,
    orderNumber,
    orderId,
    items,
    subtotal,
    shippingCharge = 0,
    grandTotal,
    shippingAddress,
    paymentMethod,
  } = input;

  if (!to) return; // guest checkout without an email — nothing to send

  const firstName = customerName.split(" ")[0];

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="border: 1px solid #f0f0f2; border-radius:14px; padding: 14px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="56" style="padding-right: 14px;">
                ${
                  item.image
                    ? `<img src="${item.image}" width="56" height="56" style="border-radius: 12px; object-fit: cover; display: block;" />`
                    : `<div style="width:56px;height:56px;border-radius:12px;background:#18181b;"></div>`
                }
              </td>
              <td>
                <p style="margin:0; font-size:14px; font-weight:700; color:#0a0a0a;">${item.name}</p>
                <p style="margin:3px 0 0; font-size:12px; color:#a1a1aa;">
                  ${[item.color, item.size].filter(Boolean).join(" · ")} · Qty ${item.quantity}
                </p>
              </td>
              <td align="right" style="font-size: 14px; font-weight:700; color:#0a0a0a; white-space:nowrap;">
                ₹${item.totalAmount}
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr><td style="height:10px;"></td></tr>`
    )
    .join("");

  const addressLine = [
    shippingAddress.address,
    shippingAddress.city,
    shippingAddress.state,
    shippingAddress.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  await resend.emails.send({
    from: "ZeroArc <support@zeroarc.in>",
    to,
    subject: `Order Confirmed — #${orderNumber}`,
    html: `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background-color:#f4f4f5; font-family: 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding: 32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="580" cellpadding="0" cellspacing="0" style="max-width:580px; width:100%; background-color:#ffffff; border-radius:24px; overflow:hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.08);">

            <!-- Hero banner -->
            <tr>
              <td style="background: linear-gradient(135deg, #0a0a0a 0%, #18181b 100%); padding: 44px 40px 40px; text-align:center;">
                <div style="font-size: 26px; font-weight: 900; letter-spacing: -0.02em; color: #ffffff; margin-bottom: 4px;">
                  ZERO<span style="color:#a855f7;">ARC</span>
                </div>
                <p style="margin:0 0 28px; font-size:10px; font-weight:700; letter-spacing:0.2em; color:#71717a; text-transform:uppercase;">
                  Wear Your Next Arc
                </p>

                <div style="display:inline-block; width:64px; height:64px; line-height:64px; border-radius:50%; background: linear-gradient(135deg, #7c3aed, #d946ef); font-size:28px; color:#ffffff; margin-bottom: 16px;">
                  ✓
                </div>

                <h1 style="margin:0 0 6px; font-size:24px; font-weight:800; color:#ffffff;">
                  Order Confirmed!
                </h1>
                <p style="margin:0; font-size:14px; color:#a1a1aa;">
                  Thanks, ${firstName} — we're on it.
                </p>
              </td>
            </tr>

            <!-- Order progress tracker -->
            <tr>
              <td style="padding: 32px 40px 24px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="25%" align="center">
                      <div style="width:32px; height:32px; line-height:32px; border-radius:50%; background:#7c3aed; color:#ffffff; font-size:14px; font-weight:700; margin: 0 auto;">1</div>
                      <p style="margin:8px 0 0; font-size:10px; font-weight:700; color:#7c3aed; text-transform:uppercase;">Confirmed</p>
                    </td>
                    <td width="25%" align="center">
                      <div style="width:32px; height:32px; line-height:32px; border-radius:50%; background:#e4e4e7; color:#a1a1aa; font-size:14px; font-weight:700; margin: 0 auto;">2</div>
                      <p style="margin:8px 0 0; font-size:10px; font-weight:700; color:#a1a1aa; text-transform:uppercase;">Packed</p>
                    </td>
                    <td width="25%" align="center">
                      <div style="width:32px; height:32px; line-height:32px; border-radius:50%; background:#e4e4e7; color:#a1a1aa; font-size:14px; font-weight:700; margin: 0 auto;">3</div>
                      <p style="margin:8px 0 0; font-size:10px; font-weight:700; color:#a1a1aa; text-transform:uppercase;">Shipped</p>
                    </td>
                    <td width="25%" align="center">
                      <div style="width:32px; height:32px; line-height:32px; border-radius:50%; background:#e4e4e7; color:#a1a1aa; font-size:14px; font-weight:700; margin: 0 auto;">4</div>
                      <p style="margin:8px 0 0; font-size:10px; font-weight:700; color:#a1a1aa; text-transform:uppercase;">Delivered</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Order number pill -->
            <tr>
              <td style="padding: 0 40px 24px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf5ff; border-radius:14px; border: 1px solid #ede9fe;">
                  <tr>
                    <td style="padding: 16px 20px;">
                      <p style="margin:0; font-size:10px; font-weight:700; letter-spacing:0.1em; color:#7c3aed; text-transform:uppercase;">Order Number</p>
                      <p style="margin:2px 0 0; font-size:16px; font-weight:800; color:#0a0a0a;">#${orderNumber}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Items -->
            <tr>
              <td style="padding: 0 40px;">
                <p style="margin:0 0 14px; font-size:11px; font-weight:700; letter-spacing:0.1em; color:#71717a; text-transform:uppercase;">In Your Box</p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 10px;">
                  ${itemsHtml}
                </table>

                <!-- Totals -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fafafa; border-radius:14px; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 16px 20px 4px; font-size:13px; color:#71717a;">Subtotal</td>
                    <td style="padding: 16px 20px 4px; font-size:13px; color:#0a0a0a; text-align:right;">₹${subtotal}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 20px; font-size:13px; color:#71717a;">Shipping</td>
                    <td style="padding: 4px 20px; font-size:13px; color:${shippingCharge > 0 ? "#0a0a0a" : "#16a34a"}; text-align:right; font-weight:${shippingCharge > 0 ? "400" : "600"};">
                      ${shippingCharge > 0 ? `₹${shippingCharge}` : "FREE"}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 20px 16px; font-size:15px; font-weight:800; color:#0a0a0a; border-top:1px solid #e4e4e7;">Total</td>
                    <td style="padding: 12px 20px 16px; font-size:17px; font-weight:900; color:#7c3aed; text-align:right; border-top:1px solid #e4e4e7;">₹${grandTotal}</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Icon info blocks -->
            <tr>
              <td style="padding: 0 40px 28px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="50%" style="padding-right: 8px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #f0f0f2; border-radius:14px;">
                        <tr>
                          <td style="padding: 16px;">
                            <div style="width:32px;height:32px;line-height:32px;border-radius:9px;background:#f4f4f5;text-align:center;font-size:15px;margin-bottom:8px;">📍</div>
                            <p style="margin:0 0 2px; font-size:10px; font-weight:700; letter-spacing:0.06em; color:#a1a1aa; text-transform:uppercase;">Shipping To</p>
                            <p style="margin:0; font-size:12px; line-height:1.5; color:#3f3f46;">${addressLine}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td width="50%" style="padding-left: 8px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #f0f0f2; border-radius:14px;">
                        <tr>
                          <td style="padding: 16px;">
                            <div style="width:32px;height:32px;line-height:32px;border-radius:9px;background:#f4f4f5;text-align:center;font-size:15px;margin-bottom:8px;">💳</div>
                            <p style="margin:0 0 2px; font-size:10px; font-weight:700; letter-spacing:0.06em; color:#a1a1aa; text-transform:uppercase;">Payment</p>
                            <p style="margin:0; font-size:12px; line-height:1.5; color:#3f3f46;">${paymentMethod ? paymentMethod.toUpperCase() : "—"}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- CTA -->
            <tr>
              <td style="padding: 0 40px 36px; text-align:center;">
                <a href="https://zeroarc.in/account/orders/${orderId}" style="display:block; background: linear-gradient(135deg, #7c3aed, #a855f7); color:#ffffff; text-decoration:none; font-size:14px; font-weight:800; padding: 16px; border-radius: 14px; letter-spacing:0.02em;">
                  TRACK YOUR ORDER →
                </a>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color:#0a0a0a; padding: 28px 40px; text-align:center;">
                <p style="margin:0 0 14px; font-size:11px; color:#71717a;">
                  Questions? Reply here or message us on WhatsApp.
                </p>
                <p style="margin:0 0 4px; font-size:12px; font-weight:700; color:#ffffff;">@zeroarc.wear</p>
                <p style="margin:0; font-size:10px; color:#52525b;">www.zeroarc.in</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `,
  });
}
