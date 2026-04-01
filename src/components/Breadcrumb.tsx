import React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator,
  className,
}) => {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center gap-1.5 text-sm">
        {items.map((item, i) => (
          <li key={i} className="inline-flex items-center gap-1.5">
            {i > 0 && (
              <span className="text-gray-600">
                {separator ?? <ChevronRight className="h-3.5 w-3.5" />}
              </span>
            )}
            {item.onClick || item.href ? (
              <button
                onClick={item.onClick}
                className={cn(
                  "transition-colors",
                  i === items.length - 1
                    ? "text-white font-medium"
                    : "text-gray-400 hover:text-white"
                )}
              >
                {item.label}
              </button>
            ) : (
              <span
                className={cn(
                  i === items.length - 1
                    ? "text-white font-medium"
                    : "text-gray-400"
                )}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
