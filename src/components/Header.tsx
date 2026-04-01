"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface HeaderNavLink {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

export interface HeaderProps {
  logo?: React.ReactNode;
  navLinks?: HeaderNavLink[];
  userMenu?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  logo,
  navLinks,
  userMenu,
  actions,
  className,
}) => {
  return (
    <header
      className={cn(
        "flex items-center justify-between h-14 px-6 border-b border-white/5 bg-[#0c0c0c]",
        className
      )}
    >
      <div className="flex items-center gap-8">
        {logo && <div className="shrink-0">{logo}</div>}
        {navLinks && navLinks.length > 0 && (
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link, i) => (
              <button
                key={i}
                onClick={link.onClick}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm transition-colors",
                  link.active
                    ? "text-white bg-white/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                {link.label}
              </button>
            ))}
          </nav>
        )}
      </div>
      <div className="flex items-center gap-3">
        {actions}
        {userMenu}
      </div>
    </header>
  );
};
