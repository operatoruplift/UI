import type { Meta, StoryObj } from "@storybook/react";
import { ConversationThread, type ConversationItem } from "./ConversationThread";

const meta: Meta<typeof ConversationThread> = {
  title: "Agent/ConversationThread",
  component: ConversationThread,
};
export default meta;
type Story = StoryObj<typeof ConversationThread>;

const items: ConversationItem[] = [
  { type: "message", props: { role: "user", content: "Add a dark mode toggle to the header component." } },
  { type: "message", props: { role: "assistant", content: "I'll add a dark mode toggle to the Header component. Let me first read the current implementation." } },
  { type: "tool_call", props: { toolName: "file_read", status: "success", duration: 12, input: { path: "src/components/Header.tsx" } } },
  { type: "tool_call", props: { toolName: "file_edit", status: "success", duration: 45, input: { path: "src/components/Header.tsx" } } },
  { type: "message", props: { role: "assistant", content: "Done! I've added a dark mode toggle button to the Header component. It uses the `useTheme` hook and renders a sun/moon icon." } },
];

export const Default: Story = {
  args: { items },
};
