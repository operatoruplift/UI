import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TokenCounter } from "./TokenCounter";

describe("TokenCounter", () => {
  it("renders compact mode", () => {
    render(<TokenCounter inputTokens={1500} outputTokens={500} compact />);
    expect(screen.getByText("2.0K tokens")).toBeTruthy();
  });

  it("renders with breakdown", () => {
    render(
      <TokenCounter
        inputTokens={10000}
        outputTokens={3000}
        cacheReadTokens={500}
        showBreakdown
      />
    );
    expect(screen.getByText("Input")).toBeTruthy();
    expect(screen.getByText("Output")).toBeTruthy();
    expect(screen.getByText("Cache read")).toBeTruthy();
  });

  it("shows progress bar with max", () => {
    render(<TokenCounter inputTokens={50000} outputTokens={10000} maxTokens={100000} />);
    expect(screen.getByText(/60.0K/)).toBeTruthy();
    expect(screen.getByText(/100.0K/)).toBeTruthy();
  });
});
