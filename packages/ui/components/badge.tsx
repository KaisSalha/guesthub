import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-background-inverted text-foreground-inverted shadow hover:bg-background-inverted/80",
        secondary:
          "border-transparent bg-background-muted hover:bg-background-muted/80",
        destructive:
          "border-transparent bg-background-destructive text-foreground-inverted dark:text-foreground shadow hover:bg-background-destructive/80",
        outline: "text-foreground",
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

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
