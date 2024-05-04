import React from "react";

export const Header = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full hidden md:flex flex-row justify-between items-start relative ">
      {children}
    </div>
  );
};
