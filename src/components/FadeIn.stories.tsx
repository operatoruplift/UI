import type { Meta, StoryObj } from "@storybook/react";
import { FadeIn } from "./FadeIn";

const meta: Meta<typeof FadeIn> = {
  title: "Effects/FadeIn",
  component: FadeIn,
  argTypes: {
    direction: { control: "select", options: ["up", "down", "left", "right", "none"] },
    delay: { control: { type: "number", min: 0, max: 2000, step: 100 } },
    duration: { control: { type: "number", min: 100, max: 2000, step: 100 } },
  },
};
export default meta;
type Story = StoryObj<typeof FadeIn>;

export const Default: Story = {
  render: () => (
    <FadeIn>
      <div className="rounded-lg border border-white/10 bg-card p-6 w-72">
        <h3 className="text-white font-semibold">Fade In</h3>
        <p className="text-sm text-gray-400 mt-1">This element fades in when scrolled into view.</p>
      </div>
    </FadeIn>
  ),
};

export const Staggered: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {[0, 100, 200, 300].map((delay) => (
        <FadeIn key={delay} delay={delay}>
          <div className="rounded-lg border border-white/10 bg-card p-4">
            <span className="text-white text-sm">Delay: {delay}ms</span>
          </div>
        </FadeIn>
      ))}
    </div>
  ),
};
