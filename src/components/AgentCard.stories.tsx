import type { Meta, StoryObj } from "@storybook/react";
import { AgentCard } from "./AgentCard";

const meta: Meta<typeof AgentCard> = {
  title: "Agent/AgentCard",
  component: AgentCard,
};
export default meta;
type Story = StoryObj<typeof AgentCard>;

export const Running: Story = {
  args: {
    name: "Code Review Agent",
    status: "running",
    model: "Claude 4",
    description: "Automatically reviews pull requests and suggests improvements.",
    onInstall: () => {},
  },
};

export const Idle: Story = {
  args: {
    name: "Research Bot",
    status: "idle",
    model: "GPT-4o",
    description: "Searches the web and summarizes findings.",
    onInstall: () => {},
  },
};

export const Error: Story = {
  args: {
    name: "Deploy Agent",
    status: "error",
    model: "Gemini 2",
    description: "Handles CI/CD pipeline automation.",
    onInstall: () => {},
  },
};

export const Installed: Story = {
  args: {
    name: "Test Runner",
    status: "running",
    model: "Claude 4",
    description: "Runs test suites automatically.",
    onInstall: () => {},
    installed: true,
  },
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-[600px]">
      <AgentCard name="Code Review" status="running" model="Claude 4" description="Reviews PRs" onInstall={() => {}} />
      <AgentCard name="Research Bot" status="idle" model="GPT-4o" description="Web research" onInstall={() => {}} installed />
      <AgentCard name="Deploy Agent" status="error" model="Gemini 2" description="CI/CD automation" onInstall={() => {}} />
      <AgentCard name="Docs Writer" status="idle" model="Claude 4" description="Documentation" onInstall={() => {}} />
    </div>
  ),
};
