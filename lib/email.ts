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