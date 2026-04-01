import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { RiskBadge } from "./RiskBadge";

describe("RiskBadge", () => {
  it.each(["A", "B", "C", "D", "F"] as const)("renders grade %s", (grade) => {
    render(<RiskBadge grade={grade} />);
    expect(screen.getByText(grade)).toBeTruthy();
  });

  it("applies green color for A grade", () => {
    const { container } = render(<RiskBadge grade="A" />);
    expect(container.firstChild).toHaveClass("text-green-400");
  });

  it("applies red color for F grade", () => {
    const { container } = render(<RiskBadge grade="F" />);
    expect(container.firstChild).toHaveClass("text-red-400");
  });
});
