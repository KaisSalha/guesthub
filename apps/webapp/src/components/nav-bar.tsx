import { ScrollArea, ScrollBar } from "@guesthub/ui/scroll-area";
import { cn } from "@guesthub/ui/lib";

interface NavBarProps {
  tabs: {
    title: string;
    onClick: () => void;
    selected: boolean;
  }[];
}

export const NavBar = ({ tabs }: NavBarProps) => {
  return (
    <div className="border-b border-border-subtle mb-5 md:mb-6">
      <ScrollArea>
        <div className="flex flex-row gap-8 *:pb-3 *:cursor-pointer *:text-sm">
          {tabs.map((tab) => (
            <nav
              key={tab.title}
              className={cn(
                "font-medium",
                tab.selected
                  ? "border-b border-brand"
                  : "text-foreground-muted hover:text-foreground"
              )}
              onClick={tab.onClick}
            >
              {tab.title}
            </nav>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
