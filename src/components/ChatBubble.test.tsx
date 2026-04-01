import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ChatBubble } from "./ChatBubble";

describe("ChatBubble", () => {
  it("renders user message", () => {
    render(<ChatBubble role="user" content="Hello" />);
    expect(screen.getByText("Hello")).toBeTruthy();
  });

  it("renders assistant message", () => {
    render(<ChatBubble role="assistant" content="Hi there" />);
    expect(screen.getByText("Hi there")).toBeTruthy();
  });

  it("applies user styling", () => {
    const { container } = render(<ChatBubble role="user" content="Test" />);
    expect(container.querySelector(".bg-primary\\/20")).toBeTruthy();
  });

  it("renders timestamp", () => {
    render(<ChatBubble role="user" content="Msg" timestamp="3:45 PM" />);
    expect(screen.getByText("3:45 PM")).toBeTruthy();
  });

  it("renders avatar", () => {
    render(<ChatBubble role="user" content="Msg" avatar={<span data-testid="av">JD</span>} />);
    expect(screen.getByTestId("av")).toBeTruthy();
  });
});
