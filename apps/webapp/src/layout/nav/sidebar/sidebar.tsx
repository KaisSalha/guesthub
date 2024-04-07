import {
  Dribbble,
  ChevronRight,
  ChevronLeft,
  Home,
  CircleUser,
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
        "hidden md:flex flex-col bg-background-surface w-48",
        isCollapsed && "w-12"
      )}
    >
      <div
        ref={panelRef}
        className={cn(
          "hidden md:flex flex-col bg-background-surface w-48 min-h-screen fixed border-r border-border-subtle pt-4",
          isCollapsed && "w-12"
        )}
      >
        <div
          className={cn(
            "w-full flex flex-row items-center gap-2 mb-4",
            isCollapsed && "justify-center",
            !isCollapsed && "mx-5"
          )}
        >
          <Dribbble className="h-5 w-5 text-brand" />
          {!isCollapsed && <p className="font-bold tracking-wider">GuestHub</p>}
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
                title: "Profile",
                icon: CircleUser,
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
