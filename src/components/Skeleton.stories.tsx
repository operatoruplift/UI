import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "./Skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Data Display/Skeleton",
  component: Skeleton,
  argTypes: {
    variant: { control: "select", options: ["text", "circular", "rectangular"] },
  },
};
export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Text: Story = { args: { variant: "text", width: 200 } };
export const Circular: Story = { args: { variant: "circular", width: 48, height: 48 } };
export const Rectangular: Story = { args: { variant: "rectangular", width: 300, height: 120 } };

export const CardSkeleton: Story = {
  render: () => (
    <div className="w-72 rounded-lg border border-white/5 bg-card p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton variant="rectangular" height={80} />
      <Skeleton variant="text" width="80%" />
    </div>
  ),
};
