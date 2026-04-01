import type { Meta, StoryObj } from "@storybook/react";
import { TokenCounter } from "./TokenCounter";

const meta: Meta<typeof TokenCounter> = {
  title: "Agent/TokenCounter",
  component: TokenCounter,
};
export default meta;
type Story = StoryObj<typeof TokenCounter>;

export const Compact: Story = {
  args: { inputTokens: 12500, outputTokens: 3200, compact: true },
};

export const WithBreakdown: Story = {
  args: {
    inputTokens: 45200,
    outputTokens: 12800,
    cacheReadTokens: 8500,
    cacheWriteTokens: 2100,
    showBreakdown: true,
  },
};

export const WithLimit: Story = {
  args: {
    inputTokens: 75000,
    outputTokens: 20000,
    maxTokens: 128000,
    showBreakdown: true,
  },
};

export const NearLimit: Story = {
  args: {
    inputTokens: 100000,
    outputTokens: 22000,
    maxTokens: 128000,
    showBreakdown: true,
  },
};
