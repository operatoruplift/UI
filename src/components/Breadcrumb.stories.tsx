import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "./Breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Primitives/Breadcrumb",
  component: Breadcrumb,
};
export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  args: {
    items: [
      { label: "Home", onClick: () => {} },
      { label: "Agents", onClick: () => {} },
      { label: "Code Review Agent" },
    ],
  },
};

export const WithCustomSeparator: Story = {
  args: {
    items: [
      { label: "Dashboard", onClick: () => {} },
      { label: "Sessions", onClick: () => {} },
      { label: "Session #42" },
    ],
    separator: <span>/</span>,
  },
};
