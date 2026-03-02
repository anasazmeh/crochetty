import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, user } from "@/lib/db/schema";
import { getPayment } from "@/lib/mollie";
import { eq } from "drizzle-orm";

// Mollie sends webhook as form-encoded POST
export async function POST(request: NextRequest) {
  const body = await request.formData();
  const paymentId = body.get("id") as string | null;

  if (!paymentId) {
    return NextResponse.json({ error: "No payment ID" }, { status: 400 });
  }

  const payment = await getPayment(paymentId);
  const orderId = payment.metadata?.orderId;
  if (!orderId) return NextResponse.json({ ok: true });

  const statusMap: Record<string, "paid" | "cancelled"> = {
    paid: "paid",
    failed: "cancelled",
    canceled: "cancelled",
    expired: "cancelled",
  };

  const newStatus = statusMap[payment.status];
  if (!newStatus) return NextResponse.json({ ok: true });

  const [updatedOrder] = await db
    .update(orders)
    .set({ status: newStatus })
    .where(eq(orders.id, orderId))
    .returning();

  if (newStatus === "paid" && updatedOrder) {
    let email: string | null = updatedOrder.guestEmail;
    if (!email && updatedOrder.userId) {
      const userRecord = await db
        .select({ email: user.email })
        .from(user)
        .where(eq(user.id, updatedOrder.userId))
        .limit(1);
      email = userRecord[0]?.email ?? null;
    }
    if (email) {
      // Import lazily to avoid circular dep
      const { sendOrderConfirmation } = await import("@/lib/email");
      await sendOrderConfirmation(email, updatedOrder);
    }
  }

  return NextResponse.json({ ok: true });
}
