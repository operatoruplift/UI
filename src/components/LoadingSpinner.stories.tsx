import type { Meta, StoryObj } from "@storybook/react";
import { LoadingSpinner } from "./LoadingSpinner";

const meta: Meta<typeof LoadingSpinner> = {
  title: "Primitives/LoadingSpinner",
  component: LoadingSpinner,
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
};
export default meta;
type Story = StoryObj<typeof LoadingSpinner>;

export const Default: Story = { args: {} };
export const WithLabel: Story = { args: { label: "Loading agents..." } };
export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg", label: "Processing..." } };
