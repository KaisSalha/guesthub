import { ChevronRight, LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@guesthub/ui/tooltip";
import { cn } from "@guesthub/ui/lib";

export interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    icon: LucideIcon;
    selected: boolean;
    onClick: () => void;
  }[];
}

export function NavItem({ links, isCollapsed }: NavProps) {
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2"
    >
      <nav className="grid gap-3">
        {links.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "inline-flex items-center whitespace-nowrap font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 text-sm hover:cursor-pointer hover:bg-background-emphasis rounded-lg px-2 mx-2 text-foreground-subtle",
                    link.selected && "bg-background-muted/85 text-foreground"
                  )}
                  onClick={link.onClick}
                >
                  <link.icon className={cn("h-4 w-4")} />
                  <span className="sr-only">{link.title}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">{link.title}</TooltipContent>
            </Tooltip>
          ) : (
            <div key={index} className="px-4">
              <div
                key={index}
                className={cn(
                  "inline-flex items-center whitespace-nowrap font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-2.5 text-sm hover:cursor-pointer hover:bg-background-muted w-full rounded-md text-foreground-subtle",
                  link.selected && "bg-background-muted/85 text-foreground"
                )}
                onClick={link.onClick}
              >
                <link.icon className={cn("mr-2 h-4 w-4")} />
                {link.title}
                {link.selected && (
                  <span className={cn("ml-auto")}>
                    <ChevronRight className="h-4 w-4" />
                  </span>
                )}
              </div>
            </div>
          )
        )}
      </nav>
    </div>
  );
}
