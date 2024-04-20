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
} from "lucide-react";
import { NavItem, NavProps } from "./nav-item";
import { cn } from "@guesthub/ui/lib";
import { Fragment, useCallback, useMemo, useRef } from "react";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";

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
        "hidden md:flex flex-col bg-background w-48",
        isCollapsed && "w-14"
      )}
    >
      <div
        ref={panelRef}
        className={cn(
          "hidden md:flex flex-col bg-background-surface w-48 min-h-screen fixed border-r border-border-subtle pt-5",
          isCollapsed && "w-auto"
        )}
      >
        <div
          className={cn(
            "w-full flex flex-row items-center gap-2 mb-4",
            isCollapsed && "justify-center",
            !isCollapsed && "mx-5"
          )}
        >
          <Dribbble size={22} className="text-brand" />
          {!isCollapsed && <p className="font-bold tracking-wider">GuestHub</p>}
        </div>
        {sections.map((section, index) => (
          <Fragment key={index}>
            <NavItem isCollapsed={isCollapsed} links={section} />
          </Fragment>
        ))}
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
            ]}
          />

          <NavItem
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
