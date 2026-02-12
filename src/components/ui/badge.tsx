import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-[var(--radius-full)] px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-brand-100)] text-[var(--color-brand-800)]",
        secondary:
          "bg-[var(--surface-tertiary)] text-[var(--text-secondary)]",
        success:
          "bg-emerald-100 text-emerald-800",
        warning:
          "bg-amber-100 text-amber-800",
        destructive:
          "bg-red-100 text-red-800",
        outline:
          "border border-[var(--border-default)] text-[var(--text-secondary)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
