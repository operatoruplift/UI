import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  it("renders determinate progress", () => {
    render(<ProgressBar value={75} label="Upload" />);
    expect(screen.getByText("Upload")).toBeTruthy();
    expect(screen.getByText("75%")).toBeTruthy();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "75");
  });

  it("clamps value to 0-100", () => {
    render(<ProgressBar value={150} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });

  it("renders indeterminate when no value", () => {
    render(<ProgressBar label="Loading" />);
    expect(screen.getByText("Loading")).toBeTruthy();
    expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-valuenow");
  });
});
