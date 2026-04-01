import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Select } from "./Select";

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "SolidJS" },
];

const meta: Meta<typeof Select> = {
  title: "Primitives/Select",
  component: Select,
};
export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => {
    const [val, setVal] = useState<string>("");
    return (
      <div className="w-64">
        <Select options={options} value={val} onChange={(v) => setVal(v as string)} placeholder="Pick a framework" />
      </div>
    );
  },
};

export const Searchable: Story = {
  render: () => {
    const [val, setVal] = useState<string>("");
    return (
      <div className="w-64">
        <Select options={options} value={val} onChange={(v) => setVal(v as string)} searchable placeholder="Search frameworks..." />
      </div>
    );
  },
};

export const MultiSelect: Story = {
  render: () => {
    const [val, setVal] = useState<string[]>([]);
    return (
      <div className="w-72">
        <Select options={options} value={val} onChange={(v) => setVal(v as string[])} multiple placeholder="Select frameworks" />
      </div>
    );
  },
};

export const WithError: Story = {
  render: () => (
    <div className="w-64">
      <Select options={options} error="Required field" placeholder="Pick one" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="w-64">
      <Select options={options} disabled placeholder="Disabled" />
    </div>
  ),
};
