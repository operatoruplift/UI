import type { Meta, StoryObj } from "@storybook/react";
import { CodeBlock } from "./CodeBlock";

const meta: Meta<typeof CodeBlock> = {
  title: "Data Display/CodeBlock",
  component: CodeBlock,
};
export default meta;
type Story = StoryObj<typeof CodeBlock>;

const sampleCode = `import { Button } from "@operatoruplift/ui";

export function App() {
  return (
    <Button variant="primary" onClick={() => alert("Hello!")}>
      Click me
    </Button>
  );
}`;

export const Default: Story = {
  args: { code: sampleCode, language: "tsx" },
};

export const WithFilename: Story = {
  args: { code: sampleCode, filename: "App.tsx" },
};

export const WithLineNumbers: Story = {
  args: { code: sampleCode, filename: "App.tsx", showLineNumbers: true },
};

export const WithMaxHeight: Story = {
  args: {
    code: Array.from({ length: 50 }, (_, i) => `console.log("line ${i + 1}");`).join("\n"),
    showLineNumbers: true,
    maxHeight: 200,
  },
};
