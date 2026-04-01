import type { Meta, StoryObj } from "@storybook/react";
import { SessionIndicator } from "./SessionIndicator";

const meta: Meta<typeof SessionIndicator> = {
  title: "Agent/SessionIndicator",
  component: SessionIndicator,
  argTypes: { count: { control: { type: "number", min: 0, max: 100 } } },
};
export default meta;
type Story = StoryObj<typeof SessionIndicator>;

export const Active: Story = { args: { count: 3 } };
export const Single: Story = { args: { count: 1 } };
export const None: Story = { args: { count: 0 } };
