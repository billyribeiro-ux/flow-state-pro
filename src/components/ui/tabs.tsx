"use client";

import { createContext, useContext, useState, type ReactNode, type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue>({
  value: "",
  onValueChange: () => {},
});

interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

function Tabs({ defaultValue = "", value: controlledValue, onValueChange, children, className, ...props }: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const handleChange = (v: string) => {
    if (!isControlled) setUncontrolledValue(v);
    onValueChange?.(v);
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleChange }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

const TabsList = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="tablist"
      className={cn(
        "inline-flex h-10 items-center justify-center gap-1 rounded-[var(--radius-lg)] bg-[var(--surface-secondary)] p-1",
        className
      )}
      {...props}
    />
  )
);
TabsList.displayName = "TabsList";

interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  disabled?: boolean;
}

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, disabled, ...props }, ref) => {
    const ctx = useContext(TabsContext);
    const isActive = ctx.value === value;

    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isActive}
        disabled={disabled}
        onClick={() => ctx.onValueChange(value)}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-md)] px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)] disabled:pointer-events-none disabled:opacity-50",
          isActive
            ? "bg-[var(--surface-primary)] text-[var(--text-primary)] shadow-[var(--shadow-xs)]"
            : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]",
          className
        )}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const ctx = useContext(TabsContext);
    if (ctx.value !== value) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        className={cn("mt-2 focus-visible:outline-none", className)}
        {...props}
      />
    );
  }
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
