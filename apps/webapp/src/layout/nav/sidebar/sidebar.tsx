import {
  Dribbble,
  ChevronRight,
  ChevronLeft,
  Home,
  CircleUser,
  Calendar,
  Ticket,
  Users,
  UsersRound,
  ConciergeBell,
  LineChart,
  CircleHelp,
} from "lucide-react";
import { NavItem, NavProps } from "./nav-item";
import { cn } from "@guesthub/ui/lib";
import { Fragment, useCallback, useMemo, useRef } from "react";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import { SearchBar } from "@/components/search-bar";

const sidebarCollapsedAtom = atomWithStorage("sidebar-collapsed", false);

export const Sidebar = () => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useAtom(sidebarCollapsedAtom);
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
        {
          title: "Events",
          icon: Ticket,
          selected:
            routerState.location.pathname.startsWith("/dashboard/events"),
          onClick: () =>
            router.navigate({
              to: "/dashboard/events",
            }),
        },
        {
          title: "Calendar",
          icon: Calendar,
          selected: routerState.location.pathname.startsWith(
            "/dashboard/calendar"
          ),
          onClick: () =>
            router.navigate({
              to: "/dashboard/calendar",
            }),
        },
        {
          title: "Requests",
          icon: ConciergeBell,
          selected: routerState.location.pathname.startsWith(
            "/dashboard/requests"
          ),
          onClick: () =>
            router.navigate({
              to: "/dashboard/requests",
            }),
        },
        {
          title: "Guests",
          icon: UsersRound,
          selected:
            routerState.location.pathname.startsWith("/dashboard/guests"),
          onClick: () =>
            router.navigate({
              to: "/dashboard/guests",
            }),
        },
        {
          title: "Reports",
          icon: LineChart,
          selected:
            routerState.location.pathname.startsWith("/dashboard/reports"),
          onClick: () =>
            router.navigate({
              to: "/dashboard/reports",
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
        "hidden md:flex flex-col bg-background w-60",
        isCollapsed && "w-14"
      )}
    >
      <div
        ref={panelRef}
        className={cn(
          "hidden md:flex flex-col gap-3.5 bg-background-surface w-60 min-h-screen fixed border-r border-border-subtle py-4",
          isCollapsed && "w-auto"
        )}
      >
        <div
          className={cn(
            "w-full flex flex-row items-center gap-2",
            isCollapsed && "justify-center",
            !isCollapsed && "px-3"
          )}
        >
          <Dribbble size={22} className="text-brand" />
          {!isCollapsed && (
            <p className="font-bold text-lg tracking-wider">GuestHub</p>
          )}
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
          {sections.map((section, index) => (
            <Fragment key={index}>
              <NavItem isCollapsed={isCollapsed} links={section} />
            </Fragment>
          ))}
        </div>
        <div className="mt-auto">
          <NavItem
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Team",
                icon: Users,
                selected:
                  routerState.location.pathname.startsWith("/dashboard/team"),
                onClick: () =>
                  router.navigate({
                    to: "/dashboard/team",
                  }),
              },
              {
                title: "Profile",
                icon: CircleUser,
                selected:
                  routerState.location.pathname.startsWith(
                    "/dashboard/profile"
                  ),
                onClick: () =>
                  router.navigate({
                    to: "/dashboard/profile",
                  }),
              },
              {
                title: "Help",
                icon: CircleHelp,
                selected:
                  routerState.location.pathname.startsWith("/dashboard/help"),
                onClick: () =>
                  router.navigate({
                    to: "/dashboard/help",
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
    </div>
  );
};
