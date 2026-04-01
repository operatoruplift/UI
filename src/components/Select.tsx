"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  searchable?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  searchable = false,
  multiple = false,
  disabled = false,
  className,
  error,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selectedValues = multiple
    ? (Array.isArray(value) ? value : value ? [value] : [])
    : [];
  const singleValue = multiple ? undefined : (typeof value === "string" ? value : undefined);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = useCallback(
    (optValue: string) => {
      if (multiple) {
        const current = Array.isArray(value) ? value : value ? [value] : [];
        const next = current.includes(optValue)
          ? current.filter((v) => v !== optValue)
          : [...current, optValue];
        onChange?.(next);
      } else {
        onChange?.(optValue);
        setOpen(false);
        setSearch("");
      }
    },
    [multiple, value, onChange]
  );

  const removeValue = useCallback(
    (optValue: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (multiple && Array.isArray(value)) {
        onChange?.(value.filter((v) => v !== optValue));
      }
    },
    [multiple, value, onChange]
  );

  useEffect(() => {
    if (open && searchable) searchRef.current?.focus();
  }, [open, searchable]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setSearch("");
      }
    };
    if (open) {
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }
  }, [open]);

  const displayLabel = () => {
    if (multiple) {
      if (selectedValues.length === 0) return placeholder;
      return null; // render chips instead
    }
    const opt = options.find((o) => o.value === singleValue);
    return opt ? opt.label : placeholder;
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-sm border px-3 py-2 text-sm transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-primary/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-red-500/50"
            : open
              ? "border-primary/30 bg-white/5"
              : "border-white/5 bg-white/5 hover:border-white/10",
          "min-h-[36px]"
        )}
      >
        <span className="flex flex-wrap gap-1 flex-1 text-left">
          {multiple && selectedValues.length > 0
            ? selectedValues.map((v) => {
                const opt = options.find((o) => o.value === v);
                return (
                  <span
                    key={v}
                    className="inline-flex items-center gap-1 rounded bg-white/10 px-1.5 py-0.5 text-xs text-white"
                  >
                    {opt?.label}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-red-400"
                      onClick={(e) => removeValue(v, e)}
                    />
                  </span>
                );
              })
            : (
              <span className={cn(!singleValue && !selectedValues.length && "text-gray-500")}>
                {displayLabel()}
              </span>
            )}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-gray-400 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-white/10 bg-[#0c0c0c] shadow-xl">
          {searchable && (
            <div className="flex items-center gap-2 border-b border-white/5 px-3 py-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 outline-none"
              />
            </div>
          )}
          <div className="max-h-60 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">No results</div>
            ) : (
              filtered.map((opt) => {
                const isSelected = multiple
                  ? selectedValues.includes(opt.value)
                  : opt.value === singleValue;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                      "hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed",
                      isSelected && "text-primary"
                    )}
                  >
                    {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                    <span className="flex-1 text-left">{opt.label}</span>
                    {isSelected && <Check className="h-4 w-4 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};
