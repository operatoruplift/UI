import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "./Header";
import { Button } from "./Button";

const meta: Meta<typeof Header> = {
  title: "Layout/Header",
  component: Header,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  render: () => (
    <Header
      logo={<span className="text-primary font-bold">Operator Uplift</span>}
      navLinks={[
        { label: "Dashboard", active: true },
        { label: "Agents" },
        { label: "Docs" },
      ]}
      actions={<Button size="sm" variant="outline">Feedback</Button>}
      userMenu={
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary font-bold">
          JD
        </div>
      }
    />
  ),
};
