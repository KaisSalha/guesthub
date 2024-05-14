import React from "react";
import { Search } from "lucide-react";
import { Input } from "@guesthub/ui/input";
import { Kbd } from "@guesthub/ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "@guesthub/ui/tooltip";

interface SearchBarProps {
  isCollapsed?: boolean;
}

export const SearchBar = ({ isCollapsed = false }: SearchBarProps) => {
  if (isCollapsed)
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Search
            size={17}
            className="hover:cursor-pointer text-foreground-subtle"
          />
        </TooltipTrigger>
        <TooltipContent side="right">Search</TooltipContent>
      </Tooltip>
    );

  return (
    <div className="w-full">
      <Input
        startIcon={Search}
        placeholder="Search"
        variant="subtle"
        end={
          <Kbd>
            <span className="text-base">⌘</span>
            <span>K</span>
          </Kbd>
        }
      />
    </div>
  );
};
