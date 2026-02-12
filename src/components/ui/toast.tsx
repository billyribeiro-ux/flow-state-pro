"use client";

import { useState, useCallback, createContext, useContext, type ReactNode } from "react";
import { X, CheckCircle, Warning, Info, WarningCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils/cn";

type ToastVariant = "default" | "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

let toastCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = `toast-${++toastCounter}`;
      setToasts((prev) => [...prev, { ...toast, id }]);
      const duration = toast.duration ?? 5000;
      setTimeout(() => removeToast(id), duration);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

const VARIANT_ICON: Record<ToastVariant, React.ElementType> = {
  default: Info,
  success: CheckCircle,
  error: WarningCircle,
  warning: Warning,
  info: Info,
};

const VARIANT_COLOR: Record<ToastVariant, string> = {
  default: "text-[var(--color-brand-600)]",
  success: "text-[var(--color-success)]",
  error: "text-[var(--color-error)]",
  warning: "text-[var(--color-warning)]",
  info: "text-[var(--color-brand-600)]",
};

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[var(--z-toast)] flex flex-col gap-2">
      {toasts.map((toast) => {
        const variant = toast.variant ?? "default";
        const Icon = VARIANT_ICON[variant];
        return (
          <div
            key={toast.id}
            className="pointer-events-auto w-full max-w-sm animate-[slideUp_0.3s_ease-out] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-elevated)] shadow-[var(--shadow-lg)]"
            role="alert"
          >
            <div className="flex items-start gap-3 p-4">
              <Icon size={18} weight="fill" className={cn("mt-0.5 shrink-0", VARIANT_COLOR[variant])} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--text-primary)]">{toast.title}</p>
                {toast.description && (
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">{toast.description}</p>
                )}
              </div>
              <button
                onClick={() => onRemove(toast.id)}
                className="shrink-0 rounded-[var(--radius-sm)] p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
