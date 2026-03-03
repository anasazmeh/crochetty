import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { customOrders } from "@/lib/db/schema";
import { sendCustomOrderNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, description, budget } = body;

  if (!name || !email || !description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const [order] = await db
    .insert(customOrders)
    .values({ name, email, description, budget })
    .returning();

  await sendCustomOrderNotification({ name, email, description });

  return NextResponse.json({ id: order.id }, { status: 201 });
}
