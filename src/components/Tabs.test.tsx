import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Tabs } from "./Tabs";

const tabs = [
  { id: "a", label: "Tab A", content: <p>Content A</p> },
  { id: "b", label: "Tab B", content: <p>Content B</p> },
  { id: "c", label: "Tab C", content: <p>Content C</p>, disabled: true },
];

describe("Tabs", () => {
  it("renders all tab labels", () => {
    render(<Tabs tabs={tabs} />);
    expect(screen.getByText("Tab A")).toBeTruthy();
    expect(screen.getByText("Tab B")).toBeTruthy();
    expect(screen.getByText("Tab C")).toBeTruthy();
  });

  it("shows first tab content by default", () => {
    render(<Tabs tabs={tabs} />);
    expect(screen.getByText("Content A")).toBeTruthy();
  });

  it("switches content on click", () => {
    render(<Tabs tabs={tabs} />);
    fireEvent.click(screen.getByText("Tab B"));
    expect(screen.getByText("Content B")).toBeTruthy();
  });

  it("calls onChange callback", () => {
    const onChange = vi.fn();
    render(<Tabs tabs={tabs} onChange={onChange} />);
    fireEvent.click(screen.getByText("Tab B"));
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("disables tab when disabled", () => {
    render(<Tabs tabs={tabs} />);
    expect(screen.getByText("Tab C").closest("button")).toBeDisabled();
  });
});
