import {
  Dribbble,
  ChevronRight,
  ChevronLeft,
  Settings,
  Home,
} from "lucide-react";
import { Nav, NavProps } from "./nav";
import { cn } from "@guesthub/ui/lib";
import { Fragment, useCallback, useMemo, useRef, useState } from "react";
import { useRouter, useRouterState } from "@tanstack/react-router";

export const Sidebar = () => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const routerState = useRouterState();

  const sections: NavProps["links"][] = useMemo(
    () => [
      [
        {
          title: "Home",
          icon: Home,
          selected: routerState.location.pathname === "/dashboard",
          onClick: () =>
            router.navigate({
              to: "/dashboard",
            }),
        },
      ],
    ],
    [router, routerState.location.pathname]
  );

  const toggleSize = useCallback(() => {
    setIsCollapsed((isCollapsed) => !isCollapsed);
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col bg-zinc-50 w-48",
        isCollapsed && "transition-all duration-300 ease-in-out w-12"
      )}
    >
      <div
        ref={panelRef}
        className={cn(
          "flex flex-col bg-zinc-50 w-48 min-h-screen fixed  border-r-2 border-zinc-100",
          isCollapsed && "transition-all duration-300 ease-in-out w-12"
        )}
      >
        <div
          className={cn(
            "w-full flex items-center justify-center mt-3 mb-2",
            isCollapsed && "mb-4"
          )}
        >
          <Dribbble
            className={cn(
              !isCollapsed && "h-8 w-8",
              isCollapsed && "h-5 w-5 ml-[2px] mb-[3px]",
              "text-brand",
              "transition-all duration-300 ease-in-out"
            )}
          />
        </div>
        {sections.map((section, index) => (
          <Fragment key={index}>
            <Nav isCollapsed={isCollapsed} links={section} />
          </Fragment>
        ))}
        <div className="mt-auto">
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Settings",
                icon: Settings,
                selected: false,
                onClick: () =>
                  router.navigate({
                    to: "/dashboard",
                  }),
              },
            ]}
          />

          <Nav
            isCollapsed={isCollapsed}
            links={[
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
    </div>
  );
};
