"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string | number;
  change?: { value: number; label?: string };
  icon?: React.ReactNode;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  icon,
  className,
}) => {
  const isPositive = change && change.value >= 0;

  return (
    <div
      className={cn(
        "rounded-lg border border-white/5 bg-card p-5",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
        </div>
        {icon && (
          <span className="rounded-lg bg-white/5 p-2 text-gray-400">
            {icon}
          </span>
        )}
      </div>
      {change && (
        <div className="mt-3 flex items-center gap-1.5">
          {isPositive ? (
            <TrendingUp className="h-3.5 w-3.5 text-green-400" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-red-400" />
          )}
          <span
            className={cn(
              "text-xs font-medium",
              isPositive ? "text-green-400" : "text-red-400"
            )}
          >
            {isPositive ? "+" : ""}
            {change.value}%
          </span>
          {change.label && (
            <span className="text-xs text-gray-500">{change.label}</span>
          )}
        </div>
      )}
    </div>
  );
};
