import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 w-fit cursor-default",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-background-inverted text-foreground-inverted hover:bg-background-inverted/80",
        secondary:
          "border-transparent bg-background-muted hover:bg-background-muted/80",
        info: "border-transparent bg-background-info text-foreground-info hover:bg-background-info/80",
        success:
          "border-transparent bg-background-success text-foreground-success hover:bg-background-success/80",
        attention:
          "border-transparent bg-background-attention text-foreground-attention hover:bg-background-attention/80",
        destructive:
          "border-transparent bg-background-destructive text-foreground-destructive hover:bg-background-destructive/80",
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

const Badge = ({ className, variant, ...props }: BadgeProps) => {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
};

export { Badge, badgeVariants };
