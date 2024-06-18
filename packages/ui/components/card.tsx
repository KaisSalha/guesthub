import * as React from "react";

import { cn } from "../lib";
import { VariantProps, cva } from "class-variance-authority";

const cardVariants = cva(
  "rounded-lg border border-border-subtle shadow-sm w-full overflow-hidden",
  {
    variants: {
      variant: {
        default: "",
        desktopOnly:
          "shadow-none md:rounded-lg border-0 md:border md:border-border-subtle md:shadow-sm",
        info: "bg-background-info border-none",
        success: "bg-background-success border-none",
        attention: "bg-background-attention border-none",
        error: "bg-background-error border-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const CardComponent = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, className }))}
      {...props}
    />
  )
);
CardComponent.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-4 md:py-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-foreground-subtle", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

interface CardComposition
  extends React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> &
      VariantProps<typeof cardVariants> &
      React.RefAttributes<HTMLDivElement>
  > {
  Header: typeof CardHeader;
  Footer: typeof CardFooter;
  Title: typeof CardTitle;
  Description: typeof CardDescription;
  Content: typeof CardContent;
}

const Card = CardComponent as CardComposition;
Card.Header = CardHeader;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;

export { Card };
