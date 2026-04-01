import type { Meta, StoryObj } from "@storybook/react";
import { ChatBubble } from "./ChatBubble";

const meta: Meta<typeof ChatBubble> = {
  title: "Agent/ChatBubble",
  component: ChatBubble,
};
export default meta;
type Story = StoryObj<typeof ChatBubble>;

export const User: Story = {
  args: {
    role: "user",
    content: "Can you help me refactor this function?",
    timestamp: "2:34 PM",
    avatar: <span className="text-xs font-bold text-primary">JD</span>,
  },
};

export const Assistant: Story = {
  args: {
    role: "assistant",
    content: (
      <div>
        <p>Sure! Here's a refactored version:</p>
        <pre className="bg-black/40 rounded-lg p-3 mt-2 overflow-x-auto">
          <code className="text-primary text-xs">{`function greet(name: string) {\n  return \`Hello, \${name}!\`;\n}`}</code>
        </pre>
      </div>
    ),
    rawContent: "Sure! Here's a refactored version...",
    timestamp: "2:35 PM",
    avatar: <span className="text-xs font-bold text-white">AI</span>,
  },
};

export const Conversation: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[500px]">
      <ChatBubble
        role="user"
        content="What's the best way to handle errors in async functions?"
        avatar={<span className="text-xs font-bold text-primary">JD</span>}
      />
      <ChatBubble
        role="assistant"
        content={<p>Use try/catch blocks with async/await. For unhandled rejections, add a global handler.</p>}
        rawContent="Use try/catch blocks with async/await."
        avatar={<span className="text-xs font-bold text-white">AI</span>}
      />
      <ChatBubble
        role="user"
        content="Can you show me an example?"
        avatar={<span className="text-xs font-bold text-primary">JD</span>}
      />
    </div>
  ),
};
