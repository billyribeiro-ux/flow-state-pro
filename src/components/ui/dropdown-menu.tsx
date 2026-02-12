"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
  type HTMLAttributes,
  forwardRef,
} from "react";
import { cn } from "@/lib/utils/cn";

interface DropdownContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownContext = createContext<DropdownContextValue>({
  open: false,
  setOpen: () => {},
});

function DropdownMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
}

function DropdownMenuTrigger({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLButtonElement>) {
  const { open, setOpen } = useContext(DropdownContext);
  return (
    <button
      onClick={() => setOpen(!open)}
      aria-expanded={open}
      aria-haspopup="true"
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

const DropdownMenuContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = useContext(DropdownContext);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!open) return;
      const handleClick = (e: MouseEvent) => {
        if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("mousedown", handleClick);
        document.removeEventListener("keydown", handleEscape);
      };
    }, [open, setOpen]);

    if (!open) return null;

    return (
      <div
        ref={contentRef}
        className={cn(
          "absolute right-0 top-full z-[var(--z-dropdown)] mt-1 min-w-[8rem] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-1 shadow-[var(--shadow-lg)]",
          className
        )}
        role="menu"
        {...props}
      >
        {children}
      </div>
    );
  }
);
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = forwardRef<HTMLButtonElement, HTMLAttributes<HTMLButtonElement> & { disabled?: boolean }>(
  ({ className, disabled, ...props }, ref) => (
    <button
      ref={ref}
      role="menuitem"
      disabled={disabled}
      className={cn(
        "flex w-full cursor-pointer items-center gap-2 rounded-[var(--radius-md)] px-2 py-1.5 text-sm text-[var(--text-primary)] outline-none transition-colors hover:bg-[var(--surface-secondary)] focus:bg-[var(--surface-secondary)] disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
DropdownMenuItem.displayName = "DropdownMenuItem";

function DropdownMenuSeparator({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="separator"
      className={cn("-mx-1 my-1 h-px bg-[var(--border-subtle)]", className)}
      {...props}
    />
  );
}

const DropdownMenuLabel = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("px-2 py-1.5 text-xs font-semibold text-[var(--text-tertiary)]", className)}
      {...props}
    />
  )
);
DropdownMenuLabel.displayName = "DropdownMenuLabel";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
};
