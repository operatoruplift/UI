import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./Tooltip";
import { Button } from "./Button";

const meta: Meta<typeof Tooltip> = {
  title: "Primitives/Tooltip",
  component: Tooltip,
  argTypes: {
    side: { control: "select", options: ["top", "bottom", "left", "right"] },
  },
};
export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Top: Story = {
  render: () => (
    <Tooltip content="Tooltip on top" side="top">
      <Button variant="outline">Hover me</Button>
    </Tooltip>
  ),
};

export const Bottom: Story = {
  render: () => (
    <Tooltip content="Tooltip on bottom" side="bottom">
      <Button variant="outline">Hover me</Button>
    </Tooltip>
  ),
};

export const Left: Story = {
  render: () => (
    <Tooltip content="Left tooltip" side="left">
      <Button variant="outline">Hover me</Button>
    </Tooltip>
  ),
};

export const Right: Story = {
  render: () => (
    <Tooltip content="Right tooltip" side="right">
      <Button variant="outline">Hover me</Button>
    </Tooltip>
  ),
};

export const AllSides: Story = {
  render: () => (
    <div className="flex gap-6 p-12">
      {(["top", "bottom", "left", "right"] as const).map((side) => (
        <Tooltip key={side} content={`${side} tooltip`} side={side}>
          <Button variant="outline" size="sm">{side}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};
