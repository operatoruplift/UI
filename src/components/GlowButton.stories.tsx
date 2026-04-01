import type { Meta, StoryObj } from "@storybook/react";
import { Zap } from "lucide-react";
import { GlowButton } from "./GlowButton";

const meta: Meta<typeof GlowButton> = {
  title: "Effects/GlowButton",
  component: GlowButton,
};
export default meta;
type Story = StoryObj<typeof GlowButton>;

export const Default: Story = { args: { children: "Get Started" } };

export const WithIcon: Story = {
  render: () => (
    <GlowButton>
      <Zap className="h-4 w-4" />
      Launch Agent
    </GlowButton>
  ),
};

export const CustomGlow: Story = {
  args: { children: "Blue Glow", glowColor: "#3b82f6" },
};
