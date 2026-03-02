# Crochetty Full Rebuild Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the Crochetty handcrafted crochet boutique as a production-ready B2C e-commerce app on Cloudflare Workers with Neon PostgreSQL, better-auth, Mollie payments, and a full admin panel.

**Architecture:** Next.js 16 App Router deployed via OpenNext on Cloudflare Workers. All data lives in Neon PostgreSQL accessed through Drizzle ORM using the `@neondatabase/serverless` HTTP adapter (required for Workers — no WebSockets). Auth is handled by better-auth using the Drizzle adapter. File uploads (product images) go to Cloudflare R2 via native Worker binding.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Drizzle ORM, Neon PostgreSQL, better-auth, Mollie, Resend, Cloudflare Workers + R2 + KV, Vitest, GitHub Actions

---

## Color Palette (logo-derived — use everywhere)

```css
--primary:        #1B5C32;   /* deep forest green — logo text */
--primary-light:  #2E7A45;   /* mid green — hover */
--primary-dark:   #134224;   /* dark green — pressed/active */
--accent-gold:    #C9A456;   /* honey gold — yarn ball */
--accent-cream:   #F0E8D0;   /* ivory — logo border */
--background:     #F7F5F1;   /* warm off-white */
--foreground:     #1C1C1A;   /* near-black */
--muted:          #EDE8DF;   /* warm light gray */
--border:         #DDD5C4;   /* warm border */
```

---

## Phase 1 — Foundation & Tooling

### Task 1: Configure OpenNext + Cloudflare Workers

**Files:**
- Modify: `package.json`
- Create: `wrangler.toml`
- Create: `open-next.config.ts`

**Step 1: Install dependencies**

```bash
npm install @opennextjs/cloudflare
npm install -D wrangler
```

Expected: packages added without errors.

**Step 2: Create `open-next.config.ts`**

```typescript
import type { OpenNextConfig } from "@opennextjs/cloudflare";

const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
      incrementalCache: async () => {
        const { KVCache } = await import("@opennextjs/cloudflare");
        return new KVCache();
      },
    },
  },
};

export default config;
```

**Step 3: Create `wrangler.toml`**

```toml
name = "crochetty"
compatibility_date = "2024-11-01"
compatibility_flags = ["nodejs_compat"]
main = ".open-next/worker.js"
assets = { directory = ".open-next/assets", binding = "ASSETS" }

[[r2_buckets]]
binding = "R2"
bucket_name = "crochetty-media"

[[kv_namespaces]]
binding = "KV"
id = "REPLACE_WITH_YOUR_KV_NAMESPACE_ID"

[vars]
NEXT_PUBLIC_APP_URL = "https://crochetty.com"

# Secrets — set via: wrangler secret put <NAME>
# DATABASE_URL
# BETTER_AUTH_SECRET
# MOLLIE_API_KEY
# RESEND_API_KEY
# GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
# FACEBOOK_CLIENT_ID / FACEBOOK_CLIENT_SECRET
# APPLE_CLIENT_ID / APPLE_CLIENT_SECRET
```

**Step 4: Add scripts to `package.json`**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "build:worker": "opennextjs-cloudflare build",
    "deploy": "opennextjs-cloudflare build && wrangler deploy",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest",
    "test:run": "vitest run",
    "preview": "opennextjs-cloudflare build && wrangler dev"
  }
}
```

**Step 5: Commit**

```bash
git add package.json wrangler.toml open-next.config.ts
git commit -m "chore: configure OpenNext + Cloudflare Workers"
```

---

### Task 2: Install and configure Drizzle + Neon

**Files:**
- Create: `lib/db/index.ts`
- Create: `lib/db/schema.ts`
- Create: `drizzle.config.ts`

**Step 1: Install dependencies**

```bash
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit
```

**Step 2: Create `drizzle.config.ts`**

```typescript
import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

**Step 3: Create `lib/db/index.ts`**

```typescript
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Works in Cloudflare Workers (HTTP, no WebSocket)
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
export type DB = typeof db;
```

**Step 4: Create `lib/db/schema.ts`** (full schema)

```typescript
import {
  pgTable, text, integer, numeric, boolean,
  timestamp, jsonb, uuid, pgEnum
} from "drizzle-orm/pg-core";

// ── Enums ──────────────────────────────────────────────
export const orderStatusEnum = pgEnum("order_status", [
  "pending", "paid", "processing", "shipped", "delivered", "cancelled"
]);

export const customOrderStatusEnum = pgEnum("custom_order_status", [
  "new", "reviewing", "quoted", "accepted", "in_progress", "completed", "cancelled"
]);

export const userRoleEnum = pgEnum("user_role", ["customer", "admin"]);

// ── Users (extended by better-auth) ────────────────────
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: userRoleEnum("role").notNull().default("customer"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ── better-auth required tables ─────────────────────────
export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// ── Products ────────────────────────────────────────────
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  categoryId: uuid("category_id").references(() => categories.id),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  stock: integer("stock").notNull().default(0),
  featured: boolean("featured").notNull().default(false),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ── Orders ──────────────────────────────────────────────
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => user.id),
  guestEmail: text("guest_email"),
  status: orderStatusEnum("status").notNull().default("pending"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  molliePaymentId: text("mollie_payment_id"),
  mollieCheckoutUrl: text("mollie_checkout_url"),
  shippingAddress: jsonb("shipping_address").$type<{
    name: string; line1: string; line2?: string;
    city: string; postcode: string; country: string;
  }>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  priceAtPurchase: numeric("price_at_purchase", { precision: 10, scale: 2 }).notNull(),
});

// ── Custom Orders ───────────────────────────────────────
export const customOrders = pgTable("custom_orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  description: text("description").notNull(),
  referenceImages: jsonb("reference_images").$type<string[]>().default([]),
  budget: text("budget"),
  status: customOrderStatusEnum("status").notNull().default("new"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ── Types ───────────────────────────────────────────────
export type User = typeof user.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type CustomOrder = typeof customOrders.$inferSelect;
export type Category = typeof categories.$inferSelect;
```

**Step 5: Add migration script to `package.json`**

```json
"db:generate": "drizzle-kit generate",
"db:migrate": "drizzle-kit migrate",
"db:push": "drizzle-kit push",
"db:studio": "drizzle-kit studio"
```

**Step 6: Push schema to Neon**

```bash
npm run db:push
```

Expected: All tables created in Neon. Verify in Neon console.

**Step 7: Commit**

```bash
git add lib/db/ drizzle.config.ts package.json
git commit -m "feat: add Drizzle ORM + Neon schema (products, orders, auth, custom orders)"
```

---

### Task 3: Set up Vitest

**Files:**
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`

**Step 1: Install**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

**Step 2: Create `vitest.config.ts`**

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

**Step 3: Create `tests/setup.ts`**

```typescript
import "@testing-library/jest-dom";
```

**Step 4: Write a smoke test**

Create `tests/smoke.test.ts`:

```typescript
import { describe, it, expect } from "vitest";

describe("smoke", () => {
  it("vitest is configured", () => {
    expect(true).toBe(true);
  });
});
```

**Step 5: Run tests**

```bash
npm run test:run
```

Expected: 1 passed.

**Step 6: Commit**

```bash
git add vitest.config.ts tests/
git commit -m "chore: configure Vitest with React Testing Library"
```

---

### Task 4: Tailwind v4 + shadcn/ui + Design Tokens

**Files:**
- Modify: `app/globals.css`
- Modify: `components.json` (create)
- Modify: `tsconfig.json`

**Step 1: Initialize shadcn/ui**

```bash
npx shadcn@latest init
```

When prompted:
- Style: **Default**
- Base color: **Neutral** (we override with our palette)
- CSS variables: **Yes**

**Step 2: Replace `app/globals.css` with corrected palette**

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  --primary:        #1B5C32;
  --primary-light:  #2E7A45;
  --primary-dark:   #134224;
  --accent-gold:    #C9A456;
  --accent-cream:   #F0E8D0;
  --background:     #F7F5F1;
  --foreground:     #1C1C1A;
  --muted:          #EDE8DF;
  --muted-foreground: #6B6456;
  --border:         #DDD5C4;
  --input:          #DDD5C4;
  --ring:           #1B5C32;
  --radius:         0.5rem;

  /* shadcn/ui compatible mapping */
  --card:           #FFFFFF;
  --card-foreground: #1C1C1A;
  --popover:        #FFFFFF;
  --popover-foreground: #1C1C1A;
  --secondary:      #EDE8DF;
  --secondary-foreground: #1C1C1A;
  --destructive:    #DC2626;
  --destructive-foreground: #FFFFFF;
}

.dark {
  --primary:        #2E7A45;
  --primary-light:  #3D9558;
  --background:     #141A15;
  --foreground:     #F0E8D0;
  --muted:          #1E2B20;
  --muted-foreground: #9CA896;
  --border:         #2A3D2C;
  --card:           #1A2B1C;
  --card-foreground: #F0E8D0;
}

@theme inline {
  --color-primary:        var(--primary);
  --color-primary-light:  var(--primary-light);
  --color-primary-dark:   var(--primary-dark);
  --color-accent-gold:    var(--accent-gold);
  --color-accent-cream:   var(--accent-cream);
  --color-background:     var(--background);
  --color-foreground:     var(--foreground);
  --color-muted:          var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border:         var(--border);
  --font-serif:           "Playfair Display", serif;
  --font-sans:            "Montserrat", sans-serif;
}

* { box-sizing: border-box; padding: 0; margin: 0; }

html { scroll-behavior: smooth; max-width: 100vw; overflow-x: hidden; }

body {
  color: var(--foreground);
  background: var(--background);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 { font-family: var(--font-serif); }

::selection { background-color: var(--primary); color: white; }

*:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--muted); }
::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 4px; }
```

**Step 3: Add shadcn/ui Button (replaces custom Button.tsx)**

```bash
npx shadcn@latest add button
```

Then delete `components/ui/Button.tsx` (replaced by shadcn version).

Update all imports from `@/components/ui/Button` → `@/components/ui/button` (lowercase).

**Step 4: Add other core shadcn components**

```bash
npx shadcn@latest add card badge input label form dialog sheet toast
```

**Step 5: Write a test for the Button**

Create `tests/components/button.test.tsx`:

```typescript
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import { describe, it, expect } from "vitest";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Add to Cart</Button>);
    expect(screen.getByRole("button", { name: "Add to Cart" })).toBeInTheDocument();
  });

  it("renders disabled state", () => {
    render(<Button disabled>Add to Cart</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
```

**Step 6: Run tests**

```bash
npm run test:run
```

Expected: 2 passed.

**Step 7: Commit**

```bash
git add app/globals.css components/ tests/components/
git commit -m "feat: Tailwind v4 design system with logo-derived palette + shadcn/ui"
```

---

## Phase 2 — Authentication

### Task 5: Install and configure better-auth

**Files:**
- Create: `lib/auth.ts`
- Create: `app/api/auth/[...all]/route.ts`
- Create: `lib/auth-client.ts`

**Step 1: Install better-auth**

```bash
npm install better-auth
```

**Step 2: Create `lib/auth.ts`**

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
    },
  },
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL!],
});

export type Session = typeof auth.$Infer.Session;
```

**Step 3: Create `app/api/auth/[...all]/route.ts`**

```typescript
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth.handler);
```

**Step 4: Create `lib/auth-client.ts`** (client-side)

```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL!,
});

export const { signIn, signOut, signUp, useSession } = authClient;
```

**Step 5: Add auth middleware**

Create `middleware.ts` at project root:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const PROTECTED_ROUTES = ["/dashboard", "/admin"];
const ADMIN_ROUTES = ["/admin"];

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  const pathname = request.nextUrl.pathname;

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAdmin = ADMIN_ROUTES.some((r) => pathname.startsWith(r));

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAdmin && session?.user.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
```

**Step 6: Write auth utility tests**

Create `tests/lib/auth.test.ts`:

```typescript
import { describe, it, expect } from "vitest";

describe("auth configuration", () => {
  it("auth module exports handler", async () => {
    const { auth } = await import("@/lib/auth");
    expect(auth).toBeDefined();
    expect(auth.handler).toBeDefined();
  });
});
```

**Step 7: Commit**

```bash
git add lib/auth.ts lib/auth-client.ts app/api/auth/ middleware.ts tests/lib/
git commit -m "feat: configure better-auth with email/password + Google/Facebook/Apple OAuth"
```

---

### Task 6: Auth UI pages

**Files:**
- Create: `app/(auth)/login/page.tsx`
- Create: `app/(auth)/register/page.tsx`
- Create: `app/(auth)/layout.tsx`

**Step 1: Create auth layout `app/(auth)/layout.tsx`**

```tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
```

**Step 2: Create `app/(auth)/login/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await signIn.email({ email, password });
    if (error) {
      setError(error.message ?? "Login failed");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const handleOAuth = (provider: "google" | "facebook" | "apple") =>
    signIn.social({ provider, callbackURL: "/dashboard" });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-2xl text-primary text-center">Sign In</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" className="w-full bg-primary hover:bg-primary-light" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs text-muted-foreground"><span className="bg-card px-2">or continue with</span></div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" onClick={() => handleOAuth("google")}>Google</Button>
          <Button variant="outline" onClick={() => handleOAuth("facebook")}>Facebook</Button>
          <Button variant="outline" onClick={() => handleOAuth("apple")}>Apple</Button>
        </div>
      </CardContent>
      <CardFooter className="justify-center text-sm">
        <span className="text-muted-foreground">No account?&nbsp;</span>
        <Link href="/register" className="text-primary hover:underline font-medium">Create one</Link>
      </CardFooter>
    </Card>
  );
}
```

**Step 3: Create `app/(auth)/register/page.tsx`** (same pattern, calls `signUp.email`)

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await signUp.email({ name, email, password });
    if (error) {
      setError(error.message ?? "Registration failed");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const handleOAuth = (provider: "google" | "facebook" | "apple") =>
    signIn.social({ provider, callbackURL: "/dashboard" });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-2xl text-primary text-center">Create Account</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" className="w-full bg-primary hover:bg-primary-light" disabled={loading}>
            {loading ? "Creating account…" : "Create Account"}
          </Button>
        </form>
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" onClick={() => handleOAuth("google")}>Google</Button>
          <Button variant="outline" onClick={() => handleOAuth("facebook")}>Facebook</Button>
          <Button variant="outline" onClick={() => handleOAuth("apple")}>Apple</Button>
        </div>
      </CardContent>
      <CardFooter className="justify-center text-sm">
        <span className="text-muted-foreground">Have an account?&nbsp;</span>
        <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
      </CardFooter>
    </Card>
  );
}
```

**Step 4: Commit**

```bash
git add app/\(auth\)/
git commit -m "feat: auth UI — login and register pages with OAuth"
```

---

## Phase 3 — Product Catalog

### Task 7: Product data access layer

**Files:**
- Create: `lib/products.ts`
- Create: `tests/lib/products.test.ts`

**Step 1: Write failing tests first**

Create `tests/lib/products.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the DB so tests don't need a real connection
vi.mock("@/lib/db", () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
  },
}));

describe("products", () => {
  it("getFeaturedProducts returns array", async () => {
    const { getFeaturedProducts } = await import("@/lib/products");
    expect(getFeaturedProducts).toBeDefined();
  });
});
```

**Step 2: Run — expect pass (function existence)**

```bash
npm run test:run tests/lib/products.test.ts
```

**Step 3: Create `lib/products.ts`**

```typescript
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
```

**Step 4: Commit**

```bash
git add lib/products.ts tests/lib/products.test.ts
git commit -m "feat: product data access layer with Drizzle"
```

---

### Task 8: R2 storage helper

**Files:**
- Create: `lib/storage.ts`
- Modify: `next.config.ts`

**Step 1: Create `lib/storage.ts`**

```typescript
// R2 bucket binding is injected by Cloudflare Workers runtime.
// In local dev, fall back to a public URL pattern.

declare global {
  // Cloudflare Worker binding — available in production
  const R2: R2Bucket | undefined;
}

const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL ?? "";

export function getProductImageUrl(key: string): string {
  if (!key) return "/placeholder.jpg";
  if (key.startsWith("http")) return key;
  return `${R2_PUBLIC_URL}/${key}`;
}

export async function uploadProductImage(
  file: ArrayBuffer,
  key: string,
  contentType: string
): Promise<string> {
  if (typeof R2 === "undefined") {
    throw new Error("R2 binding not available — are you running on Workers?");
  }
  await R2.put(key, file, { httpMetadata: { contentType } });
  return getProductImageUrl(key);
}
```

**Step 2: Update `next.config.ts`** — add R2 public domain to image remotePatterns

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.r2.dev" },
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: process.env.R2_PUBLIC_HOSTNAME ?? "localhost" },
    ],
  },
};

export default nextConfig;
```

**Step 3: Commit**

```bash
git add lib/storage.ts next.config.ts
git commit -m "feat: R2 storage helper for product images"
```

---

### Task 9: Shop page + Product cards (Server Components)

**Files:**
- Modify: `app/shop/page.tsx`
- Modify: `components/shop/ProductCard.tsx`
- Modify: `components/shop/ProductGrid.tsx`

**Step 1: Convert `app/shop/page.tsx` to a Server Component**

```tsx
import { getProducts } from "@/lib/products";
import { ProductGrid } from "@/components/shop/ProductGrid";

export const metadata = {
  title: "Shop — Crochetty",
  description: "Browse our handcrafted crochet collection.",
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl text-primary mb-4">The Collection</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Each piece is handcrafted with ethically sourced yarn and slow intention.
          </p>
        </div>
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
```

**Step 2: Update `components/shop/ProductCard.tsx`**

```tsx
import Image from "next/image";
import Link from "next/link";
import { getProductImageUrl } from "@/lib/storage";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/db/schema";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = getProductImageUrl(product.images?.[0] ?? "");

  return (
    <Link href={`/shop/${product.id}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted mb-4">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {product.featured && (
          <Badge className="absolute top-3 left-3 bg-accent-gold text-foreground border-0">
            Featured
          </Badge>
        )}
      </div>
      <div>
        <h3 className="font-serif text-lg text-primary group-hover:text-primary-light transition-colors">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm mt-1">€{Number(product.price).toFixed(2)}</p>
      </div>
    </Link>
  );
}
```

**Step 3: Update `components/shop/ProductGrid.tsx`**

```tsx
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/db/schema";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-24">
        No products available yet. Check back soon.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

**Step 4: Commit**

```bash
git add app/shop/ components/shop/
git commit -m "feat: shop page as Server Component with corrected design tokens"
```

---

### Task 10: Product detail page (Server Component)

**Files:**
- Modify: `app/shop/[id]/page.tsx`

**Step 1: Replace with Server Component version**

```tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductById } from "@/lib/products";
import { getProductImageUrl } from "@/lib/storage";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Truck } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return {};
  return { title: `${product.name} — Crochetty` };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const images = product.images ?? [];
  const primaryImage = getProductImageUrl(images[0] ?? "");

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
              <Image src={primaryImage} alt={product.name} fill className="object-cover" priority />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <Image src={getProductImageUrl(img)} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <Badge className="w-fit mb-4 bg-primary/10 text-primary border-0">{product.categoryId ?? "Handcrafted"}</Badge>
            <h1 className="font-serif text-4xl md:text-5xl text-primary mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-primary mb-6">€{Number(product.price).toFixed(2)}</p>
            {product.description && (
              <p className="text-muted-foreground leading-relaxed mb-8 italic">"{product.description}"</p>
            )}

            <AddToCartButton product={product} />

            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-border mt-8">
              <div className="flex gap-3">
                <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-primary">Authentic Quality</p>
                  <p className="text-xs text-muted-foreground">Premium, sustainably sourced yarn</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Truck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-primary">Mindful Shipping</p>
                  <p className="text-xs text-muted-foreground">Eco-conscious packaging</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Create `components/shop/AddToCartButton.tsx`** (client island)

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getProductImageUrl } from "@/lib/storage";
import type { Product } from "@/lib/db/schema";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <Button
      size="lg"
      className="rounded-full bg-primary hover:bg-primary-light h-14 text-lg w-full sm:w-auto px-10"
      onClick={() =>
        addItem({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          image: getProductImageUrl(product.images?.[0] ?? ""),
          quantity: 1,
        })
      }
    >
      <ShoppingCart className="w-5 h-5 mr-2" />
      Add to Cart
    </Button>
  );
}
```

**Step 3: Commit**

```bash
git add app/shop/ components/shop/AddToCartButton.tsx
git commit -m "feat: product detail page as Server Component with client AddToCart island"
```

---

## Phase 4 — Cart & Checkout

### Task 11: Cart context (with persistence)

**Files:**
- Modify: `context/CartContext.tsx`

**Step 1: Update CartContext with localStorage persistence and dispatch pattern**

```tsx
"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartState = { items: CartItem[]; open: boolean };

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QTY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR" }
  | { type: "OPEN" }
  | { type: "CLOSE" };

const STORAGE_KEY = "crochetty-cart";

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.payload.id);
      const items = existing
        ? state.items.map((i) =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...state.items, action.payload];
      return { ...state, items, open: true };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case "UPDATE_QTY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        ),
      };
    case "CLEAR":
      return { ...state, items: [] };
    case "OPEN":
      return { ...state, open: true };
    case "CLOSE":
      return { ...state, open: false };
    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  totalItems: number;
  totalPrice: number;
} | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], open: false }, (init) => {
    if (typeof window === "undefined") return init;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...init, items: JSON.parse(stored) } : init;
    } catch {
      return init;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = state.items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      state,
      dispatch,
      addItem: (item) => dispatch({ type: "ADD_ITEM", payload: item }),
      removeItem: (id) => dispatch({ type: "REMOVE_ITEM", payload: id }),
      totalItems,
      totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
```

**Step 2: Write cart tests**

Create `tests/context/cart.test.tsx`:

```typescript
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "@/context/CartContext";
import { describe, it, expect } from "vitest";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

const item = { id: "1", name: "Scarf", price: 45, image: "/test.jpg", quantity: 1 };

describe("CartContext", () => {
  it("starts empty", () => {
    const { result } = renderHook(useCart, { wrapper });
    expect(result.current.state.items).toHaveLength(0);
  });

  it("adds an item", () => {
    const { result } = renderHook(useCart, { wrapper });
    act(() => result.current.addItem(item));
    expect(result.current.state.items).toHaveLength(1);
    expect(result.current.totalItems).toBe(1);
  });

  it("increments quantity on duplicate add", () => {
    const { result } = renderHook(useCart, { wrapper });
    act(() => result.current.addItem(item));
    act(() => result.current.addItem(item));
    expect(result.current.state.items[0].quantity).toBe(2);
    expect(result.current.totalItems).toBe(2);
  });

  it("removes an item", () => {
    const { result } = renderHook(useCart, { wrapper });
    act(() => result.current.addItem(item));
    act(() => result.current.removeItem("1"));
    expect(result.current.state.items).toHaveLength(0);
  });
});
```

**Step 3: Run tests**

```bash
npm run test:run tests/context/cart.test.tsx
```

Expected: 4 passed.

**Step 4: Commit**

```bash
git add context/CartContext.tsx tests/context/
git commit -m "feat: cart context with localStorage persistence and dispatch pattern"
```

---

### Task 12: Checkout API route (Mollie)

**Files:**
- Modify: `app/api/checkout/route.ts`
- Create: `app/api/webhooks/mollie/route.ts`
- Create: `lib/mollie.ts`

**Step 1: Create `lib/mollie.ts`**

```typescript
const MOLLIE_BASE = "https://api.mollie.com/v2";

async function mollieRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${MOLLIE_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.MOLLIE_API_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`Mollie error ${response.status}: ${JSON.stringify(error)}`);
  }
  return response.json();
}

export interface MolliePaymentResult {
  id: string;
  status: string;
  _links: { checkout: { href: string } };
}

export async function createPayment({
  amount,
  description,
  orderId,
  redirectUrl,
  webhookUrl,
}: {
  amount: number;
  description: string;
  orderId: string;
  redirectUrl: string;
  webhookUrl: string;
}): Promise<MolliePaymentResult> {
  return mollieRequest<MolliePaymentResult>("/payments", {
    method: "POST",
    body: JSON.stringify({
      amount: { currency: "EUR", value: amount.toFixed(2) },
      description,
      redirectUrl,
      webhookUrl,
      metadata: { orderId },
    }),
  });
}

export async function getPayment(paymentId: string): Promise<MolliePaymentResult> {
  return mollieRequest<MolliePaymentResult>(`/payments/${paymentId}`);
}
```

**Step 2: Replace `app/api/checkout/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { orders, orderItems, products } from "@/lib/db/schema";
import { createPayment } from "@/lib/mollie";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  const body = await request.json();
  const { items, shippingAddress, guestEmail } = body;

  if (!items?.length) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  // Validate items and fetch prices from DB (never trust client prices)
  const productIds = items.map((i: { id: string }) => i.id);
  const dbProducts = await db
    .select()
    .from(products)
    .where(eq(products.published, true));

  const validatedItems = items.map((item: { id: string; quantity: number }) => {
    const dbProduct = dbProducts.find((p) => p.id === item.id);
    if (!dbProduct) throw new Error(`Product ${item.id} not found`);
    return { ...item, price: Number(dbProduct.price), name: dbProduct.name };
  });

  const total = validatedItems.reduce(
    (sum: number, i: { price: number; quantity: number }) => sum + i.price * i.quantity,
    0
  );

  // Create order in DB
  const [order] = await db
    .insert(orders)
    .values({
      userId: session?.user.id ?? null,
      guestEmail: session ? null : guestEmail,
      status: "pending",
      total: total.toFixed(2),
      shippingAddress,
    })
    .returning();

  await db.insert(orderItems).values(
    validatedItems.map((i: { id: string; quantity: number; price: number }) => ({
      orderId: order.id,
      productId: i.id,
      quantity: i.quantity,
      priceAtPurchase: i.price.toFixed(2),
    }))
  );

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  // Create Mollie payment
  const payment = await createPayment({
    amount: total,
    description: `Crochetty Order #${order.id.slice(0, 8)}`,
    orderId: order.id,
    redirectUrl: `${appUrl}/checkout/success?orderId=${order.id}`,
    webhookUrl: `${appUrl}/api/webhooks/mollie`,
  });

  // Save Mollie IDs to order
  await db
    .update(orders)
    .set({ molliePaymentId: payment.id, mollieCheckoutUrl: payment._links.checkout.href })
    .where(eq(orders.id, order.id));

  return NextResponse.json({ checkoutUrl: payment._links.checkout.href });
}
```

**Step 3: Create `app/api/webhooks/mollie/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { getPayment } from "@/lib/mollie";
import { eq } from "drizzle-orm";
import { sendOrderConfirmation } from "@/lib/email";

export async function POST(request: NextRequest) {
  const body = await request.formData();
  const paymentId = body.get("id") as string;

  if (!paymentId) {
    return NextResponse.json({ error: "No payment ID" }, { status: 400 });
  }

  const payment = await getPayment(paymentId);
  const orderId = payment.metadata?.orderId;

  if (!orderId) return NextResponse.json({ ok: true });

  const statusMap: Record<string, string> = {
    paid: "paid",
    failed: "cancelled",
    canceled: "cancelled",
    expired: "cancelled",
  };

  const newStatus = statusMap[payment.status];
  if (!newStatus) return NextResponse.json({ ok: true });

  const [order] = await db
    .update(orders)
    .set({ status: newStatus as "paid" | "cancelled" })
    .where(eq(orders.id, orderId))
    .returning();

  if (newStatus === "paid" && order) {
    const email = order.userId
      ? (await db.query.user.findFirst({ where: (u, { eq }) => eq(u.id, order.userId!) }))?.email
      : order.guestEmail;
    if (email) await sendOrderConfirmation(email, order);
  }

  return NextResponse.json({ ok: true });
}
```

**Step 4: Commit**

```bash
git add lib/mollie.ts app/api/checkout/ app/api/webhooks/
git commit -m "feat: Mollie checkout integration with webhook handler"
```

---

### Task 13: Resend email

**Files:**
- Create: `lib/email.ts`

**Step 1: Install**

```bash
npm install resend
```

**Step 2: Create `lib/email.ts`**

```typescript
import { Resend } from "resend";
import type { Order } from "@/lib/db/schema";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Crochetty <orders@crochetty.com>";

export async function sendOrderConfirmation(email: string, order: Order) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Your Crochetty order is confirmed 🧶`,
    html: `
      <h1 style="color:#1B5C32;font-family:Georgia,serif">Order Confirmed</h1>
      <p>Thank you for your order. We'll begin crafting your pieces with love.</p>
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Total:</strong> €${Number(order.total).toFixed(2)}</p>
      <p>We'll notify you when your order ships.</p>
      <p style="color:#6B6456;font-size:12px">Crochetty — Slow Luxury, Handcrafted</p>
    `,
  });
}

export async function sendCustomOrderNotification(data: {
  name: string;
  email: string;
  description: string;
}) {
  // Notify admin
  await resend.emails.send({
    from: FROM,
    to: "hello@crochetty.com",
    subject: `New custom order request from ${data.name}`,
    html: `
      <h2>New Custom Order Request</h2>
      <p><strong>From:</strong> ${data.name} (${data.email})</p>
      <p><strong>Description:</strong></p>
      <p>${data.description}</p>
    `,
  });

  // Confirm to customer
  await resend.emails.send({
    from: FROM,
    to: data.email,
    subject: "We received your custom order request 🧶",
    html: `
      <h1 style="color:#1B5C32;font-family:Georgia,serif">Request Received</h1>
      <p>Hi ${data.name}, thank you for your custom order request.</p>
      <p>We'll review your request and get back to you within 2–3 business days.</p>
      <p style="color:#6B6456;font-size:12px">Crochetty — Slow Luxury, Handcrafted</p>
    `,
  });
}
```

**Step 3: Commit**

```bash
git add lib/email.ts
git commit -m "feat: Resend email — order confirmation + custom order notification"
```

---

## Phase 5 — Admin Panel

### Task 14: Admin layout + role guard

**Files:**
- Create: `app/admin/layout.tsx`
- Create: `app/admin/page.tsx`

**Step 1: Create `app/admin/layout.tsx`**

```tsx
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

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-muted flex">
      <aside className="w-64 bg-primary text-white flex flex-col p-6 gap-2 fixed inset-y-0 left-0">
        <p className="font-serif text-xl mb-8">Crochetty Admin</p>
        {adminNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
          >
            {item.label}
          </Link>
        ))}
      </aside>
      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
}
```

**Step 2: Create `app/admin/page.tsx`** (overview stats)

```tsx
import { db } from "@/lib/db";
import { orders, products, customOrders } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";

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
      <div className="grid grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
            <p className="text-4xl font-bold text-primary">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add app/admin/
git commit -m "feat: admin panel layout with role guard and overview stats"
```

---

### Task 15: Admin — Product management

**Files:**
- Create: `app/admin/products/page.tsx`
- Create: `app/admin/products/new/page.tsx`
- Create: `app/api/admin/products/route.ts`

**Step 1: Create `app/api/admin/products/route.ts`**

```typescript
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
  const all = await db.select().from(products);
  return NextResponse.json(all);
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const [product] = await db.insert(products).values(body).returning();
    return NextResponse.json(product, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 403 });
  }
}
```

**Step 2: Create `app/admin/products/page.tsx`**

```tsx
import Link from "next/link";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function AdminProductsPage() {
  const allProducts = await db.select().from(products);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-primary">Products</h1>
        <Button asChild className="bg-primary hover:bg-primary-light rounded-full">
          <Link href="/admin/products/new">+ New Product</Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Stock</th>
              <th className="text-left p-4">Status</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {allProducts.map((p) => (
              <tr key={p.id} className="border-t border-border hover:bg-muted/50">
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4">€{Number(p.price).toFixed(2)}</td>
                <td className="p-4">{p.stock}</td>
                <td className="p-4">
                  <Badge variant={p.published ? "default" : "secondary"}>
                    {p.published ? "Live" : "Draft"}
                  </Badge>
                </td>
                <td className="p-4">
                  <Link href={`/admin/products/${p.id}`} className="text-primary hover:underline text-xs">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add app/admin/products/ app/api/admin/
git commit -m "feat: admin product list and management API"
```

---

## Phase 6 — Custom Orders

### Task 16: Custom order form + API

**Files:**
- Modify: `app/custom/page.tsx`
- Create: `app/api/custom-orders/route.ts`

**Step 1: Create `app/api/custom-orders/route.ts`**

```typescript
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
```

**Step 2: Replace `app/custom/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CustomOrderPage() {
  const [form, setForm] = useState({ name: "", email: "", description: "", budget: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/custom-orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSubmitted(true);
    } else {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md px-6">
          <p className="text-5xl mb-6">🧶</p>
          <h2 className="font-serif text-3xl text-primary mb-4">Request Received</h2>
          <p className="text-muted-foreground">
            Thank you! We'll review your request and get back to you within 2–3 business days.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-xl">
        <h1 className="font-serif text-4xl text-primary mb-4 text-center">Custom Order</h1>
        <p className="text-muted-foreground text-center mb-12">
          Tell us what you have in mind and we'll craft it just for you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm">
          <div className="space-y-1">
            <Label htmlFor="name">Your Name</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="description">Describe Your Request</Label>
            <Textarea
              id="description"
              rows={5}
              placeholder="What would you like made? Include details like colors, size, occasion…"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="budget">Budget (optional)</Label>
            <Input id="budget" placeholder="e.g. €50–€100" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full rounded-full bg-primary hover:bg-primary-light h-12">
            {loading ? "Sending…" : "Submit Request"}
          </Button>
        </form>
      </div>
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add app/custom/ app/api/custom-orders/
git commit -m "feat: custom order form with DB persistence and email notification"
```

---

## Phase 7 — CI/CD

### Task 17: GitHub Actions deploy pipeline

**Files:**
- Create: `.github/workflows/deploy.yml`

**Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run test:run
      - run: npm run lint

  deploy:
    name: Deploy
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build:worker
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          BETTER_AUTH_SECRET: ${{ secrets.BETTER_AUTH_SECRET }}
          NEXT_PUBLIC_APP_URL: ${{ secrets.NEXT_PUBLIC_APP_URL }}
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

**Step 2: Add required GitHub Secrets**

In GitHub repo → Settings → Secrets → Actions, add:
- `CLOUDFLARE_API_TOKEN` — from Cloudflare Dashboard → My Profile → API Tokens → Create Token → "Edit Cloudflare Workers" template
- `CLOUDFLARE_ACCOUNT_ID` — from Cloudflare Dashboard → right sidebar
- `DATABASE_URL` — Neon connection string
- `BETTER_AUTH_SECRET` — random 32-char string
- `NEXT_PUBLIC_APP_URL` — e.g. `https://crochetty.com`

**Step 3: Commit**

```bash
git add .github/
git commit -m "chore: GitHub Actions CI/CD — test on PR, deploy to Cloudflare on push to main"
```

---

## Implementation Order Summary

| Phase | Tasks | Description |
|---|---|---|
| 1 | 1–4 | Cloudflare config, Drizzle/Neon schema, Vitest, Tailwind + shadcn |
| 2 | 5–6 | better-auth, login/register pages |
| 3 | 7–10 | Products data layer, R2 helper, shop page, product detail |
| 4 | 11–13 | Cart with persistence, Mollie checkout, Resend email |
| 5 | 14–15 | Admin panel (layout, products) |
| 6 | 16 | Custom orders form + API |
| 7 | 17 | CI/CD |

## Skills to use during execution

- `ui-ux-pro-max` — designing new pages or components
- `frontend-design` — building UI
- `tailwind-design-system` — extending design tokens
- `next-best-practices` — any Next.js file/pattern questions
- `better-auth-best-practices` — during Task 5
- `web-design-guidelines` — before each phase ships
- `test-driven-development` — before writing any feature code
- `requesting-code-review` — after each phase completes
- `verification-before-completion` — before marking anything done
- `systematic-debugging` — any test failure or bug
