import Logo from "@/components/logo";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="h-full min-h-screen px-4 md:px-8 py-3 flex-1 flex flex-col items-center gap-6 md:gap-12">
      <Logo />
      {children}
    </div>
  );
};
