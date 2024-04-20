import React from "react";
import { Search } from "lucide-react";
import { Input } from "@guesthub/ui/input";
import { Kbd } from "@guesthub/ui/kbd";

export const Header = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full hidden md:flex flex-row justify-between items-center relative">
      {children}

      <div className="w-64">
        <Input
          startIcon={Search}
          placeholder="Search for anything"
          end={
            <Kbd>
              <span className="text-base">⌘</span>
              <span>K</span>
            </Kbd>
          }
        />
      </div>
    </div>
  );
};
