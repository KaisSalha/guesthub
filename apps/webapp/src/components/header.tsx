import React from "react";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <div className="w-full hidden md:flex flex-row justify-between items-start relative">
      <div className="w-fit flex flex-col">
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-sm">{subtitle}</p>
      </div>
    </div>
  );
};
