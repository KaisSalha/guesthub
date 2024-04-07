import { NavBar } from "./nav/nav";

interface LayoutProps {
  defaultLayout?: number[];
  defaultCollapsed?: boolean;
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="h-full min-h-screen items-stretch flex flex-row">
      <NavBar />
      <div className="px-4 md:px-6 py-16 md:py-4 flex-1 flex flex-col gap-6 max-w-full">
        {children}
      </div>
    </div>
  );
}
