import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./Card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card><CardContent>Hello</CardContent></Card>);
    expect(screen.getByText("Hello")).toBeTruthy();
  });

  it("applies default variant", () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstChild).toHaveClass("bg-card");
  });

  it("applies glass variant", () => {
    const { container } = render(<Card variant="glass">Content</Card>);
    expect(container.firstChild).toHaveClass("backdrop-blur-md");
  });

  it("renders full card structure", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );
    expect(screen.getByText("Title")).toBeTruthy();
    expect(screen.getByText("Body")).toBeTruthy();
    expect(screen.getByText("Footer")).toBeTruthy();
  });
});
