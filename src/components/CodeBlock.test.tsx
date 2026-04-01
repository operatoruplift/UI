import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CodeBlock } from "./CodeBlock";

describe("CodeBlock", () => {
  it("renders code content", () => {
    render(<CodeBlock code="const x = 1;" />);
    expect(screen.getByText("const x = 1;")).toBeTruthy();
  });

  it("shows filename header", () => {
    render(<CodeBlock code="hello" filename="test.ts" />);
    expect(screen.getByText("test.ts")).toBeTruthy();
  });

  it("shows line numbers when enabled", () => {
    render(<CodeBlock code={"line1\nline2\nline3"} showLineNumbers />);
    expect(screen.getByText("1")).toBeTruthy();
    expect(screen.getByText("3")).toBeTruthy();
  });
});
