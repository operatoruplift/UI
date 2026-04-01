import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./Card";
import { Button } from "./Button";

const meta: Meta<typeof Card> = {
  title: "Primitives/Card",
  component: Card,
  argTypes: {
    variant: { control: "select", options: ["default", "glass", "glass-dark"] },
  },
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-400">Card content goes here.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const Glass: Story = {
  render: () => (
    <Card variant="glass" className="w-80">
      <CardHeader><CardTitle>Glass Card</CardTitle></CardHeader>
      <CardContent><p className="text-sm text-gray-400">Translucent glass effect with backdrop blur.</p></CardContent>
    </Card>
  ),
};

export const GlassDark: Story = {
  render: () => (
    <Card variant="glass-dark" className="w-80">
      <CardHeader><CardTitle>Glass Dark</CardTitle></CardHeader>
      <CardContent><p className="text-sm text-gray-400">Dark glass variant.</p></CardContent>
    </Card>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      {(["default", "glass", "glass-dark"] as const).map((v) => (
        <Card key={v} variant={v} className="w-60">
          <CardHeader><CardTitle>{v}</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-gray-400">Variant preview</p></CardContent>
        </Card>
      ))}
    </div>
  ),
};
