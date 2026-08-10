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
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
        <h2 style="color: #111; margin-bottom: 8px;">Reset your password</h2>
        <p style="color: #444; font-size: 14px; line-height: 1.6;">
          We received a request to reset the password for your ZeroArc account.
          Click the button below to choose a new password. This link expires in
          1 hour.
        </p>
        
          href="${resetUrl}"
          style="display: inline-block; margin: 24px 0; padding: 14px 28px; background: #7c3aed; color: #fff; text-decoration: none; font-weight: 600; border-radius: 8px; font-size: 14px;"
        >
          Reset Password
        </a>
        <p style="color: #888; font-size: 12px; line-height: 1.6;">
          If you didn't request this, you can safely ignore this email — your
          password will stay the same. This link will expire in 1 hour.
        </p>
        <p style="color: #aaa; font-size: 11px; margin-top: 24px;">
          ZeroArc Co.
        </p>
      </div>
    `,
  });
}