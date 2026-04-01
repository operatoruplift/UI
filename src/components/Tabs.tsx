"use client";

import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  content?: React.ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onChange?: (tabId: string) => void;
  variant?: "default" | "pills" | "underline";
  className?: string;
  children?: (activeTabId: string) => React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab: controlledActive,
  onChange,
  variant = "default",
  className,
  children,
}) => {
  const [internalActive, setInternalActive] = useState(tabs[0]?.id ?? "");
  const active = controlledActive ?? internalActive;

  const handleSelect = useCallback(
    (id: string) => {
      setInternalActive(id);
      onChange?.(id);
    },
    [onChange]
  );

  const activeContent = tabs.find((t) => t.id === active)?.content;

  return (
    <div className={className}>
      <div
        className={cn(
          "flex",
          variant === "default" && "gap-1 rounded-lg bg-white/[0.03] p-1",
          variant === "pills" && "gap-2",
          variant === "underline" && "gap-0 border-b border-white/5"
        )}
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            disabled={tab.disabled}
            onClick={() => handleSelect(tab.id)}
            className={cn(
              "inline-flex items-center gap-2 text-sm font-medium transition-all whitespace-nowrap",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              variant === "default" && [
                "rounded-md px-3 py-1.5",
                active === tab.id
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5",
              ],
              variant === "pills" && [
                "rounded-full px-4 py-1.5",
                active === tab.id
                  ? "bg-primary text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5",
              ],
              variant === "underline" && [
                "px-4 py-2.5 border-b-2 -mb-px",
                active === tab.id
                  ? "border-primary text-white"
                  : "border-transparent text-gray-400 hover:text-white hover:border-white/20",
              ]
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-3" role="tabpanel">
        {children ? children(active) : activeContent}
      </div>
    </div>
  );
};
