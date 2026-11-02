import { Resend } from "resend";
 
type OrderEmailItem = {
  title: string;
  price: number;
  size: string | null;
  quantity: number;
};
 
type OrderEmail = {
  orderId: string;
  name: string;
  email: string;
  items: OrderEmailItem[];
  total: number;
};
 
// keeps customer input from breaking the email html
function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
 
export async function sendOrderConfirmation(order: OrderEmail) {
  // created here instead of at the top so a missing key doesn't break the build
  const resend = new Resend(process.env.RESEND_API_KEY);
 
  const rows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;">${escapeHtml(item.title)}${item.size ? ` (Size: ${escapeHtml(item.size)})` : ""} x${item.quantity}</td>
          <td style="padding:8px 0; text-align:right;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join("");
 
  const html = `
    <div style="font-family:Arial,sans-serif; max-width:500px; margin:auto;">
      <h2>Thanks for your order, ${escapeHtml(order.name)}!</h2>
      <p>Your order has been placed. Here's what you got:</p>
      <table style="width:100%; border-collapse:collapse;">
        ${rows}
        <tr style="border-top:1px solid #ddd;">
          <td style="padding:8px 0;"><strong>Total</strong></td>
          <td style="padding:8px 0; text-align:right;"><strong>$${order.total.toFixed(2)}</strong></td>
        </tr>
      </table>
      <p style="color:#666; font-size:12px;">Order #${order.orderId}</p>
      <p>- Kaizen Cutz</p>
    </div>`;
 
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "Kaizen Cutz <onboarding@resend.dev>",
    to: order.email,
    subject: "Your Kaizen Cutz order confirmation",
    html,
  });
 
  if (error) {
    throw new Error(error.message);
  }
}
 
export async function sendPasswordResetEmail(to: string, name: string, link: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const html = `
    <div style="font-family:Arial,sans-serif; max-width:500px; margin:auto;">
      <h2>Reset your password</h2>
      <p>Hi ${escapeHtml(name)},</p>
      <p>Someone asked to reset the password for your Kaizen Cutz account. Click the link below to pick a new one.</p>
      <p><a href="${link}" style="display:inline-block; padding:10px 16px; background:#2563eb; color:#fff; text-decoration:none; border-radius:6px;">Reset password</a></p>
      <p style="color:#666; font-size:12px;">This link expires in 1 hour. If you didn't ask for this you can ignore this email.</p>
      <p>- Kaizen Cutz</p>
    </div>`;

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "Kaizen Cutz <onboarding@resend.dev>",
    to,
    subject: "Reset your Kaizen Cutz password",
    html,
  });

  if (error) {
    throw new Error(error.message);
  }
}
