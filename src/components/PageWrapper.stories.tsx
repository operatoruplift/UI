import type { Meta, StoryObj } from "@storybook/react";
import { PageWrapper } from "./PageWrapper";

const meta: Meta<typeof PageWrapper> = {
  title: "Layout/PageWrapper",
  component: PageWrapper,
  parameters: { layout: "fullscreen" },
  argTypes: {
    maxWidth: { control: "select", options: ["sm", "md", "lg", "xl", "2xl", "full"] },
  },
};
export default meta;
type Story = StoryObj<typeof PageWrapper>;

export const Default: Story = {
  render: () => (
    <PageWrapper>
      <div className="rounded-lg border border-white/10 p-8 text-center text-gray-400">
        Page content goes here (max-width: xl)
      </div>
    </PageWrapper>
  ),
};
