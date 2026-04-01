import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Input } from "./Input";

describe("Input", () => {
  it("renders a text input by default", () => {
    render(<Input placeholder="Name" />);
    expect(screen.getByPlaceholderText("Name")).toBeTruthy();
  });

  it("shows error message", () => {
    render(<Input error="Required" />);
    expect(screen.getByText("Required")).toBeTruthy();
  });

  it("renders search type with search icon", () => {
    const { container } = render(<Input type="search" placeholder="Search..." />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("toggles password visibility", () => {
    render(<Input type="password" placeholder="Password" />);
    const input = screen.getByPlaceholderText("Password");
    expect(input).toHaveAttribute("type", "password");

    const toggleBtn = input.parentElement!.querySelector("button")!;
    fireEvent.click(toggleBtn);
    expect(input).toHaveAttribute("type", "text");

    fireEvent.click(toggleBtn);
    expect(input).toHaveAttribute("type", "password");
  });

  it("calls onChange", () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} placeholder="Type" />);
    fireEvent.change(screen.getByPlaceholderText("Type"), { target: { value: "hello" } });
    expect(onChange).toHaveBeenCalled();
  });

  it("can be disabled", () => {
    render(<Input disabled placeholder="Disabled" />);
    expect(screen.getByPlaceholderText("Disabled")).toBeDisabled();
  });
});
