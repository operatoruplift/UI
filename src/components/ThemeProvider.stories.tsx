import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, useTheme } from "./ThemeProvider";
import { Sun, Moon, Monitor } from "lucide-react";

const meta: Meta<typeof ThemeProvider> = {
  title: "Providers/ThemeProvider",
  component: ThemeProvider,
};
export default meta;
type Story = StoryObj<typeof ThemeProvider>;

const ThemeDemo = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400">Current: <span className="text-white font-mono">{theme}</span> (resolved: {resolvedTheme})</p>
      <div className="flex gap-2">
        <button onClick={() => setTheme("dark")} className={`px-3 py-1.5 rounded-sm text-sm ${theme === "dark" ? "bg-primary text-white" : "bg-white/5 text-gray-400"}`}>
          <Moon className="h-4 w-4 inline mr-1" /> Dark
        </button>
        <button onClick={() => setTheme("light")} className={`px-3 py-1.5 rounded-sm text-sm ${theme === "light" ? "bg-primary text-white" : "bg-white/5 text-gray-400"}`}>
          <Sun className="h-4 w-4 inline mr-1" /> Light
        </button>
        <button onClick={() => setTheme("system")} className={`px-3 py-1.5 rounded-sm text-sm ${theme === "system" ? "bg-primary text-white" : "bg-white/5 text-gray-400"}`}>
          <Monitor className="h-4 w-4 inline mr-1" /> System
        </button>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => (
    <ThemeProvider>
      <ThemeDemo />
    </ThemeProvider>
  ),
};
