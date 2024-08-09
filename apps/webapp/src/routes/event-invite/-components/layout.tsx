import Logo from "@/components/logo";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="h-full min-h-screen flex flex-col px-4 md:px-20 lg:px-36 py-3">
      <Logo className="md:w-fit self-start" />
      <div className="flex flex-1 items-center justify-center">{children}</div>
    </div>
  );
};
