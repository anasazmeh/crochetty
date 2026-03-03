import { Resend } from "resend";
import type { Order } from "@/lib/db/schema";

const FROM = "Crochetty <orders@crochetty.com>";
const ADMIN_EMAIL = "hello@crochetty.com";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendOrderConfirmation(email: string, order: Order) {
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `Your Crochetty order is confirmed 🧶`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;">
        <h1 style="color:#1B5C32;font-size:28px;margin-bottom:8px;">Order Confirmed</h1>
        <p style="color:#6B6456;margin-bottom:24px;">
          Thank you for your order. We'll begin crafting your pieces with love and intention.
        </p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #DDD5C4;color:#6B6456;">Order ID</td>
            <td style="padding:8px 0;border-bottom:1px solid #DDD5C4;font-weight:bold;text-align:right;">${order.id.slice(0, 8).toUpperCase()}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6B6456;">Total</td>
            <td style="padding:8px 0;font-weight:bold;text-align:right;color:#1B5C32;">€${Number(order.total).toFixed(2)}</td>
          </tr>
        </table>
        <p style="color:#6B6456;font-size:14px;">We'll notify you when your order ships.</p>
        <hr style="border:none;border-top:1px solid #DDD5C4;margin:24px 0;" />
        <p style="color:#9CA896;font-size:12px;">Crochetty — Slow Luxury, Handcrafted</p>
      </div>
    `,
  });
}

export async function sendCustomOrderNotification(data: {
  name: string;
  email: string;
  description: string;
  budget?: string;
}) {
  // Notify admin
  await getResend().emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `New custom order request from ${data.name}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;">
        <h2 style="color:#1B5C32;">New Custom Order Request</h2>
        <p><strong>From:</strong> ${data.name} (${data.email})</p>
        ${data.budget ? `<p><strong>Budget:</strong> ${data.budget}</p>` : ""}
        <p><strong>Description:</strong></p>
        <p style="background:#F7F5F1;padding:16px;border-left:4px solid #1B5C32;">${data.description}</p>
      </div>
    `,
  });

  // Confirm to customer
  await getResend().emails.send({
    from: FROM,
    to: data.email,
    subject: "We received your custom order request 🧶",
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;">
        <h1 style="color:#1B5C32;font-size:28px;">Request Received</h1>
        <p>Hi ${data.name}, thank you for your custom order request.</p>
        <p style="color:#6B6456;">
          We'll review your request and get back to you within 2–3 business days.
        </p>
        <hr style="border:none;border-top:1px solid #DDD5C4;margin:24px 0;" />
        <p style="color:#9CA896;font-size:12px;">Crochetty — Slow Luxury, Handcrafted</p>
      </div>
    `,
  });
}
