import type { Meta, StoryObj } from "@storybook/react";
import { ToolCallCard } from "./ToolCallCard";

const meta: Meta<typeof ToolCallCard> = {
  title: "Agent/ToolCallCard",
  component: ToolCallCard,
  argTypes: {
    status: { control: "select", options: ["pending", "running", "success", "error"] },
  },
};
export default meta;
type Story = StoryObj<typeof ToolCallCard>;

export const Running: Story = {
  args: {
    toolName: "file_read",
    status: "running",
    input: { path: "/src/components/Button.tsx" },
    defaultExpanded: true,
  },
};

export const Success: Story = {
  args: {
    toolName: "bash",
    status: "success",
    duration: 245,
    input: { command: "npm test" },
    output: "All 90 tests passed.",
    defaultExpanded: true,
  },
};

export const Error: Story = {
  args: {
    toolName: "web_fetch",
    status: "error",
    duration: 3200,
    input: { url: "https://api.example.com/data" },
    output: "Error: Request timeout after 3000ms",
    defaultExpanded: true,
  },
};

export const Collapsed: Story = {
  args: {
    toolName: "grep",
    status: "success",
    duration: 12,
    input: { pattern: "useEffect", path: "src/" },
  },
};
