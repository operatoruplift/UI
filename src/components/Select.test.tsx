import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Select } from "./Select";

const options = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
  { value: "c", label: "Charlie" },
];

describe("Select", () => {
  it("renders placeholder", () => {
    render(<Select options={options} placeholder="Pick one" />);
    expect(screen.getByText("Pick one")).toBeTruthy();
  });

  it("opens dropdown on click", () => {
    render(<Select options={options} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Alpha")).toBeTruthy();
    expect(screen.getByText("Beta")).toBeTruthy();
  });

  it("selects an option", () => {
    const onChange = vi.fn();
    render(<Select options={options} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText("Beta"));
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("filters options when searchable", () => {
    render(<Select options={options} searchable />);
    fireEvent.click(screen.getByRole("button"));
    const search = screen.getByPlaceholderText("Search...");
    fireEvent.change(search, { target: { value: "Cha" } });
    expect(screen.getByText("Charlie")).toBeTruthy();
    expect(screen.queryByText("Alpha")).toBeNull();
  });

  it("supports multi-select", () => {
    const onChange = vi.fn();
    render(<Select options={options} multiple value={["a"]} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText("Beta"));
    expect(onChange).toHaveBeenCalledWith(["a", "b"]);
  });

  it("shows error message", () => {
    render(<Select options={options} error="Required" />);
    expect(screen.getByText("Required")).toBeTruthy();
  });

  it("is disabled", () => {
    render(<Select options={options} disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
