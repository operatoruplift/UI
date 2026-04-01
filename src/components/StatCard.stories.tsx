import type { Meta, StoryObj } from "@storybook/react";
import { Zap, Users, Activity } from "lucide-react";
import { StatCard } from "./StatCard";

const meta: Meta<typeof StatCard> = {
  title: "Data Display/StatCard",
  component: StatCard,
};
export default meta;
type Story = StoryObj<typeof StatCard>;

export const Default: Story = {
  args: { label: "Total Agents", value: "24", icon: <Zap className="h-5 w-5" /> },
};

export const WithPositiveChange: Story = {
  args: { label: "Active Users", value: "1,234", icon: <Users className="h-5 w-5" />, change: { value: 12.5, label: "vs last month" } },
};

export const WithNegativeChange: Story = {
  args: { label: "Error Rate", value: "3.2%", icon: <Activity className="h-5 w-5" />, change: { value: -8.1, label: "vs last week" } },
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-[700px]">
      <StatCard label="Agents" value="24" icon={<Zap className="h-5 w-5" />} change={{ value: 5, label: "this week" }} />
      <StatCard label="Users" value="1.2K" icon={<Users className="h-5 w-5" />} change={{ value: -2, label: "today" }} />
      <StatCard label="Uptime" value="99.9%" icon={<Activity className="h-5 w-5" />} />
    </div>
  ),
};
