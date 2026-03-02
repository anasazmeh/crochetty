# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
```

No test suite is configured.

## Environment Variables

Create `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Architecture

**Crochetty** is a Next.js 16 e-commerce storefront for a handcrafted crochet boutique. It uses the App Router with Tailwind CSS v4, Framer Motion for animations, and Supabase as the backend.

### Data Flow

All product data is fetched from Supabase via `lib/api.ts`, which exports three async functions (`getProducts`, `getFeaturedProducts`, `getProductById`) and a `getStorageUrl` helper that resolves Supabase Storage paths (bucket: `Crochetty media`) into public URLs. Pages fetch data client-side using `useEffect` + `useState` — there is no server-side data fetching currently.

### Cart State

`context/CartContext.tsx` provides a React context (`CartProvider`) wrapping the entire app. It manages cart items in memory (no persistence) and controls the slide-out cart sidebar. Consumed via `useCart()` hook. The `CartProvider` wraps the layout in `app/layout.tsx`.

### Route Structure

- `/` — Hero + featured products + brand story teaser
- `/shop` — Full product grid (all products from Supabase)
- `/shop/[id]` — Product detail page with image gallery
- `/about`, `/contact`, `/custom`, `/journal` — Static content pages
- `/dashboard` — Mock account/order history page (hardcoded data, no real auth)
- `/api/checkout` — Stub POST endpoint (no real payment integration yet)
- `/api/instagram` — Instagram feed route

### Key Conventions

**Typography:** Playfair Display (`font-serif` / CSS var `--font-playfair`) for all headings; Montserrat (`font-sans` / `--font-montserrat`) for body text. Both loaded via `next/font/google`.

**Colors:** Design tokens are CSS custom properties defined in `globals.css`. Primary teal: `#1B7A6E` / `#2A9D8F`. Avoid hardcoding hex values that duplicate these tokens; prefer Tailwind classes like `text-primary`, `bg-primary`.

**Button component:** `components/ui/Button.tsx` — use this for all interactive buttons. Variants: `primary`, `secondary`, `outline`, `ghost`. Sizes: `sm`, `md`, `lg`. It wraps `framer-motion` for micro-interactions.

**Images:** All product images are stored in Supabase Storage under the `Products/` prefix. Use `getStorageUrl()` from `lib/api.ts` to resolve paths. Remote image domains are whitelisted in `next.config.ts` (`*.supabase.co`, `images.unsplash.com`).

**`'use client'` directive:** Required on any component using hooks, event handlers, or Framer Motion — which is most components given client-side data fetching. The layout itself is a Server Component; `CartProvider` is the client boundary.

### Unimplemented Features (stubs)

- Authentication / real user accounts
- Payment processing (checkout route is a mock)
- Wishlist and search (icons present in header but non-functional)
- Instagram feed API
