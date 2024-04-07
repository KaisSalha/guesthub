import { cn } from "@guesthub/ui/lib";
import { LucideIcon } from "lucide-react";
import React from "react";

export interface NavItemProp {
  title: string;
  label?: string;
  icon: LucideIcon;
  selected: boolean;
  onClick: () => void;
}

export const NavItem = (props: NavItemProp) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-0.5 justify-center items-center text-foreground-subtle/60 text-xs p-3",
        props.selected && "text-foreground"
      )}
      onClick={props.onClick}
    >
      <props.icon size={22} />
      <span>{props.title}</span>
    </div>
  );
};
