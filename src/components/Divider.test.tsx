import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Divider } from "./Divider";

describe("Divider", () => {
  it("renders horizontal by default", () => {
    const { container } = render(<Divider />);
    expect(container.firstChild).toHaveClass("bg-white/5");
  });

  it("renders label", () => {
    render(<Divider label="or" />);
    expect(screen.getByText("or")).toBeTruthy();
  });

  it("renders vertical", () => {
    const { container } = render(<Divider orientation="vertical" />);
    expect(container.firstChild).toHaveClass("w-px");
  });
});
