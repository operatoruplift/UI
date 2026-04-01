import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ToolCallCard } from "./ToolCallCard";

describe("ToolCallCard", () => {
  it("renders tool name", () => {
    render(<ToolCallCard toolName="bash" />);
    expect(screen.getByText("bash")).toBeTruthy();
  });

  it("shows input/output when expanded", () => {
    render(
      <ToolCallCard
        toolName="file_read"
        status="success"
        input={{ path: "/src/index.ts" }}
        output="file contents here"
        defaultExpanded
      />
    );
    expect(screen.getByText("Input")).toBeTruthy();
    expect(screen.getByText("Output")).toBeTruthy();
  });

  it("toggles expand on click", () => {
    render(
      <ToolCallCard toolName="grep" input={{ pattern: "foo" }} />
    );
    expect(screen.queryByText("Input")).toBeNull();
    fireEvent.click(screen.getByText("grep"));
    expect(screen.getByText("Input")).toBeTruthy();
  });

  it("shows duration", () => {
    render(<ToolCallCard toolName="bash" duration={245} />);
    expect(screen.getByText("245ms")).toBeTruthy();
  });
});
