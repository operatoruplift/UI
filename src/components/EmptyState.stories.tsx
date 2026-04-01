import type { Meta, StoryObj } from "@storybook/react";
import { Inbox, Search } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { Button } from "./Button";

const meta: Meta<typeof EmptyState> = {
  title: "Data Display/EmptyState",
  component: EmptyState,
};
export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    icon: <Inbox className="h-8 w-8" />,
    title: "No agents yet",
    message: "Get started by installing your first agent from the marketplace.",
    action: <Button>Browse Agents</Button>,
  },
};

export const NoResults: Story = {
  args: {
    icon: <Search className="h-8 w-8" />,
    title: "No results found",
    message: "Try adjusting your search or filter criteria.",
  },
};
