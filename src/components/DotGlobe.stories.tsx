import type { Meta, StoryObj } from "@storybook/react";
import { DotGlobe } from "./DotGlobe";

const meta: Meta<typeof DotGlobe> = {
  title: "Effects/DotGlobe",
  component: DotGlobe,
  argTypes: {
    size: { control: { type: "range", min: 100, max: 500 } },
    dotCount: { control: { type: "range", min: 200, max: 2000 } },
    rotationSpeed: { control: { type: "range", min: 0.001, max: 0.01, step: 0.001 } },
  },
};
export default meta;
type Story = StoryObj<typeof DotGlobe>;

export const Default: Story = { args: { size: 300 } };
export const Small: Story = { args: { size: 150, dotCount: 400 } };
export const Large: Story = { args: { size: 400, dotCount: 1200 } };
export const CustomColor: Story = { args: { size: 300, dotColor: "#3b82f6" } };
