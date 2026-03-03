import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

const adminNav = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Custom Orders", href: "/admin/custom-orders" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-muted flex">
      <aside className="w-64 bg-primary text-white flex flex-col p-6 gap-1 fixed inset-y-0 left-0 z-10">
        <p className="font-serif text-xl mb-8 text-white/90">Crochetty Admin</p>
        {adminNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-4 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium text-white/80 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </aside>
      <main className="ml-64 flex-1 p-8 min-h-screen">{children}</main>
    </div>
  );
}
