import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("renders initials from fallback", () => {
    render(<Avatar fallback="John Doe" />);
    expect(screen.getByText("JD")).toBeTruthy();
  });

  it("renders image when src provided", () => {
    const { container } = render(<Avatar src="https://example.com/avatar.jpg" alt="User" />);
    const img = container.querySelector("img");
    expect(img).toBeTruthy();
    expect(img!.getAttribute("src")).toBe("https://example.com/avatar.jpg");
  });

  it("renders status dot", () => {
    const { container } = render(<Avatar fallback="Test" status="online" />);
    expect(container.querySelector(".bg-green-400")).toBeTruthy();
  });

  it("applies size classes", () => {
    const { container } = render(<Avatar fallback="X" size="lg" />);
    expect(container.querySelector(".h-12")).toBeTruthy();
  });
});
