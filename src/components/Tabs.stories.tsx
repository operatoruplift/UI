import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./Tabs";
import { Home, Settings, Bell } from "lucide-react";

const meta: Meta<typeof Tabs> = {
  title: "Primitives/Tabs",
  component: Tabs,
  argTypes: {
    variant: { control: "select", options: ["default", "pills", "underline"] },
  },
};
export default meta;
type Story = StoryObj<typeof Tabs>;

const tabs = [
  { id: "overview", label: "Overview", icon: <Home className="h-4 w-4" />, content: <p className="text-gray-400">Overview content here</p> },
  { id: "settings", label: "Settings", icon: <Settings className="h-4 w-4" />, content: <p className="text-gray-400">Settings content here</p> },
  { id: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" />, content: <p className="text-gray-400">Notifications content</p> },
];

export const Default: Story = { args: { tabs, variant: "default" } };
export const Pills: Story = { args: { tabs, variant: "pills" } };
export const Underline: Story = { args: { tabs, variant: "underline" } };
