import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Table } from "./Table";
import { Badge } from "./Badge";

const meta: Meta = {
  title: "Data Display/Table",
};
export default meta;
type Story = StoryObj;

interface Agent {
  id: string;
  name: string;
  status: string;
  model: string;
  calls: number;
}

const data: Agent[] = [
  { id: "1", name: "Code Review Agent", status: "running", model: "Claude 4", calls: 1234 },
  { id: "2", name: "Research Agent", status: "idle", model: "GPT-4o", calls: 567 },
  { id: "3", name: "Deploy Bot", status: "error", model: "Claude 4", calls: 89 },
  { id: "4", name: "Test Runner", status: "running", model: "Gemini 2", calls: 2045 },
  { id: "5", name: "Docs Writer", status: "idle", model: "Claude 4", calls: 345 },
];

const columns = [
  { key: "name", header: "Agent", sortable: true },
  {
    key: "status",
    header: "Status",
    render: (row: Agent) => (
      <Badge variant={row.status === "running" ? "success" : row.status === "error" ? "danger" : "default"}>
        {row.status}
      </Badge>
    ),
  },
  { key: "model", header: "Model", sortable: true },
  { key: "calls", header: "API Calls", sortable: true },
];

export const Default: Story = {
  render: () => (
    <div className="w-[600px]">
      <Table columns={columns} data={data} rowKey={(r) => r.id} />
    </div>
  ),
};

export const WithPagination: Story = {
  render: () => (
    <div className="w-[600px]">
      <Table columns={columns} data={data} rowKey={(r) => r.id} pageSize={3} />
    </div>
  ),
};

export const Selectable: Story = {
  render: () => {
    const [selected, setSelected] = useState<Set<string>>(new Set());
    return (
      <div className="w-[600px]">
        <p className="text-xs text-gray-500 mb-2">Selected: {[...selected].join(", ") || "none"}</p>
        <Table columns={columns} data={data} rowKey={(r) => r.id} selectable selectedKeys={selected} onSelectionChange={setSelected} />
      </div>
    );
  },
};
