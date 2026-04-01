import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Alert } from "./Alert";

describe("Alert", () => {
  it("renders title and content", () => {
    render(<Alert title="Warning" variant="warning">Check your config</Alert>);
    expect(screen.getByText("Warning")).toBeTruthy();
    expect(screen.getByText("Check your config")).toBeTruthy();
  });

  it("has alert role", () => {
    render(<Alert>Message</Alert>);
    expect(screen.getByRole("alert")).toBeTruthy();
  });

  it("shows dismiss button when dismissible", () => {
    const onDismiss = vi.fn();
    render(<Alert dismissible onDismiss={onDismiss}>Msg</Alert>);
    fireEvent.click(screen.getByLabelText("Dismiss"));
    expect(onDismiss).toHaveBeenCalled();
  });

  it("applies variant styles", () => {
    const { container } = render(<Alert variant="error">Error!</Alert>);
    expect(container.querySelector(".border-red-500\\/20")).toBeTruthy();
  });
});
