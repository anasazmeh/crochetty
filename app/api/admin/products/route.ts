import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function requireAdmin(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function GET() {
  // Public read for admin purposes (protected by middleware for /admin routes)
  const all = await db.select().from(products);
  return NextResponse.json(all);
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const { name, slug, description, price, stock, featured, published, images } = body;

    if (!name || !slug || !price) {
      return NextResponse.json(
        { error: "name, slug, and price are required" },
        { status: 400 }
      );
    }

    const [product] = await db
      .insert(products)
      .values({ name, slug, description, price, stock: stock ?? 0, featured: featured ?? false, published: published ?? false, images: images ?? [] })
      .returning();

    return NextResponse.json(product, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    const status = msg === "Unauthorized" ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
