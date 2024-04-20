import React from "react";

interface KbdProps {
  children: React.ReactNode;
}

export const Kbd = ({ children }: KbdProps) => {
  return (
    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1.5 rounded border bg-background-subtle px-1.5 font-mono text-xs text-foreground-subtle font-medium opacity-100">
      {children}
    </kbd>
  );
};
