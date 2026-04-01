import React from "react";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CostDisplayProps {
  cost: number;
  previousCost?: number;
  label?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function formatCost(cost: number): string {
  if (cost === 0) return "$0.00";
  if (cost < 0.01) return "<$0.01";
  if (cost >= 100) return `$${cost.toFixed(0)}`;
  return `$${cost.toFixed(2)}`;
}

export const CostDisplay: React.FC<CostDisplayProps> = ({
  cost,
  previousCost,
  label,
  showIcon = true,
  size = "md",
  className,
}) => {
  const change = previousCost != null && previousCost > 0
    ? ((cost - previousCost) / previousCost) * 100
    : undefined;

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      {showIcon && (
        <span className={cn(
          "flex items-center justify-center rounded-md bg-primary/10",
          size === "sm" && "h-6 w-6",
          size === "md" && "h-8 w-8",
          size === "lg" && "h-10 w-10",
        )}>
          <DollarSign className={cn(
            "text-primary",
            size === "sm" && "h-3 w-3",
            size === "md" && "h-4 w-4",
            size === "lg" && "h-5 w-5",
          )} />
        </span>
      )}

      <div>
        {label && <p className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</p>}
        <div className="flex items-baseline gap-2">
          <span className={cn(
            "font-mono font-semibold text-white",
            size === "sm" && "text-sm",
            size === "md" && "text-base",
            size === "lg" && "text-xl",
          )}>
            {formatCost(cost)}
          </span>

          {change !== undefined && (
            <span className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium",
              change > 0 ? "text-red-400" : change < 0 ? "text-green-400" : "text-gray-500"
            )}>
              {change > 0 ? <TrendingUp className="h-3 w-3" /> : change < 0 ? <TrendingDown className="h-3 w-3" /> : null}
              {change > 0 ? "+" : ""}{change.toFixed(1)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
