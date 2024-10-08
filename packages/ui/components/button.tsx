import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib";
import { BouncingDotsLoader } from "./bouncing-loader";

const buttonVariants = cva(
  "relative inline-flex flex-row items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-background-inverted text-foreground-inverted shadow hover:bg-background-inverted/90",
        destructive:
          "bg-background-destructive text-white shadow-sm hover:bg-background-destructive/90",
        outline: "border bg-background shadow-sm hover:bg-background-subtle/80",
        secondary: "bg-background-muted shadow-sm hover:bg-background-muted/80",
        ghost: "hover:bg-background-muted",
        link: "underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8 text-lg",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, disabled, loading, children, ...props },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        disabled={disabled}
      >
        {loading ? (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <BouncingDotsLoader />
            </div>
            <div className="opacity-0">{children}</div>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
