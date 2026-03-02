import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock DB before any imports that use it
vi.mock("@/lib/db", () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
  },
}));

describe("products data access", () => {
  it("exports getFeaturedProducts function", async () => {
    const { getFeaturedProducts } = await import("@/lib/products");
    expect(typeof getFeaturedProducts).toBe("function");
  });

  it("exports getProducts function", async () => {
    const { getProducts } = await import("@/lib/products");
    expect(typeof getProducts).toBe("function");
  });

  it("exports getProductBySlug function", async () => {
    const { getProductBySlug } = await import("@/lib/products");
    expect(typeof getProductBySlug).toBe("function");
  });

  it("exports getProductById function", async () => {
    const { getProductById } = await import("@/lib/products");
    expect(typeof getProductById).toBe("function");
  });
});
