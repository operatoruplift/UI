import type { Meta, StoryObj } from "@storybook/react";
import { Mail } from "lucide-react";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Primitives/Input",
  component: Input,
  argTypes: {
    type: { control: "select", options: ["text", "password", "search", "email"] },
    disabled: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Text: Story = { args: { placeholder: "Enter text...", type: "text" } };
export const Password: Story = { args: { placeholder: "Enter password...", type: "password" } };
export const Search: Story = { args: { placeholder: "Search...", type: "search" } };
export const WithIcon: Story = { args: { placeholder: "Email", icon: <Mail className="h-4 w-4" /> } };
export const WithError: Story = { args: { placeholder: "Email", error: "Invalid email address", defaultValue: "not-an-email" } };
export const Disabled: Story = { args: { placeholder: "Disabled", disabled: true } };

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <Input placeholder="Default" />
      <Input type="password" placeholder="Password" />
      <Input type="search" placeholder="Search..." />
      <Input icon={<Mail className="h-4 w-4" />} placeholder="With icon" />
      <Input error="Required field" placeholder="Error state" />
      <Input disabled placeholder="Disabled" />
    </div>
  ),
};
