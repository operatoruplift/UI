import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ToastProvider, useToast } from "./Toast";

const ToastTrigger = () => {
  const { toast } = useToast();
  return (
    <button onClick={() => toast({ variant: "success", title: "Done", message: "It worked" })}>
      Show Toast
    </button>
  );
};

describe("Toast", () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it("shows toast on trigger", () => {
    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText("Show Toast"));
    expect(screen.getByText("Done")).toBeTruthy();
    expect(screen.getByText("It worked")).toBeTruthy();
  });

  it("auto-dismisses after duration", () => {
    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText("Show Toast"));
    expect(screen.getByText("Done")).toBeTruthy();

    act(() => { vi.advanceTimersByTime(4500); });
    expect(screen.queryByText("Done")).toBeNull();
  });

  it("throws if useToast is used outside provider", () => {
    const Bad = () => { useToast(); return null; };
    expect(() => render(<Bad />)).toThrow("useToast must be used within <ToastProvider>");
  });
});
