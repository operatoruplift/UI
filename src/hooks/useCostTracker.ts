"use client";

import { useState, useCallback, useMemo } from "react";

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens?: number;
  cacheWriteTokens?: number;
}

export interface CostRate {
  inputPer1M: number;
  outputPer1M: number;
  cacheReadPer1M?: number;
  cacheWritePer1M?: number;
}

export interface UseCostTrackerOptions {
  rates?: CostRate;
}

const DEFAULT_RATES: CostRate = {
  inputPer1M: 3,
  outputPer1M: 15,
  cacheReadPer1M: 0.3,
  cacheWritePer1M: 3.75,
};

export function useCostTracker({ rates = DEFAULT_RATES }: UseCostTrackerOptions = {}) {
  const [usage, setUsage] = useState<TokenUsage>({
    inputTokens: 0,
    outputTokens: 0,
    cacheReadTokens: 0,
    cacheWriteTokens: 0,
  });

  const addUsage = useCallback((delta: Partial<TokenUsage>) => {
    setUsage((prev) => ({
      inputTokens: prev.inputTokens + (delta.inputTokens ?? 0),
      outputTokens: prev.outputTokens + (delta.outputTokens ?? 0),
      cacheReadTokens: (prev.cacheReadTokens ?? 0) + (delta.cacheReadTokens ?? 0),
      cacheWriteTokens: (prev.cacheWriteTokens ?? 0) + (delta.cacheWriteTokens ?? 0),
    }));
  }, []);

  const reset = useCallback(() => {
    setUsage({ inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 });
  }, []);

  const totalTokens = usage.inputTokens + usage.outputTokens + (usage.cacheReadTokens ?? 0) + (usage.cacheWriteTokens ?? 0);

  const cost = useMemo(() => {
    const inputCost = (usage.inputTokens / 1_000_000) * rates.inputPer1M;
    const outputCost = (usage.outputTokens / 1_000_000) * rates.outputPer1M;
    const cacheReadCost = ((usage.cacheReadTokens ?? 0) / 1_000_000) * (rates.cacheReadPer1M ?? 0);
    const cacheWriteCost = ((usage.cacheWriteTokens ?? 0) / 1_000_000) * (rates.cacheWritePer1M ?? 0);
    return inputCost + outputCost + cacheReadCost + cacheWriteCost;
  }, [usage, rates]);

  const formatCost = useCallback(
    (value: number) => (value < 0.01 ? "<$0.01" : `$${value.toFixed(2)}`),
    []
  );

  return { usage, totalTokens, cost, formattedCost: formatCost(cost), addUsage, reset };
}
