import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ModelSelector } from "./ModelSelector";

const models = [
  { value: "claude-4", label: "Claude 4 Opus", provider: "anthropic" as const },
  { value: "claude-4-sonnet", label: "Claude 4 Sonnet", provider: "anthropic" as const },
  { value: "gpt-4o", label: "GPT-4o", provider: "openai" as const },
  { value: "gpt-4-turbo", label: "GPT-4 Turbo", provider: "openai" as const },
  { value: "gemini-2", label: "Gemini 2.0 Flash", provider: "google" as const },
  { value: "llama-4", label: "Llama 4 Maverick", provider: "meta" as const },
  { value: "grok-3", label: "Grok 3", provider: "xai" as const },
];

const meta: Meta<typeof ModelSelector> = {
  title: "Agent/ModelSelector",
  component: ModelSelector,
};
export default meta;
type Story = StoryObj<typeof ModelSelector>;

export const Default: Story = {
  render: () => {
    const [val, setVal] = useState("");
    return (
      <div className="w-72">
        <ModelSelector models={models} value={val} onChange={setVal} />
      </div>
    );
  },
};
