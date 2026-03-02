import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "@/context/CartContext";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

const item = {
  id: "1",
  name: "Crocheted Scarf",
  price: 45,
  image: "/scarf.jpg",
  quantity: 1,
};

describe("CartContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with empty cart", () => {
    const { result } = renderHook(useCart, { wrapper });
    expect(result.current.state.items).toHaveLength(0);
  });

  it("adds an item and opens cart", () => {
    const { result } = renderHook(useCart, { wrapper });
    act(() => result.current.addItem(item));
    expect(result.current.state.items).toHaveLength(1);
    expect(result.current.totalItems).toBe(1);
    expect(result.current.state.open).toBe(true);
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

  it("calculates totalPrice correctly", () => {
    const { result } = renderHook(useCart, { wrapper });
    act(() => result.current.addItem(item));
    act(() => result.current.addItem(item));
    expect(result.current.totalPrice).toBe(90);
  });

  it("opens and closes cart", () => {
    const { result } = renderHook(useCart, { wrapper });
    expect(result.current.state.open).toBe(false);
    act(() => result.current.openCart());
    expect(result.current.state.open).toBe(true);
    act(() => result.current.closeCart());
    expect(result.current.state.open).toBe(false);
  });
});
