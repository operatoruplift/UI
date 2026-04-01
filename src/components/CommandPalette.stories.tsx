import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { CommandPalette } from "./CommandPalette";
import { Search, Settings, User, Home, Zap, FileText } from "lucide-react";

const meta: Meta<typeof CommandPalette> = {
  title: "Layout/CommandPalette",
  component: CommandPalette,
};
export default meta;
type Story = StoryObj<typeof CommandPalette>;

const items = [
  { id: "home", label: "Go to Dashboard", icon: <Home className="h-4 w-4" />, group: "Navigation", shortcut: "⌘H", onSelect: () => {} },
  { id: "agents", label: "Browse Agents", icon: <Zap className="h-4 w-4" />, group: "Navigation", onSelect: () => {} },
  { id: "settings", label: "Open Settings", icon: <Settings className="h-4 w-4" />, group: "Navigation", shortcut: "⌘,", onSelect: () => {} },
  { id: "search", label: "Search Agents", description: "Find agents by name or capability", icon: <Search className="h-4 w-4" />, group: "Actions", onSelect: () => {} },
  { id: "profile", label: "Edit Profile", icon: <User className="h-4 w-4" />, group: "Actions", onSelect: () => {} },
  { id: "docs", label: "Documentation", icon: <FileText className="h-4 w-4" />, group: "Help", onSelect: () => {} },
];

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div>
        <button onClick={() => setOpen(true)} className="px-4 py-2 rounded-sm bg-white/10 text-white text-sm">
          Open Command Palette (⌘K)
        </button>
        <CommandPalette open={open} onClose={() => setOpen(false)} items={items} />
      </div>
    );
  },
};
