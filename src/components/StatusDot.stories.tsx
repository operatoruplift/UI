import type { Meta, StoryObj } from "@storybook/react";
import { StatusDot } from "./StatusDot";

const meta: Meta<typeof StatusDot> = {
  title: "Data Display/StatusDot",
  component: StatusDot,
  argTypes: {
    status: { control: "select", options: ["online", "offline", "busy", "away", "running", "error", "idle"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
};
export default meta;
type Story = StoryObj<typeof StatusDot>;

export const Default: Story = { args: { status: "online", label: "Connected" } };

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <StatusDot status="online" label="Online" />
      <StatusDot status="running" label="Running" />
      <StatusDot status="idle" label="Idle" />
      <StatusDot status="away" label="Away" />
      <StatusDot status="busy" label="Busy" />
      <StatusDot status="error" label="Error" />
      <StatusDot status="offline" label="Offline" />
    </div>
  ),
};
