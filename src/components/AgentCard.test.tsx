import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AgentCard } from "./AgentCard";

describe("AgentCard", () => {
  it("renders agent name", () => {
    render(<AgentCard name="Code Bot" />);
    expect(screen.getByText("Code Bot")).toBeTruthy();
  });

  it("renders model badge", () => {
    render(<AgentCard name="Bot" model="Claude 4" />);
    expect(screen.getByText("Claude 4")).toBeTruthy();
  });

  it("renders description", () => {
    render(<AgentCard name="Bot" description="Does stuff" />);
    expect(screen.getByText("Does stuff")).toBeTruthy();
  });

  it("shows install button", () => {
    const onInstall = vi.fn();
    render(<AgentCard name="Bot" onInstall={onInstall} />);
    fireEvent.click(screen.getByText("Install"));
    expect(onInstall).toHaveBeenCalledTimes(1);
  });

  it("shows installed state", () => {
    render(<AgentCard name="Bot" onInstall={() => {}} installed />);
    expect(screen.getByText("Installed")).toBeTruthy();
  });

  it("renders default avatar from first letter", () => {
    const { container } = render(<AgentCard name="Zeta Agent" />);
    expect(container.textContent).toContain("Z");
  });
});
