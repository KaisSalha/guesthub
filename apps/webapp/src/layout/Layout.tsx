import { Header } from "@/components/header";
import { NavBar } from "./nav/nav";

interface LayoutProps {
  defaultLayout?: number[];
  defaultCollapsed?: boolean;
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="h-full min-h-screen flex">
      <NavBar />
      <div className="px-2 md:px-6 py-16 md:py-4 flex-1 flex flex-col gap-6 max-w-full overflow-hidden">
        <Header />
        <div className="flex-1overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
