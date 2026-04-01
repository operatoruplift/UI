import type { Meta, StoryObj } from "@storybook/react";
import { Divider } from "./Divider";

const meta: Meta<typeof Divider> = {
  title: "Primitives/Divider",
  component: Divider,
};
export default meta;
type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {
  render: () => (
    <div className="space-y-4 text-sm text-gray-400">
      <p>Content above</p>
      <Divider />
      <p>Content below</p>
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-4 text-sm text-gray-400">
      <p>Content above</p>
      <Divider label="or" />
      <p>Content below</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex items-center gap-4 h-8">
      <span className="text-sm text-gray-400">Left</span>
      <Divider orientation="vertical" />
      <span className="text-sm text-gray-400">Right</span>
    </div>
  ),
};
