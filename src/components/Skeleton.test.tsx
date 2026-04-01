import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("renders text variant by default", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("rounded-md");
  });

  it("renders circular variant", () => {
    const { container } = render(<Skeleton variant="circular" />);
    expect(container.firstChild).toHaveClass("rounded-full");
  });

  it("renders rectangular variant", () => {
    const { container } = render(<Skeleton variant="rectangular" width={200} height={100} />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass("rounded-lg");
    expect(el.style.width).toBe("200px");
    expect(el.style.height).toBe("100px");
  });

  it("has shimmer animation class", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("animate-skeleton-shimmer");
  });
});
