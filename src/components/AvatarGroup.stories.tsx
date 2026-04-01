import type { Meta, StoryObj } from "@storybook/react";
import { AvatarGroup } from "./AvatarGroup";

const meta: Meta<typeof AvatarGroup> = {
  title: "Primitives/AvatarGroup",
  component: AvatarGroup,
};
export default meta;
type Story = StoryObj<typeof AvatarGroup>;

export const Default: Story = {
  args: {
    avatars: [
      { fallback: "Alice" },
      { fallback: "Bob" },
      { fallback: "Charlie" },
    ],
  },
};

export const WithOverflow: Story = {
  args: {
    avatars: [
      { fallback: "A" },
      { fallback: "B" },
      { fallback: "C" },
      { fallback: "D" },
      { fallback: "E" },
      { fallback: "F" },
      { fallback: "G" },
      { fallback: "H" },
    ],
    max: 4,
  },
};
