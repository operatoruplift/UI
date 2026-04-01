import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./Alert";

const meta: Meta<typeof Alert> = {
  title: "Primitives/Alert",
  component: Alert,
  argTypes: {
    variant: { control: "select", options: ["info", "success", "warning", "error"] },
  },
};
export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: { variant: "info", title: "Update available", children: "A new version of the agent is available. Update to get the latest features." },
};
export const Success: Story = {
  args: { variant: "success", title: "Agent deployed", children: "Your agent has been successfully deployed to production." },
};
export const Warning: Story = {
  args: { variant: "warning", title: "Rate limit warning", children: "You are approaching your API rate limit. Consider upgrading your plan." },
};
export const Error: Story = {
  args: { variant: "error", title: "Connection failed", children: "Unable to connect to the agent runtime. Check your network connection." },
};
export const Dismissible: Story = {
  args: { variant: "info", title: "Tip", children: "You can use ⌘K to open the command palette.", dismissible: true },
};
