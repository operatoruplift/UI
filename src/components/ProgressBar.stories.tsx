import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBar } from "./ProgressBar";

const meta: Meta<typeof ProgressBar> = {
  title: "Data Display/ProgressBar",
  component: ProgressBar,
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    height: { control: "select", options: ["sm", "md", "lg"] },
  },
};
export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = { args: { value: 65 } };
export const WithLabel: Story = { args: { value: 75, label: "Upload progress" } };
export const Small: Story = { args: { value: 40, height: "sm" } };
export const Large: Story = { args: { value: 90, height: "lg" } };
export const Indeterminate: Story = { args: { label: "Loading..." } };

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <ProgressBar value={60} height="sm" label="Small" />
      <ProgressBar value={60} height="md" label="Medium" />
      <ProgressBar value={60} height="lg" label="Large" />
    </div>
  ),
};
