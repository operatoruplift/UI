"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  type?: "text" | "password" | "search" | "email" | "number" | "url" | "tel";
  icon?: React.ReactNode;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", icon, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const isSearch = type === "search";
    const inputType = isPassword && showPassword ? "text" : type;
    const hasLeftIcon = icon || isSearch;

    return (
      <div className="w-full">
        <div className="relative">
          {hasLeftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              {isSearch ? <Search className="h-4 w-4" /> : icon}
            </span>
          )}
          <input
            type={inputType}
            ref={ref}
            className={cn(
              "flex h-9 w-full rounded-sm border bg-white/5 px-3 py-1 text-sm text-white placeholder:text-gray-500 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error
                ? "border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50"
                : "border-white/5 hover:border-white/10",
              hasLeftIcon && "pl-9",
              isPassword && "pr-9",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
