import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Toggle } from "./Toggle";

const meta: Meta<typeof Toggle> = {
  title: "Primitives/Toggle",
  component: Toggle,
};
export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  render: () => {
    const [on, setOn] = useState(false);
    return <Toggle checked={on} onChange={setOn} label="Toggle" />;
  },
};

export const On: Story = {
  render: () => {
    const [on, setOn] = useState(true);
    return <Toggle checked={on} onChange={setOn} label="Toggle on" />;
  },
};

export const Disabled: Story = {
  args: { checked: false, disabled: true },
};

export const WithLabel: Story = {
  render: () => {
    const [on, setOn] = useState(false);
    return (
      <label className="flex items-center gap-3 text-sm text-white cursor-pointer">
        <Toggle checked={on} onChange={setOn} />
        Enable notifications
      </label>
    );
  },
};
