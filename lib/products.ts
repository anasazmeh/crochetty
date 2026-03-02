import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import type { Product } from "@/lib/db/schema";

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return db
    .select()
    .from(products)
    .where(and(eq(products.featured, true), eq(products.published, true)))
    .orderBy(desc(products.createdAt))
    .limit(limit);
}

export async function getProducts(): Promise<Product[]> {
  return db
    .select()
    .from(products)
    .where(eq(products.published, true))
    .orderBy(desc(products.createdAt));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const result = await db
    .select()
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.published, true)))
    .limit(1);
  return result[0] ?? null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const result = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  return result[0] ?? null;
}
