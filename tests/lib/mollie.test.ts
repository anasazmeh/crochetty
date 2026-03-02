import { describe, it, expect } from "vitest";

describe("mollie", () => {
  it("exports createPayment function", async () => {
    const { createPayment } = await import("@/lib/mollie");
    expect(typeof createPayment).toBe("function");
  });

  it("exports getPayment function", async () => {
    const { getPayment } = await import("@/lib/mollie");
    expect(typeof getPayment).toBe("function");
  });
});
