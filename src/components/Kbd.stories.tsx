import type { Meta, StoryObj } from "@storybook/react";
import { Kbd, Shortcut } from "./Kbd";

const meta: Meta<typeof Kbd> = {
  title: "Primitives/Kbd",
  component: Kbd,
};
export default meta;
type Story = StoryObj<typeof Kbd>;

export const SingleKey: Story = { args: { children: "K" } };

export const Shortcuts: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 text-sm text-gray-400">
        <span>Command palette</span>
        <Shortcut keys="cmd+K" />
      </div>
      <div className="flex items-center gap-3 text-sm text-gray-400">
        <span>Save</span>
        <Shortcut keys="cmd+S" />
      </div>
      <div className="flex items-center gap-3 text-sm text-gray-400">
        <span>Search</span>
        <Shortcut keys="cmd+shift+F" />
      </div>
      <div className="flex items-center gap-3 text-sm text-gray-400">
        <span>Navigate up</span>
        <Shortcut keys="ctrl+up" />
      </div>
    </div>
  ),
};
