import { ChevronRight, LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@guesthub/ui/tooltip";
import { cn } from "@guesthub/ui/lib";

export interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    selected: boolean;
    onClick: () => void;
  }[];
}

export function Nav({ links, isCollapsed }: NavProps) {
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
                <div className={cn("")}>
                  <div
                    className={cn(
                      "inline-flex items-center whitespace-nowrap font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 text-xs text-text hover:cursor-pointer hover:bg-background-subtle rounded-md px-2 mx-2",
                      link.selected && "bg-background-muted"
                    )}
                    onClick={link.onClick}
                  >
                    <link.icon className={cn("h-4 w-4")} />
                    <span className="sr-only">{link.title}</span>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-white">{link.label}</span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <div key={index} className={cn("px-4")}>
              <div
                key={index}
                className={cn(
                  "inline-flex items-center whitespace-nowrap font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-2 text-xs text-text hover:cursor-pointer hover:bg-background-subtle w-full rounded-md ",
                  link.selected && "bg-background-muted"
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
