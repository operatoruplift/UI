import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SessionIndicator } from "./SessionIndicator";

describe("SessionIndicator", () => {
  it("renders count", () => {
    render(<SessionIndicator count={3} />);
    expect(screen.getByText("3 sessions")).toBeTruthy();
  });

  it("uses singular for count 1", () => {
    render(<SessionIndicator count={1} />);
    expect(screen.getByText("1 session")).toBeTruthy();
  });

  it("shows inactive style for 0", () => {
    const { container } = render(<SessionIndicator count={0} />);
    expect(container.querySelector(".bg-gray-600")).toBeTruthy();
  });

  it("shows active style for positive count", () => {
    const { container } = render(<SessionIndicator count={5} />);
    expect(container.querySelector(".bg-green-400")).toBeTruthy();
  });
});
