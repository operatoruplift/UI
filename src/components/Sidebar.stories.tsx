import type { Meta, StoryObj } from "@storybook/react";
import { Home, MessageSquare, Settings, Users, Zap } from "lucide-react";
import { Sidebar } from "./Sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "Layout/Sidebar",
  component: Sidebar,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof Sidebar>;

const sections = [
  {
    title: "Main",
    items: [
      { id: "home", label: "Home", icon: <Home className="h-4 w-4" />, active: true },
      { id: "agents", label: "Agents", icon: <Zap className="h-4 w-4" /> },
      { id: "chat", label: "Chat", icon: <MessageSquare className="h-4 w-4" /> },
    ],
  },
  {
    title: "Account",
    items: [
      { id: "team", label: "Team", icon: <Users className="h-4 w-4" /> },
      { id: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
    ],
  },
];

export const Default: Story = {
  render: () => (
    <div className="h-[500px]">
      <Sidebar sections={sections} header={<span className="text-sm font-bold text-white">Uplift</span>} />
    </div>
  ),
};

export const Collapsed: Story = {
  render: () => (
    <div className="h-[500px]">
      <Sidebar sections={sections} collapsed />
    </div>
  ),
};
