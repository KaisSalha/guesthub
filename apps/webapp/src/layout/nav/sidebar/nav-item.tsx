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
    <div data-collapsed={isCollapsed} className="py-2">
      <nav className="grid gap-3">
        {links.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "inline-flex items-center whitespace-nowrap font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 text-sm hover:cursor-pointer hover:bg-background-muted/80 rounded-lg px-2 mx-2 text-foreground-subtle/70 border border-border/0",
                    link.selected &&
                      "bg-background-subtle text-foreground border-border/100",
                    !link.selected && "hover:text-foreground-subtle/90"
                  )}
                  onClick={link.onClick}
                >
                  <link.icon size={17} />
                  <span className="sr-only">{link.title}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">{link.title}</TooltipContent>
            </Tooltip>
          ) : (
            <div key={index} className="px-2.5">
              <div
                key={index}
                className={cn(
                  "inline-flex items-center whitespace-nowrap font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-2.5 text-sm hover:cursor-pointer hover:bg-background-muted/80 w-full rounded-md text-foreground-subtle/70 border border-border/0",
                  link.selected &&
                    "bg-background-subtle text-foreground border-border/100",
                  !link.selected && "hover:text-foreground-subtle/90"
                )}
                onClick={link.onClick}
              >
                <link.icon size={17} className={cn("mr-2")} />
                {link.title}
                {link.selected && (
                  <span className={cn("ml-auto")}>
                    <ChevronRight size={17} />
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
