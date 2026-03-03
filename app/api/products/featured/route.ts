import { NextResponse } from "next/server";
import { getFeaturedProducts } from "@/lib/products";

export async function GET() {
  try {
    const products = await getFeaturedProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Featured products error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
