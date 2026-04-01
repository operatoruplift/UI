import type { Meta, StoryObj } from "@storybook/react";
import { MemoryPanel } from "./MemoryPanel";
import type { MemoryEntry } from "@/hooks/memory/types";

const meta: Meta<typeof MemoryPanel> = {
  title: "Agent/MemoryPanel",
  component: MemoryPanel,
};
export default meta;
type Story = StoryObj<typeof MemoryPanel>;

const entries: MemoryEntry[] = [
  {
    id: "mem_1",
    name: "User is a senior engineer",
    description: "Senior full-stack engineer focused on Operator Uplift apps",
    type: "user",
    path: "user_senior_engineer.md",
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: "mem_2",
    name: "Don't add trailing summaries",
    description: "User wants terse responses, skip recaps after changes",
    type: "feedback",
    path: "feedback_no_summaries.md",
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "mem_3",
    name: "Merge freeze after April 5",
    description: "Non-critical merges frozen after 2026-04-05 for mobile release cut",
    type: "project",
    path: "project_merge_freeze.md",
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "mem_4",
    name: "Linear project INGEST",
    description: "Pipeline bugs are tracked in Linear project INGEST",
    type: "reference",
    path: "reference_linear_ingest.md",
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: "mem_5",
    name: "Use real DB in integration tests",
    description: "Integration tests must hit a real database, not mocks",
    type: "feedback",
    path: "feedback_real_db_tests.md",
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
];

const topicContents: Record<string, string> = {
  mem_1: "User is a senior full-stack engineer with deep expertise in React, TypeScript, and Tailwind CSS. Currently focused on building the Operator Uplift shared UI component library.",
  mem_2: "Don't summarize what you just did at the end of every response.\n\n**Why:** User can read the diff themselves.\n**How to apply:** End responses after the last meaningful action.",
  mem_3: "Non-critical merges frozen after 2026-04-05 for mobile release cut.\n\n**Why:** Mobile team cutting release branch.\n**How to apply:** Flag any non-critical PR work scheduled after that date.",
  mem_4: "Pipeline bugs are tracked in Linear project INGEST.\n\n**How to apply:** When user references pipeline issues, check this Linear project for context.",
  mem_5: "Integration tests must hit a real database, not mocks.\n\n**Why:** Prior incident where mock/prod divergence masked a broken migration.\n**How to apply:** When writing integration tests, always use test DB, never mock the database layer.",
};

export const Default: Story = {
  args: {
    entries,
    count: entries.length,
    onFetchTopic: async (entry) => {
      await new Promise((r) => setTimeout(r, 300)); // simulate fetch
      return topicContents[entry.id] ?? null;
    },
    onEdit: () => {},
    onDelete: () => {},
    onCreate: () => {},
  },
};

export const Empty: Story = {
  args: {
    entries: [],
    count: 0,
    onCreate: () => {},
  },
};

export const AtCapacity: Story = {
  args: {
    entries,
    count: 200,
    atCapacity: true,
  },
};
