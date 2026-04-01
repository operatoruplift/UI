"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type RiskGrade = "A" | "B" | "C" | "D" | "F";

export interface RiskBadgeProps {
  grade: RiskGrade;
  className?: string;
}

const gradeStyles: Record<RiskGrade, string> = {
  A: "bg-green-500/20 text-green-400 border-green-500/30",
  B: "bg-lime-500/20 text-lime-400 border-lime-500/30",
  C: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  D: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  F: "bg-red-500/20 text-red-400 border-red-500/30",
};

export const RiskBadge: React.FC<RiskBadgeProps> = ({ grade, className }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center h-7 w-7 rounded-md border text-xs font-bold",
        gradeStyles[grade],
        className
      )}
    >
      {grade}
    </span>
  );
};
