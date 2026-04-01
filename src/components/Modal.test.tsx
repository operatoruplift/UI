import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("renders nothing when closed", () => {
    render(<Modal open={false} onClose={() => {}}>Content</Modal>);
    expect(screen.queryByText("Content")).toBeNull();
  });

  it("renders content when open", () => {
    render(<Modal open onClose={() => {}}>Content</Modal>);
    expect(screen.getByText("Content")).toBeTruthy();
  });

  it("renders title and description", () => {
    render(
      <Modal open onClose={() => {}} title="My Title" description="My Desc">
        Body
      </Modal>
    );
    expect(screen.getByText("My Title")).toBeTruthy();
    expect(screen.getByText("My Desc")).toBeTruthy();
  });

  it("calls onClose when Escape is pressed", () => {
    const onClose = vi.fn();
    render(<Modal open onClose={onClose}>Content</Modal>);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(<Modal open onClose={onClose}>Content</Modal>);
    fireEvent.click(screen.getByLabelText("Close"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose on backdrop click", () => {
    const onClose = vi.fn();
    const { container } = render(<Modal open onClose={onClose}>Content</Modal>);
    const backdrop = container.querySelector(".backdrop-blur-sm")!;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close on backdrop when closeOnBackdrop is false", () => {
    const onClose = vi.fn();
    const { container } = render(
      <Modal open onClose={onClose} closeOnBackdrop={false}>Content</Modal>
    );
    const backdrop = container.querySelector(".backdrop-blur-sm")!;
    fireEvent.click(backdrop);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("renders footer", () => {
    render(
      <Modal open onClose={() => {}} footer={<button>Save</button>}>
        Body
      </Modal>
    );
    expect(screen.getByText("Save")).toBeTruthy();
  });
});
