"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SidebarNavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  badge?: React.ReactNode;
}

export interface SidebarSection {
  title?: string;
  items: SidebarNavItem[];
}

export interface SidebarProps {
  sections: SidebarSection[];
  collapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sections,
  collapsed: controlledCollapsed,
  onToggle,
  header,
  footer,
  className,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = controlledCollapsed ?? internalCollapsed;

  const toggle = () => {
    const next = !collapsed;
    setInternalCollapsed(next);
    onToggle?.(next);
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-full border-r border-white/5 bg-[#0c0c0c] transition-all duration-200",
        collapsed ? "w-16" : "w-60",
        className
      )}
    >
      {header && (
        <div className="flex items-center px-4 py-4 border-b border-white/5">
          {header}
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-2">
        {sections.map((section, si) => (
          <div key={si} className="mb-2">
            {section.title && !collapsed && (
              <p className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                {section.title}
              </p>
            )}
            {section.items.map((item) => (
              <button
                key={item.id}
                onClick={item.onClick}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors",
                  "hover:bg-white/5",
                  item.active
                    ? "text-primary bg-primary/10"
                    : "text-gray-400 hover:text-white"
                )}
                title={collapsed ? item.label : undefined}
              >
                {item.icon && (
                  <span className="shrink-0 w-5 h-5 flex items-center justify-center">
                    {item.icon}
                  </span>
                )}
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left truncate">
                      {item.label}
                    </span>
                    {item.badge}
                  </>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="border-t border-white/5">
        {footer && !collapsed && <div className="px-4 py-3">{footer}</div>}
        <button
          onClick={toggle}
          className="flex w-full items-center justify-center py-3 text-gray-500 hover:text-white transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  );
};
