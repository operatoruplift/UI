import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./Avatar";

const meta: Meta<typeof Avatar> = {
  title: "Primitives/Avatar",
  component: Avatar,
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    status: { control: "select", options: ["online", "offline", "busy", "away", undefined] },
  },
};
export default meta;
type Story = StoryObj<typeof Avatar>;

export const WithImage: Story = {
  args: { src: "https://i.pravatar.cc/150?img=1", alt: "User", size: "md" },
};

export const WithFallback: Story = {
  args: { fallback: "John Doe", size: "md" },
};

export const WithStatus: Story = {
  args: { fallback: "Jane Smith", size: "lg", status: "online" },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      <Avatar fallback="XS" size="xs" />
      <Avatar fallback="SM" size="sm" />
      <Avatar fallback="MD" size="md" />
      <Avatar fallback="LG" size="lg" />
      <Avatar fallback="XL" size="xl" />
    </div>
  ),
};

export const Statuses: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar fallback="On" size="lg" status="online" />
      <Avatar fallback="Of" size="lg" status="offline" />
      <Avatar fallback="Bu" size="lg" status="busy" />
      <Avatar fallback="Aw" size="lg" status="away" />
    </div>
  ),
};
