import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "../lib";

const SimpleTabs = TabsPrimitive.Root;

const SimpleTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "no-scrollbar flex max-h-9 gap-2 overflow-x-scroll rounded-md mb-4 lg:mb-5",
      className
    )}
    {...props}
  />
));
SimpleTabsList.displayName = TabsPrimitive.List.displayName;

const SimpleTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center text-foreground whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background-subtle",
      "hover:bg-subtle hover:text-emphasis text-default inline-flex items-center justify-center whitespace-nowrap rounded-[6px] p-2 text-sm font-medium leading-4 transition md:mb-0 px-4 py-2.5",
      className
    )}
    {...props}
  />
));
SimpleTabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const SimpleTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
SimpleTabsContent.displayName = TabsPrimitive.Content.displayName;

export { SimpleTabs, SimpleTabsList, SimpleTabsTrigger, SimpleTabsContent };
