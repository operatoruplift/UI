import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Dropdown } from "./Dropdown";

describe("Dropdown", () => {
  const items = [
    { id: "a", label: "Option A", onClick: vi.fn() },
    { id: "b", label: "Option B", onClick: vi.fn() },
    { id: "d", label: "", divider: true },
    { id: "c", label: "Delete", danger: true, onClick: vi.fn() },
  ];

  it("shows menu on click", () => {
    render(<Dropdown trigger={<span>Open</span>} items={items} />);
    fireEvent.click(screen.getByText("Open"));
    expect(screen.getByText("Option A")).toBeTruthy();
  });

  it("calls onClick when item selected", () => {
    render(<Dropdown trigger={<span>Open</span>} items={items} />);
    fireEvent.click(screen.getByText("Open"));
    fireEvent.click(screen.getByText("Option A"));
    expect(items[0].onClick).toHaveBeenCalled();
  });

  it("closes after selection", () => {
    render(<Dropdown trigger={<span>Open</span>} items={items} />);
    fireEvent.click(screen.getByText("Open"));
    fireEvent.click(screen.getByText("Option B"));
    expect(screen.queryByText("Option A")).toBeNull();
  });
});
