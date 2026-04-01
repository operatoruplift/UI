"use client";

import React, { useState, useMemo, useCallback } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TableColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: (row: T, index: number) => string;
  pageSize?: number;
  selectable?: boolean;
  selectedKeys?: Set<string>;
  onSelectionChange?: (keys: Set<string>) => void;
  className?: string;
  emptyMessage?: string;
}

type SortDir = "asc" | "desc";

export function Table<T>({
  columns,
  data,
  rowKey,
  pageSize,
  selectable = false,
  selectedKeys,
  onSelectionChange,
  className,
  emptyMessage = "No data",
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortKey];
      const bv = (b as Record<string, unknown>)[sortKey];
      if (av == null || bv == null) return 0;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  const totalPages = pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const paginated = pageSize
    ? sorted.slice(page * pageSize, (page + 1) * pageSize)
    : sorted;

  const toggleSort = useCallback(
    (key: string) => {
      if (sortKey === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDir("asc");
      }
    },
    [sortKey]
  );

  const toggleRow = useCallback(
    (key: string) => {
      if (!onSelectionChange) return;
      const next = new Set(selectedKeys);
      next.has(key) ? next.delete(key) : next.add(key);
      onSelectionChange(next);
    },
    [selectedKeys, onSelectionChange]
  );

  const toggleAll = useCallback(() => {
    if (!onSelectionChange) return;
    const allKeys = paginated.map((r, i) => rowKey(r, page * (pageSize ?? 0) + i));
    const allSelected = allKeys.every((k) => selectedKeys?.has(k));
    onSelectionChange(allSelected ? new Set() : new Set(allKeys));
  }, [paginated, rowKey, page, pageSize, selectedKeys, onSelectionChange]);

  return (
    <div className={cn("w-full", className)}>
      <div className="overflow-x-auto rounded-lg border border-white/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              {selectable && (
                <th className="w-10 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={
                      paginated.length > 0 &&
                      paginated.every((r, i) =>
                        selectedKeys?.has(rowKey(r, page * (pageSize ?? 0) + i))
                      )
                    }
                    onChange={toggleAll}
                    className="rounded border-white/20 bg-transparent"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-left font-medium text-gray-400",
                    col.sortable && "cursor-pointer select-none hover:text-white",
                    col.className
                  )}
                  onClick={col.sortable ? () => toggleSort(col.key) : undefined}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && sortKey === col.key && (
                      sortDir === "asc" ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginated.map((row, i) => {
                const key = rowKey(row, page * (pageSize ?? 0) + i);
                const selected = selectedKeys?.has(key);
                return (
                  <tr
                    key={key}
                    className={cn(
                      "border-b border-white/5 transition-colors hover:bg-white/[0.02]",
                      selected && "bg-primary/5"
                    )}
                  >
                    {selectable && (
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={!!selected}
                          onChange={() => toggleRow(key)}
                          className="rounded border-white/20 bg-transparent"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn("px-4 py-3 text-white", col.className)}
                      >
                        {col.render
                          ? col.render(row, page * (pageSize ?? 0) + i)
                          : String(
                              (row as Record<string, unknown>)[col.key] ?? ""
                            )}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pageSize && totalPages > 1 && (
        <div className="flex items-center justify-between px-2 pt-3">
          <span className="text-xs text-gray-500">
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="rounded p-1 text-gray-400 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="rounded p-1 text-gray-400 hover:text-white disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
