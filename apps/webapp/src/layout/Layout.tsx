import { Sidebar } from "./sidebar";

interface LayoutProps {
  defaultLayout?: number[];
  defaultCollapsed?: boolean;
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="h-full min-h-screen items-stretch flex flex-row">
      <Sidebar />
      <div className="px-4 pt-4 flex-1 flex flex-col gap-6 max-w-full">
        {children}
      </div>
    </div>
  );
}
