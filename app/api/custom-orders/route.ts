import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { customOrders } from "@/lib/db/schema";
import { sendCustomOrderNotification } from "@/lib/email";

interface CustomOrderBody {
  name: string;
  email: string;
  description: string;
  budget?: string;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as CustomOrderBody;
  const { name, email, description, budget } = body;

  if (!name || !email || !description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  if (name.length > 200 || email.length > 254 || description.length > 5000 || (budget && budget.length > 100)) {
    return NextResponse.json({ error: "Field too long" }, { status: 400 });
  }

  try {
    const [order] = await db.insert(customOrders).values({ name, email, description, budget }).returning();
    if (!order) {
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
    await sendCustomOrderNotification({ name, email, description });
    return NextResponse.json({ id: order.id }, { status: 201 });
  } catch (e: unknown) {
    console.error("Custom order error:", e);
    const msg = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
