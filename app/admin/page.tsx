export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { orders, products, customOrders } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";

export const metadata = { title: "Admin — Crochetty" };

export default async function AdminDashboard() {
  const [productCount] = await db.select({ count: count() }).from(products);
  const [orderCount] = await db.select({ count: count() }).from(orders);
  const [pendingCustom] = await db
    .select({ count: count() })
    .from(customOrders)
    .where(eq(customOrders.status, "new"));

  const stats = [
    { label: "Total Products", value: productCount.count },
    { label: "Total Orders", value: orderCount.count },
    { label: "Pending Custom Requests", value: pendingCustom.count },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-primary mb-8">Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-6 shadow-sm border border-border"
          >
            <p className="text-muted-foreground text-sm mb-2">{stat.label}</p>
            <p className="text-4xl font-bold text-primary">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
