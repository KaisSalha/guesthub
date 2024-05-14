import React from "react";
import { Dribbble } from "lucide-react";
import { cn } from "@guesthub/ui/lib";

interface LogoProps {
  isCollapsed?: boolean;
  className?: string;
}

const Logo = ({ className = "", isCollapsed = false }: LogoProps) => {
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-center gap-2",
        className
      )}
    >
      <Dribbble size={22} className="text-brand" />
      {!isCollapsed && (
        <p className="font-bold text-lg tracking-wider">GuestHub</p>
      )}
    </div>
  );
};

export default Logo;
