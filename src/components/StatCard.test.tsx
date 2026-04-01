import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatCard } from "./StatCard";

describe("StatCard", () => {
  it("renders label and value", () => {
    render(<StatCard label="Users" value="1,234" />);
    expect(screen.getByText("Users")).toBeTruthy();
    expect(screen.getByText("1,234")).toBeTruthy();
  });

  it("renders positive change", () => {
    render(<StatCard label="Revenue" value="$5K" change={{ value: 12, label: "vs last week" }} />);
    expect(screen.getByText("+12%")).toBeTruthy();
    expect(screen.getByText("vs last week")).toBeTruthy();
  });

  it("renders negative change", () => {
    render(<StatCard label="Errors" value="42" change={{ value: -5.5 }} />);
    expect(screen.getByText("-5.5%")).toBeTruthy();
  });

  it("renders icon", () => {
    render(<StatCard label="Test" value="0" icon={<span data-testid="icon">★</span>} />);
    expect(screen.getByTestId("icon")).toBeTruthy();
  });
});
