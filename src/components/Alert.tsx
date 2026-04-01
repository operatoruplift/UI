import React from "react";
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AlertProps {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<string, { border: string; bg: string; icon: React.ReactNode; iconColor: string }> = {
  info: {
    border: "border-blue-500/20",
    bg: "bg-blue-500/5",
    icon: <Info className="h-4 w-4" />,
    iconColor: "text-blue-400",
  },
  success: {
    border: "border-green-500/20",
    bg: "bg-green-500/5",
    icon: <CheckCircle2 className="h-4 w-4" />,
    iconColor: "text-green-400",
  },
  warning: {
    border: "border-yellow-500/20",
    bg: "bg-yellow-500/5",
    icon: <AlertTriangle className="h-4 w-4" />,
    iconColor: "text-yellow-400",
  },
  error: {
    border: "border-red-500/20",
    bg: "bg-red-500/5",
    icon: <AlertCircle className="h-4 w-4" />,
    iconColor: "text-red-400",
  },
};

export const Alert: React.FC<AlertProps> = ({
  variant = "info",
  title,
  children,
  dismissible = false,
  onDismiss,
  icon,
  className,
}) => {
  const style = variantStyles[variant];

  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 rounded-lg border p-4",
        style.border,
        style.bg,
        className
      )}
    >
      <span className={cn("shrink-0 mt-0.5", style.iconColor)}>
        {icon ?? style.icon}
      </span>
      <div className="flex-1 min-w-0">
        {title && <p className="font-medium text-white text-sm">{title}</p>}
        <div className={cn("text-sm text-gray-300", title && "mt-1")}>{children}</div>
      </div>
      {dismissible && (
        <button
          onClick={onDismiss}
          className="shrink-0 p-0.5 text-gray-500 hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
