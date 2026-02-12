"use client";

import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils/cn";

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextValue>({
  open: false,
  setOpen: () => {},
});

function Dialog({
  children,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
}: {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = useCallback(
    (value: boolean) => {
      if (!isControlled) setUncontrolledOpen(value);
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange]
  );

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

function DialogTrigger({
  children,
  asChild,
  ...props
}: HTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const { setOpen } = useContext(DialogContext);
  return (
    <button onClick={() => setOpen(true)} {...props}>
      {children}
    </button>
  );
}

function DialogPortal({ children }: { children: ReactNode }) {
  const { open } = useContext(DialogContext);
  if (!open) return null;
  return <>{children}</>;
}

function DialogOverlay({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { setOpen } = useContext(DialogContext);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [setOpen]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[var(--z-modal)] bg-[var(--surface-overlay)] transition-opacity",
        className
      )}
      onClick={() => setOpen(false)}
      aria-hidden="true"
      {...props}
    />
  );
}

const DialogContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { setOpen } = useContext(DialogContext);
    return (
      <DialogPortal>
        <DialogOverlay />
        <div
          ref={ref}
          className={cn(
            "fixed left-1/2 top-1/2 z-[var(--z-modal)] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-6 shadow-[var(--shadow-xl)]",
            className
          )}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          {...props}
        >
          {children}
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 rounded-[var(--radius-sm)] p-1 text-[var(--text-tertiary)] opacity-70 transition-opacity hover:opacity-100"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      </DialogPortal>
    );
  }
);
DialogContent.displayName = "DialogContent";

const DialogHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
      {...props}
    />
  )
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
      {...props}
    />
  )
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight text-[var(--text-primary)]", className)}
      {...props}
    />
  )
);
DialogTitle.displayName = "DialogTitle";

const DialogDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-[var(--text-secondary)]", className)}
      {...props}
    />
  )
);
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
