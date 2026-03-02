import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { orders, orderItems, products } from "@/lib/db/schema";
import { createPayment } from "@/lib/mollie";
import { eq, inArray } from "drizzle-orm";

interface CartItemPayload {
  id: string;
  quantity: number;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    const body = await request.json();
    const { items, shippingAddress, guestEmail } = body as {
      items: CartItemPayload[];
      shippingAddress?: unknown;
      guestEmail?: string;
    };

    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!session && !guestEmail) {
      return NextResponse.json(
        { error: "Guest email required for checkout without account" },
        { status: 400 }
      );
    }

    // Fetch and validate prices server-side (never trust client)
    const productIds = items.map((i) => i.id);
    const dbProducts = await db
      .select()
      .from(products)
      .where(inArray(products.id, productIds));

    const validatedItems = items.map((item) => {
      const dbProduct = dbProducts.find((p) => p.id === item.id);
      if (!dbProduct || !dbProduct.published) {
        throw new Error(`Product ${item.id} not found or unavailable`);
      }
      return {
        id: item.id,
        quantity: item.quantity,
        price: Number(dbProduct.price),
        name: dbProduct.name,
      };
    });

    const total = validatedItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    // Create order in DB
    const [order] = await db
      .insert(orders)
      .values({
        userId: session?.user.id ?? null,
        guestEmail: session ? null : (guestEmail ?? null),
        status: "pending",
        total: total.toFixed(2),
        shippingAddress: shippingAddress ?? null,
      })
      .returning();

    await db.insert(orderItems).values(
      validatedItems.map((i) => ({
        orderId: order.id,
        productId: i.id,
        quantity: i.quantity,
        priceAtPurchase: i.price.toFixed(2),
      }))
    );

    // Create Mollie payment
    const payment = await createPayment({
      amount: total,
      description: `Crochetty Order #${order.id.slice(0, 8).toUpperCase()}`,
      orderId: order.id,
      redirectUrl: `${appUrl}/checkout/success?orderId=${order.id}`,
      webhookUrl: `${appUrl}/api/webhooks/mollie`,
    });

    // Save Mollie IDs
    await db
      .update(orders)
      .set({
        molliePaymentId: payment.id,
        mollieCheckoutUrl: payment._links.checkout.href,
      })
      .where(eq(orders.id, order.id));

    return NextResponse.json({ checkoutUrl: payment._links.checkout.href });
  } catch (err) {
    console.error("Checkout error:", err);
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
