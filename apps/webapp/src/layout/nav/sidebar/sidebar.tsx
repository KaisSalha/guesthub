import { ChevronRight, ChevronLeft, CircleHelp } from "lucide-react";
import { NavItem } from "./nav-item";
import { cn } from "@guesthub/ui/lib";
import { Fragment, useCallback, useRef } from "react";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { useSidebarCollapsed } from "../../../hooks/use-sidebar-collapsed";
import { SearchBar } from "@/components/search-bar";
import Logo from "@/components/logo";
import { OrgSelect } from "@/components/org-select";
import { useNav } from "@/hooks/use-nav";

export const Sidebar = () => {
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const routerState = useRouterState();
  const [isCollapsed, setIsCollapsed] = useSidebarCollapsed();
  const toggleSize = useCallback(() => {
    setIsCollapsed((isCollapsed) => !isCollapsed);
  }, [setIsCollapsed]);
  const { sidebarSections } = useNav();

  return (
    <>
      <div
        className={cn(
          "hidden md:flex flex-col bg-background w-56",
          isCollapsed && "w-12"
        )}
      />
      <div
        ref={panelRef}
        className={cn(
          "hidden md:flex flex-col gap-3.5 bg-background-surface w-56 min-h-screen fixed border-r border-border-subtle py-5",
          isCollapsed && "w-12"
        )}
      >
        <div
          className={cn(
            "w-full flex justify-start",
            isCollapsed && "justify-center",
            !isCollapsed && "mx-4"
          )}
        >
          <Logo isCollapsed={isCollapsed} />
        </div>

        <div
          className={cn(
            "w-full flex items-center justify-center px-2",
            isCollapsed && "h-10"
          )}
        >
          <SearchBar isCollapsed={isCollapsed} />
        </div>
        <div>
          {sidebarSections.map((section, index) => (
            <Fragment key={index}>
              <NavItem isCollapsed={isCollapsed} links={section} />
            </Fragment>
          ))}
        </div>
        <div className="mt-auto">
          <div className="mb-2 mx-4">
            <OrgSelect />
          </div>
          <NavItem
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Help",
                icon: CircleHelp,
                selected: routerState.location.pathname.startsWith(
                  "/dashboard/guest/help"
                ),
                onClick: () =>
                  router.navigate({
                    to: "/dashboard/guest/help",
                  }),
              },
              {
                title: isCollapsed ? "Expand" : "Collapse",
                icon: isCollapsed ? ChevronRight : ChevronLeft,
                selected: false,
                onClick: toggleSize,
              },
            ]}
          />
        </div>
      </div>
    </>
  );
};
