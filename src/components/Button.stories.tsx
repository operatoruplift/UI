import type { Meta, StoryObj } from "@storybook/react";
import { Zap, Send, Trash2 } from "lucide-react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Primitives/Button",
  component: Button,
  argTypes: {
    variant: { control: "select", options: ["primary", "outline", "ghost", "danger"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { children: "Primary Button", variant: "primary" } };
export const Outline: Story = { args: { children: "Outline", variant: "outline" } };
export const Ghost: Story = { args: { children: "Ghost", variant: "ghost" } };
export const Danger: Story = { args: { children: "Delete", variant: "danger", icon: <Trash2 className="h-4 w-4" /> } };
export const Small: Story = { args: { children: "Small", size: "sm" } };
export const Large: Story = { args: { children: "Large", size: "lg" } };
export const Loading: Story = { args: { children: "Saving...", loading: true } };
export const WithIcon: Story = { args: { children: "Deploy", icon: <Zap className="h-4 w-4" /> } };
export const IconRight: Story = { args: { children: "Send", icon: <Send className="h-4 w-4" />, iconPosition: "right" } };
export const Disabled: Story = { args: { children: "Disabled", disabled: true } };

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
