import type { Meta, StoryObj } from "@storybook/react";
import { Dropdown } from "./Dropdown";
import { Settings, LogOut, User, Moon } from "lucide-react";

const meta: Meta<typeof Dropdown> = {
  title: "Primitives/Dropdown",
  component: Dropdown,
};
export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  args: {
    trigger: <button className="px-3 py-1.5 text-sm rounded-sm border border-white/10 text-white hover:bg-white/5">Menu</button>,
    items: [
      { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
      { id: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
      { id: "theme", label: "Dark Mode", icon: <Moon className="h-4 w-4" /> },
      { id: "divider", label: "", divider: true },
      { id: "logout", label: "Sign Out", icon: <LogOut className="h-4 w-4" />, danger: true },
    ],
  },
};
