import type { Meta, StoryObj } from "@storybook/react";
import { SpotlightCard } from "./SpotlightCard";

const meta: Meta<typeof SpotlightCard> = {
  title: "Effects/SpotlightCard",
  component: SpotlightCard,
};
export default meta;
type Story = StoryObj<typeof SpotlightCard>;

export const Default: Story = {
  render: () => (
    <SpotlightCard className="w-72 p-6">
      <h3 className="text-lg font-semibold text-white">Spotlight Card</h3>
      <p className="mt-2 text-sm text-gray-400">Move your mouse over this card to see the spotlight effect.</p>
    </SpotlightCard>
  ),
};

export const CustomColor: Story = {
  render: () => (
    <SpotlightCard spotlightColor="rgba(59, 130, 246, 0.2)" className="w-72 p-6">
      <h3 className="text-lg font-semibold text-white">Blue Spotlight</h3>
      <p className="mt-2 text-sm text-gray-400">Custom blue glow color.</p>
    </SpotlightCard>
  ),
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      {["Feature A", "Feature B", "Feature C"].map((title) => (
        <SpotlightCard key={title} className="p-5">
          <h4 className="font-medium text-white">{title}</h4>
          <p className="mt-1 text-xs text-gray-400">Description text</p>
        </SpotlightCard>
      ))}
    </div>
  ),
};
