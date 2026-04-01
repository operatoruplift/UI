"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastData {
  id: string;
  variant: ToastVariant;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toast: (opts: Omit<ToastData, "id">) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
};

const icons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle className="h-4 w-4 text-green-400" />,
  error: <AlertCircle className="h-4 w-4 text-red-400" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-400" />,
  info: <Info className="h-4 w-4 text-blue-400" />,
};

const borderColors: Record<ToastVariant, string> = {
  success: "border-green-500/30",
  error: "border-red-500/30",
  warning: "border-amber-500/30",
  info: "border-blue-500/30",
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<(ToastData & { exiting?: boolean })[]>(
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const toast = useCallback(
    (opts: Omit<ToastData, "id">) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [...prev, { ...opts, id }]);
      const duration = opts.duration ?? 4000;
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} data={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem: React.FC<{
  data: ToastData & { exiting?: boolean };
  onDismiss: (id: string) => void;
}> = ({ data, onDismiss }) => {
  const [entered, setEntered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => setEntered(true));
  }, []);

  const style: React.CSSProperties = {
    transform: !entered || data.exiting ? "translateX(100%)" : "translateX(0)",
    opacity: !entered || data.exiting ? 0 : 1,
    transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
  };

  return (
    <div
      ref={ref}
      role="alert"
      style={style}
      className={cn(
        "pointer-events-auto flex items-start gap-3 rounded-lg border bg-[#0c0c0c] p-4 shadow-lg min-w-[300px] max-w-[400px]",
        borderColors[data.variant]
      )}
    >
      <span className="mt-0.5 shrink-0">{icons[data.variant]}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{data.title}</p>
        {data.message && (
          <p className="mt-1 text-sm text-gray-400">{data.message}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(data.id)}
        className="shrink-0 p-1 rounded hover:bg-white/5 transition-colors text-gray-500 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
