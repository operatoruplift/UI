import type { Meta, StoryObj } from "@storybook/react";
import { ToastProvider, useToast } from "./Toast";
import { Button } from "./Button";

const meta: Meta = {
  title: "Primitives/Toast",
  decorators: [(Story) => <ToastProvider><Story /></ToastProvider>],
};
export default meta;
type Story = StoryObj;

const ToastDemo = () => {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="outline" onClick={() => toast({ variant: "success", title: "Success", message: "Operation completed" })}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast({ variant: "error", title: "Error", message: "Something went wrong" })}>
        Error
      </Button>
      <Button variant="outline" onClick={() => toast({ variant: "warning", title: "Warning", message: "Proceed with caution" })}>
        Warning
      </Button>
      <Button variant="outline" onClick={() => toast({ variant: "info", title: "Info", message: "Here's some information" })}>
        Info
      </Button>
    </div>
  );
};

export const AllVariants: Story = { render: () => <ToastDemo /> };
