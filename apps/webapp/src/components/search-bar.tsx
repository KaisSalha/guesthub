import React from "react";
import { Search } from "lucide-react";
import { Input } from "@guesthub/ui/input";
import { Kbd } from "@guesthub/ui/kbd";

export const SearchBar = () => {
  return (
    <div className="w-full max-w-96">
      <Input
        startIcon={Search}
        placeholder="Search"
        variant="subtle"
        shadow="none"
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
