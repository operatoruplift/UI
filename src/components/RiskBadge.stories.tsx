import type { Meta, StoryObj } from "@storybook/react";
import { RiskBadge } from "./RiskBadge";

const meta: Meta<typeof RiskBadge> = {
  title: "Agent/RiskBadge",
  component: RiskBadge,
  argTypes: {
    grade: { control: "select", options: ["A", "B", "C", "D", "F"] },
  },
};
export default meta;
type Story = StoryObj<typeof RiskBadge>;

export const GradeA: Story = { args: { grade: "A" } };
export const GradeB: Story = { args: { grade: "B" } };
export const GradeC: Story = { args: { grade: "C" } };
export const GradeD: Story = { args: { grade: "D" } };
export const GradeF: Story = { args: { grade: "F" } };

export const AllGrades: Story = {
  render: () => (
    <div className="flex gap-3">
      {(["A", "B", "C", "D", "F"] as const).map((g) => (
        <RiskBadge key={g} grade={g} />
      ))}
    </div>
  ),
};
