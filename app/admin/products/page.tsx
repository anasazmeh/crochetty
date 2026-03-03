export const dynamic = "force-dynamic";

import Link from "next/link";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Products — Admin" };

export default async function AdminProductsPage() {
  const allProducts = await db
    .select()
    .from(products)
    .orderBy(desc(products.createdAt));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-primary">Products</h1>
        <Button asChild className="bg-primary hover:bg-primary-light text-white rounded-full">
          <Link href="/admin/products/new">+ New Product</Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Price</th>
              <th className="text-left px-4 py-3 font-medium">Stock</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {allProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No products yet.{" "}
                  <Link href="/admin/products/new" className="text-primary hover:underline">
                    Add your first product.
                  </Link>
                </td>
              </tr>
            ) : (
              allProducts.map((p) => (
                <tr key={p.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">€{Number(p.price).toFixed(2)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.stock}</td>
                  <td className="px-4 py-3">
                    <Badge
                      className={p.published
                        ? "bg-primary/10 text-primary border-0"
                        : "bg-muted text-muted-foreground border-0"
                      }
                    >
                      {p.published ? "Live" : "Draft"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-primary hover:underline text-xs font-medium"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
