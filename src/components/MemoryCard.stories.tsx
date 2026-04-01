import type { Meta, StoryObj } from "@storybook/react";
import { MemoryCard } from "./MemoryCard";
import type { MemoryEntry } from "@/hooks/memory/types";

const meta: Meta<typeof MemoryCard> = {
  title: "Agent/MemoryCard",
  component: MemoryCard,
};
export default meta;
type Story = StoryObj<typeof MemoryCard>;

const entry: MemoryEntry = {
  id: "mem_1",
  name: "User is a senior engineer",
  description: "Senior full-stack engineer working on Operator Uplift apps",
  type: "user",
  path: "user_senior_engineer.md",
  updatedAt: new Date(Date.now() - 3600000).toISOString(),
  createdAt: new Date(Date.now() - 86400000).toISOString(),
};

export const Collapsed: Story = {
  args: { entry },
};

export const WithContent: Story = {
  args: {
    entry,
    content: "User is a senior full-stack engineer with deep expertise in React, TypeScript, and Tailwind CSS. Currently focused on building the Operator Uplift shared UI component library.\n\n**Why:** Tailor code explanations to advanced level, skip basics.\n**How to apply:** Use advanced patterns, avoid over-explaining.",
  },
};

export const FeedbackType: Story = {
  args: {
    entry: {
      ...entry,
      id: "mem_2",
      name: "Don't add trailing summaries",
      description: "User wants terse responses, no trailing summaries after code changes",
      type: "feedback",
      path: "feedback_no_summaries.md",
    },
    content: "Don't summarize what you just did at the end of every response.\n\n**Why:** User can read the diff themselves.\n**How to apply:** End responses after the last meaningful action, no recap.",
  },
};

export const ProjectType: Story = {
  args: {
    entry: {
      ...entry,
      id: "mem_3",
      name: "Merge freeze after April 5",
      description: "Non-critical merges frozen after 2026-04-05 for mobile release",
      type: "project",
      path: "project_merge_freeze.md",
    },
  },
};

export const ReferenceType: Story = {
  args: {
    entry: {
      ...entry,
      id: "mem_4",
      name: "Linear project INGEST",
      description: "Pipeline bugs tracked in Linear project INGEST",
      type: "reference",
      path: "reference_linear_ingest.md",
    },
  },
};
