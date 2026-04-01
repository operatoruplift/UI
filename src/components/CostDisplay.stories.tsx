import type { Meta, StoryObj } from "@storybook/react";
import { CostDisplay } from "./CostDisplay";

const meta: Meta<typeof CostDisplay> = {
  title: "Agent/CostDisplay",
  component: CostDisplay,
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
};
export default meta;
type Story = StoryObj<typeof CostDisplay>;

export const Default: Story = { args: { cost: 1.47, label: "Session Cost" } };
export const Small: Story = { args: { cost: 0.003, size: "sm" } };
export const Large: Story = { args: { cost: 24.50, label: "Monthly Spend", size: "lg" } };
export const WithChange: Story = {
  args: { cost: 12.50, previousCost: 10.00, label: "This Week" },
};
export const WithDecrease: Story = {
  args: { cost: 8.20, previousCost: 12.50, label: "This Week" },
};
