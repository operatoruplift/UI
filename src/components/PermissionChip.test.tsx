import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PermissionChip } from "./PermissionChip";

describe("PermissionChip", () => {
  it("renders label", () => {
    render(<PermissionChip icon={<span>🌐</span>} label="Network" />);
    expect(screen.getByText("Network")).toBeTruthy();
  });

  it("shows granted style by default", () => {
    const { container } = render(<PermissionChip icon={<span>📁</span>} label="Files" />);
    expect(container.firstChild).toHaveClass("text-green-400");
  });

  it("shows denied style", () => {
    const { container } = render(<PermissionChip icon={<span>🔒</span>} label="Shell" granted={false} />);
    expect(container.firstChild).toHaveClass("text-gray-500");
  });
});
