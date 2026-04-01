"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Select, type SelectOption } from "./Select";

export interface ModelOption {
  value: string;
  label: string;
  provider: "anthropic" | "openai" | "google" | "meta" | "xai";
}

export interface ModelSelectorProps {
  models: ModelOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const providerLabels: Record<string, string> = {
  anthropic: "A",
  openai: "O",
  google: "G",
  meta: "M",
  xai: "X",
};

const providerColors: Record<string, string> = {
  anthropic: "bg-orange-500/20 text-orange-400",
  openai: "bg-emerald-500/20 text-emerald-400",
  google: "bg-blue-500/20 text-blue-400",
  meta: "bg-indigo-500/20 text-indigo-400",
  xai: "bg-gray-500/20 text-gray-300",
};

const ProviderBadge: React.FC<{ provider: string }> = ({ provider }) => (
  <span
    className={cn(
      "inline-flex items-center justify-center h-5 w-5 rounded text-[10px] font-bold",
      providerColors[provider] || "bg-white/10 text-gray-400"
    )}
  >
    {providerLabels[provider] || "?"}
  </span>
);

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  value,
  onChange,
  className,
}) => {
  const options: SelectOption[] = models.map((m) => ({
    value: m.value,
    label: m.label,
    icon: <ProviderBadge provider={m.provider} />,
  }));

  return (
    <Select
      options={options}
      value={value}
      onChange={(v) => onChange?.(typeof v === "string" ? v : v[0])}
      placeholder="Select model..."
      searchable
      className={className}
    />
  );
};
