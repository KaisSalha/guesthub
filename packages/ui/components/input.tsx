import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "../lib";
import { VariantProps, cva } from "class-variance-authority";

const inputVariants = cva(
  "flex h-9 w-full rounded-md border bg-background px-3 py-1 text-sm transition-colors ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-foreground-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        subtle: "border-border-subtle",
      },
      shadow: {
        none: "shadow-none",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
        xl: "shadow-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      shadow: "sm",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  startIcon?: LucideIcon;
  endIcon?: LucideIcon;
  end?: React.ReactElement;
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, startIcon, endIcon, end, variant, shadow, ...props },
    ref
  ) => {
    const StartIcon = startIcon;
    const EndIcon = endIcon;
    const End = end;

    return (
      <div className="w-full relative">
        {StartIcon && (
          <div className="absolute left-1.5 top-1/2 transform -translate-y-1/2">
            <StartIcon size={18} className="text-foreground-muted" />
          </div>
        )}
        <input
          type={type}
          className={cn(
            inputVariants({ variant, shadow }),
            startIcon ? "pl-8" : "",
            endIcon ? "pr-8" : "",
            className
          )}
          ref={ref}
          {...props}
        />
        {EndIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <EndIcon className="text-foreground-muted" size={18} />
          </div>
        )}
        {End && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {End}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
