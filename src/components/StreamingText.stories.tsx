import type { Meta, StoryObj } from "@storybook/react";
import { StreamingText } from "./StreamingText";

const meta: Meta<typeof StreamingText> = {
  title: "Effects/StreamingText",
  component: StreamingText,
};
export default meta;
type Story = StoryObj<typeof StreamingText>;

export const Default: Story = {
  args: {
    text: "Hello! I'm an AI assistant. I can help you with coding, debugging, and building applications. How can I help you today?",
    speed: 2,
    interval: 30,
    className: "text-sm text-gray-300",
  },
};

export const Fast: Story = {
  args: {
    text: "This text streams very quickly, simulating a fast model response.",
    speed: 5,
    interval: 15,
    className: "text-sm text-gray-300",
  },
};

export const NoCursor: Story = {
  args: {
    text: "Streaming text without the cursor indicator.",
    showCursor: false,
    className: "text-sm text-gray-300",
  },
};
