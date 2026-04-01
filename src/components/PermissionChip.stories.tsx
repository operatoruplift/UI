import type { Meta, StoryObj } from "@storybook/react";
import { Globe, HardDrive, Terminal, Camera } from "lucide-react";
import { PermissionChip } from "./PermissionChip";

const meta: Meta<typeof PermissionChip> = {
  title: "Agent/PermissionChip",
  component: PermissionChip,
};
export default meta;
type Story = StoryObj<typeof PermissionChip>;

export const Granted: Story = {
  args: { icon: <Globe className="h-3.5 w-3.5" />, label: "Network", granted: true },
};

export const Denied: Story = {
  args: { icon: <HardDrive className="h-3.5 w-3.5" />, label: "File System", granted: false },
};

export const AllPermissions: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <PermissionChip icon={<Globe className="h-3.5 w-3.5" />} label="Network" granted />
      <PermissionChip icon={<HardDrive className="h-3.5 w-3.5" />} label="File System" granted />
      <PermissionChip icon={<Terminal className="h-3.5 w-3.5" />} label="Shell" granted={false} />
      <PermissionChip icon={<Camera className="h-3.5 w-3.5" />} label="Screen Capture" granted={false} />
    </div>
  ),
};
