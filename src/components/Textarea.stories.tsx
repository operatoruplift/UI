import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "Primitives/Textarea",
  component: Textarea,
};
export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: { placeholder: "Type your message...", rows: 3 },
};

export const WithLabel: Story = {
  args: { label: "System Prompt", placeholder: "You are a helpful assistant...", rows: 4 },
};

export const WithError: Story = {
  args: { label: "Description", error: "Description is required", rows: 3 },
};

export const AutoResize: Story = {
  args: { placeholder: "This textarea auto-resizes as you type...", autoResize: true, maxRows: 8 },
};
