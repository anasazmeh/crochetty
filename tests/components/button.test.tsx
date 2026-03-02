import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

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
