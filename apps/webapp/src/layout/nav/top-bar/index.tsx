import { Dribbble } from "lucide-react";
import React from "react";

export const TopBar = () => {
  return (
    <div className="border-subtle fixed top-0 left-0 z-30 flex w-full border-b bg-background-surface md:hidden px-3">
      <div className="flex justify-between w-full">
        <div className="flex flex-row gap-2 p-2 justify-center items-center">
          <Dribbble className="h-6 w-6 text-brand" />
          <p className="font-bold tracking-wider text-lg">GuestHub</p>
        </div>
      </div>
    </div>
  );
};
